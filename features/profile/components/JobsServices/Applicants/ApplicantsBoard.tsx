"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    UniqueIdentifier,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { ArrowLeft, Search, Pencil, ArrowRight, Trash2 } from 'lucide-react';
import { Select } from 'antd';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useSearchParams, useRouter } from 'next/navigation';

import { Applicant, ApplicantStatus } from './applicantsTypes';
import SortableApplicantCard, { ApplicantCardUI } from './ApplicantCard';
import ApplicantDetailModal from './ApplicantDetailModal';
import EditLabelsModal from './EditLabelsModal';
import AddRatingModal from './AddRatingModal';
import AddNotesModal from './AddNotesModal';
import AddFileModal from './AddFileModal';
import Button from '@/components/ui/Button';
import useJobsApi from '../useJobsApi';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';
import CustomConfirmModal from '@/components/shered/CustomConfirmModal';

import './ApplicantsBoard.css';

interface ApplicantsBoardProps {
    onBack: () => void;
    jobId?: string | number | null;
    onEdit?: (id: string | number) => void;
}

const COLUMN_DEFS: { id: ApplicantStatus; titleKey: string; fallback: string; bg: string }[] = [
    { id: 'new', titleKey: 'applicants.status.newest', fallback: 'Newest', bg: 'bg-[#FFF9E6]' },
    { id: 'under_review', titleKey: 'applicants.status.underReview', fallback: 'Under Review', bg: 'bg-[#E6FFFA]' },
    { id: 'shortlisted', titleKey: 'applicants.status.shortlisted', fallback: 'Shortlisted', bg: 'bg-[#F0F5FF]' },
    { id: 'interviews', titleKey: 'applicants.status.interviews', fallback: 'Interviews', bg: 'bg-[#FFF0F7]' },
    { id: 'job_offer', titleKey: 'applicants.status.jobOffer', fallback: 'Job Offer', bg: 'bg-[#F0FDFC]' },
    { id: 'hired', titleKey: 'applicants.status.hired', fallback: 'Hired', bg: 'bg-[#E8F5E9]' },
    { id: 'rejected', titleKey: 'applicants.status.rejected', fallback: 'Rejected', bg: 'bg-[#FFEBEE]' },
];

/* ── Droppable Column wrapper ── */
const DroppableColumn = React.memo(({ id, bg, children }: { id: string; bg: string; children: React.ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div
            ref={setNodeRef}
            className={`flex-1 overflow-y-auto kanban-column rounded-xl p-3 transition-colors ${bg} ${isOver ? 'ring-2 ring-[#00664F]/30 ring-inset' : ''
                }`}
            style={{ maxHeight: 'calc(100vh - 340px)' }}
        >
            {children}
        </div>
    );
});
DroppableColumn.displayName = 'DroppableColumn';

const TAG_COLORS = ['#D6A439', '#E14C8E', '#123F84', '#39A81D'];

/* ── Map API candidate to Applicant ── */
const mapCandidateToApplicant = (candidate: any, status: ApplicantStatus): Applicant => ({
    id: String(candidate.id),
    job_id: candidate.job_id,
    name: candidate.candidate?.name || 'Unknown',
    rating: candidate.rating || 0,
    hasCvUpload: !!candidate.resume_url,
    tags: Array.isArray(candidate.tags)
        ? candidate.tags.map((tag: any, i: number) => ({
            id: String(tag.id),
            label: tag.name || tag.label || '',
            color: tag.color || TAG_COLORS[i % TAG_COLORS.length]
        }))
        : [],
    status,
    resume_url: candidate.resume_url,
    cover_letter: candidate.cover_letter,
    candidate: candidate.candidate,
    created_at: candidate.created_at,
    updated_at: candidate.updated_at,
});

/* ── Main Board ── */
const ApplicantsBoard: React.FC<ApplicantsBoardProps> = ({ onBack, jobId, onEdit }) => {
    const { t } = useTranslation();
    const { isRTL } = useLocaleDirection();
    const searchParams = useSearchParams();
    const router = useRouter();
    const {
        getKanbanCandidates,
        getJobDetails,
        bulkMoveStage,
        getEmployerTags,
        createEmployerTag,
        updateEmployerTag,
        attachTag,
        detachTag,
        addNote,
        uploadAttachment,
        deleteAttachment,
        addRating
    } = useJobsApi();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [activeOriginalContainer, setActiveOriginalContainer] = useState<ApplicantStatus | null>(null);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
    const [labelsTarget, setLabelsTarget] = useState<Applicant | null>(null);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [ratingTarget, setRatingTarget] = useState<Applicant | null>(null);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [notesTarget, setNotesTarget] = useState<Applicant | null>(null);
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    const [fileTarget, setFileTarget] = useState<Applicant | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [jobDetails, setJobDetails] = useState<any>(null);
    const [detailRefreshKey, setDetailRefreshKey] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Applicant | null>(null);
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    /* Debounce search term */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    /* Fetch candidates from API */
    useEffect(() => {
        if (!jobId) return;

        const fetchJobData = async () => {
            try {
                const res = await getJobDetails(jobId);
                if (res?.data) {
                    setJobDetails(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch job details:', err);
            }
        };

        const fetchCandidates = async () => {
            setIsLoading(true);
            try {
                const params: Record<string, string | number> = {
                    per_page: 10,
                    page_new: 1,
                    page_under_review: 1,
                    page_shortlisted: 1,
                    page_interviews: 1,
                    page_job_offer: 1,
                    page_hired: 1,
                    sort_by: sortBy,
                };

                if (debouncedSearchTerm) {
                    params.search = debouncedSearchTerm;
                }

                const response = await getKanbanCandidates(jobId, params);

                let columns: any = null;
                if (response?.data?.columns) {
                    columns = response.data.columns;
                } else if (response?.data) {
                    columns = response.data;
                }

                if (columns) {
                    const allApplicants: Applicant[] = [];
                    const statusKeys: ApplicantStatus[] = ['new', 'under_review', 'shortlisted', 'interviews', 'job_offer', 'hired', 'rejected'];

                    statusKeys.forEach((status) => {
                        const col = columns[status];
                        if (col?.candidates && Array.isArray(col.candidates)) {
                            col.candidates.forEach((candidate: any) => {
                                allApplicants.push(mapCandidateToApplicant(candidate, status));
                            });
                        }
                    });

                    setApplicants(allApplicants);
                }
            } catch (error) {
                console.error('Failed to fetch kanban candidates:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobData();
        fetchCandidates();
    }, [jobId, getKanbanCandidates, getJobDetails, sortBy, debouncedSearchTerm]); // Add sortBy and debouncedSearchTerm to dependencies

    // Effect to handle applicant_id from URL
    useEffect(() => {
        const applicantIdFromUrl = new URLSearchParams(window.location.search).get('applicant_id');
        if (applicantIdFromUrl && applicants.length > 0) {
            const app = applicants.find(a => String(a.id) === String(applicantIdFromUrl));
            if (app) {
                setSelectedApplicant(app);
                setIsModalOpen(true);
            }
        }
    }, [applicants, searchParams]);

    const [employerTags, setEmployerTags] = useState<any[]>([]);

    const fetchTags = useCallback(async () => {
        if (!jobId) return;
        try {
            const res: any = await getEmployerTags(jobId);
            if (Array.isArray(res)) {
                setEmployerTags(res);
            } else if (res?.data?.tags && Array.isArray(res.data.tags)) {
                setEmployerTags(res.data.tags);
            } else if (res?.data && Array.isArray(res.data)) {
                setEmployerTags(res.data);
            } else {
                setEmployerTags([]);
            }
        } catch (error) {
            console.error("Failed to fetch tags", error);
            setEmployerTags([]);
        }
    }, [jobId, getEmployerTags]);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const formattedLabels = useMemo(() => {
        if (!Array.isArray(employerTags)) return [];
        return employerTags.map((tag: any, i: number) => {
            const tagColor = tag.color || TAG_COLORS[i % TAG_COLORS.length];
            return {
                id: String(tag.id),
                text: tag.name,
                color: `${tagColor}20`,
                textColor: tagColor
            };
        });
    }, [employerTags]);

    /* Only PointerSensor with a generous distance so clicks aren't hijacked */
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    /* Group applicants by status – memoized with sorting */
    const columnMap = useMemo(() => {
        const map: Record<ApplicantStatus, Applicant[]> = {
            new: [],
            under_review: [],
            shortlisted: [],
            interviews: [],
            job_offer: [],
            hired: [],
            rejected: [],
        };

        // Sort applicants based on sortBy state
        const sortedApplicants = [...applicants].sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
            } else if (sortBy === 'oldest') {
                return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
            } else if (sortBy === 'rating_high') {
                return (b.rating || 0) - (a.rating || 0);
            } else if (sortBy === 'rating_low') {
                return (a.rating || 0) - (b.rating || 0);
            } else if (sortBy === 'name_asc') {
                return (a.name || '').localeCompare(b.name || '');
            } else if (sortBy === 'name_desc') {
                return (b.name || '').localeCompare(a.name || '');
            }
            return 0;
        });

        sortedApplicants.forEach((a) => map[a.status]?.push(a));
        return map;
    }, [applicants, sortBy]);

    /* Find which column an item belongs to */
    const findContainer = useCallback(
        (id: UniqueIdentifier): ApplicantStatus | null => {
            // Is it a column id?
            if (COLUMN_DEFS.some((c) => c.id === id)) return id as ApplicantStatus;
            // Is it an applicant id?
            const app = applicants.find((a) => a.id === id);
            return app?.status ?? null;
        },
        [applicants]
    );

    /* ── Handlers ── */
    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id);
        setActiveOriginalContainer(findContainer(event.active.id));
    }, [findContainer]);

    /* Move item to new column on drag-over (for live preview) */
    const handleDragOver = useCallback(
        (event: DragOverEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const activeContainer = findContainer(active.id);
            const overContainer = findContainer(over.id);

            if (!activeContainer || !overContainer || activeContainer === overContainer) return;

            // Move the dragged item to the new column
            setApplicants((prev) =>
                prev.map((a) =>
                    a.id === active.id ? { ...a, status: overContainer } : a
                )
            );
        },
        [findContainer]
    );

    const handleDragEnd = useCallback(
        async (event: DragEndEvent) => {
            const { active, over } = event;
            setActiveId(null);

            const originalContainer = activeOriginalContainer;
            setActiveOriginalContainer(null);

            if (!over) return;

            const overContainer = findContainer(over.id);
            if (!overContainer) return;

            if (!originalContainer || originalContainer === overContainer) return;

            // Optimistic update (mostly handled by handleDragOver, but just in case)
            setApplicants((prev) =>
                prev.map((a) =>
                    a.id === active.id ? { ...a, status: overContainer } : a
                )
            );

            // Fetch the applicant to get the id correctly, active.id is applicant.id (application id)
            try {
                await bulkMoveStage({
                    application_ids: [Number(active.id)],
                    stage: overContainer
                });
            } catch (error) {
                // Revert optimistic update on failure
                setApplicants((prev) =>
                    prev.map((a) =>
                        a.id === active.id ? { ...a, status: originalContainer } : a
                    )
                );
            }
        },
        [findContainer, bulkMoveStage, activeOriginalContainer]
    );

    const handleCardClick = useCallback((app: Applicant) => {
        setSelectedApplicant(app);
        setIsModalOpen(true);

        // Add applicant_id to URL when card is clicked
        const params = new URLSearchParams(window.location.search);
        params.set('applicant_id', String(app.id));
        router.push(`?${params.toString()}`, { scroll: false });
    }, [router]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        const params = new URLSearchParams(window.location.search);
        params.delete('applicant_id');
        router.push(`?${params.toString()}`, { scroll: false });
    }, [router]);

    const handleCardMenuAction = useCallback((action: string, app: Applicant) => {
        switch (action) {
            case 'labels':
                setLabelsTarget(app);
                setIsLabelsModalOpen(true);
                break;
            case 'rating':
                setRatingTarget(app);
                setIsRatingModalOpen(true);
                break;
            case 'notes':
                setNotesTarget(app);
                setIsNotesModalOpen(true);
                break;
            case 'files':
                setFileTarget(app);
                setIsFileModalOpen(true);
                break;
            case 'open':
                setSelectedApplicant(app);
                setIsModalOpen(true);
                break;
            case 'delete':
                setDeleteTarget(app);
                setIsDeleteModalOpen(true);
                break;
            default:
                break;
        }
    }, []);

    const handleSaveLabels = useCallback(async (applicantId: string | number, selectedLabelIds: string[]) => {
        if (!jobId) return;
        const app = applicants.find(a => a.id === String(applicantId));
        if (!app) return;

        const candidateId = app.candidate?.id;
        if (!candidateId) return;

        const currentTagIds = (app.tags || []).map(t => String(t.id));
        const newTagIds = selectedLabelIds.map(String);

        const tagsToAttach = newTagIds.filter(id => !currentTagIds.includes(id));
        const tagsToDetach = currentTagIds.filter(id => !newTagIds.includes(id));

        const attachPromises = tagsToAttach.map(tagId => attachTag(applicantId, tagId, { candidate_id: candidateId, tag_id: tagId }));
        const detachPromises = tagsToDetach.map(tagId => detachTag(applicantId, tagId));

        try {
            await Promise.all([...attachPromises, ...detachPromises]);
            // Update local state to reflect changes
            setApplicants(prev => prev.map(a => {
                if (a.id === String(applicantId)) {
                    const safeEmployerTags = Array.isArray(employerTags) ? employerTags : [];
                    return {
                        ...a,
                        tags: safeEmployerTags
                            .filter(t => newTagIds.includes(String(t.id)))
                            .map(t => ({
                                id: String(t.id),
                                label: t.name,
                                color: t.color || '#00664F'
                            }))
                    };
                }
                return a;
            }));
        } catch (error) {
            console.error("Failed to update tags", error);
        }
    }, [jobId, applicants, employerTags, attachTag, detachTag]);

    const handleAddNoteSubmit = useCallback(async (applicantId: string | number, note: string) => {
        if (!jobId) return;

        const app = applicants.find(a => a.id === String(applicantId));
        const candidateId = app?.candidate?.id;
        if (!candidateId) return;

        try {
            await addNote(jobId, applicantId, {
                candidate_id: candidateId,
                content: note
            });
            setDetailRefreshKey(k => k + 1);
        } catch (error) {
            console.error("Failed to add note", error);
            throw error;
        }
    }, [jobId, applicants, addNote]);

    const handleAddFileSubmit = useCallback(async (applicantId: string | number, files: File[]) => {
        if (!jobId) return;

        try {
            const uploadPromises = files.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('application_id', String(applicantId));
                return uploadAttachment(formData);
            });
            await Promise.all(uploadPromises);
            setDetailRefreshKey(k => k + 1);
        } catch (error) {
            console.error("Failed to upload files", error);
            throw error;
        }
    }, [jobId, uploadAttachment]);

    const handleAddRatingSubmit = useCallback(async (applicantId: string | number, rating: number, review: string) => {
        try {
            const payload: any = {
                application_id: Number(applicantId),
                rating: rating
            };
            if (review && review.trim() !== '') {
                payload.rating_note = review.trim();
            }
            await addRating(payload);

            // Update local state to reflect the new rating immediately
            setApplicants(prev => prev.map(a => {
                if (a.id === String(applicantId)) {
                    return { ...a, rating: rating };
                }
                return a;
            }));

            // If the selected applicant is the one being rated, update it too
            setSelectedApplicant(prev => {
                if (prev && String(prev.id) === String(applicantId)) {
                    return { ...prev, rating: rating };
                }
                return prev;
            });

            // Trigger refetch in the detail modal
            setDetailRefreshKey(k => k + 1);
        } catch (error) {
            console.error("Failed to add rating", error);
            throw error;
        }
    }, [addRating]);

    const handleDeleteApplicant = useCallback(async () => {
        if (!deleteTarget) return;

        try {
            // Use the detachTag API to remove all tags from the applicant
            // This effectively removes the applicant from the job
            const applicantId = deleteTarget.id;
            deleteAttachment(applicantId);
            // Remove the applicant from local state
            setApplicants(prev => prev.filter(a => a.id !== applicantId));

            // Close the modal
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
        } catch (error) {
            console.error('Failed to delete applicant:', error);
            throw error;
        }
    }, [deleteTarget, deleteAttachment]);

    const activeApplicant = activeId ? applicants.find((a) => a.id === activeId) ?? null : null;

    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
        // Make sure progress is between 5% and 100% so a tiny bar is always visible
        setScrollProgress(Math.max(5, progress));
    }, []);

    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

    // initialize scrollbar progress check early
    useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, [handleScroll, applicants]);

    return (
        <div className="flex flex-col min-h-0 bg-white">
            {/* ── Header ── */}
            <div className="bg-white px-6 pt-4 pb-3">
                {/* Go Back + Edit Job */}
                <div className="flex justify-between items-center mb-3">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#00664F] hover:opacity-80 transition-opacity font-medium uppercase text-sm"
                    >
                        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                        {t('common.goBack', { defaultValue: 'GO BACK' })}
                    </button>
                    <Button
                        className="bg-[#00664F] hover:bg-[#005542] text-white px-6 h-9 rounded-lg font-medium flex items-center gap-2 text-sm"
                        onClick={() => jobId && onEdit && onEdit(jobId)}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        {t('jobs.editJob', { defaultValue: 'Edit job' })}
                    </Button>
                </div>

                <h1 className="text-xl font-medium text-gray-800 mb-1">
                    {jobDetails?.title
                        ? t('applicants.boardTitleWithJob', { jobTitle: jobDetails.title, defaultValue: `${jobDetails.title} Applicants Board` })
                        : t('applicants.boardTitle', { defaultValue: 'Work Job Applicants Board' })
                    } ( {applicants.length} ) :
                </h1>
                <p className="text-xs text-gray-400 mb-5">
                    {t('applicants.boardSubtitle', { defaultValue: 'Managing and tracking work functions across different stages' })}
                </p>

                {/* Search + Sort */}
                <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                    <div className="relative w-full md:w-[320px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-[#00664F]" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('common.searchFor', { defaultValue: 'Search for...' })}
                            className={`block w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-1.5 border border-[#00664F]/30 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00664F] focus:border-[#00664F] transition-shadow`}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{t('common.sortBy', { defaultValue: 'Sort by:' })}</span>
                        <Select
                            value={sortBy}
                            onChange={(value) => setSortBy(value)}
                            className="!w-[130px] h-8 [&_.ant-select-selector]:!rounded-md [&_.ant-select-selector]:!border-gray-200"
                            options={[
                                { value: 'newest', label: t('common.latest', { defaultValue: 'Newest' }) },
                                { value: 'oldest', label: t('common.oldest', { defaultValue: 'Oldest' }) },
                                { value: 'highest_salary', label: t('jobs.sortOptions.salary-desc', { defaultValue: 'Highest Salary' }) },
                                { value: 'lowest_salary', label: t('jobs.sortOptions.salary-asc', { defaultValue: 'Lowest Salary' }) },
                                { value: 'rating_high', label: t('applicants.sortOptions.rating-high', { defaultValue: 'Highest Rating' }) },
                                { value: 'rating_low', label: t('applicants.sortOptions.rating-low', { defaultValue: 'Lowest Rating' }) },
                                { value: 'name_asc', label: t('applicants.sortOptions.name-asc', { defaultValue: 'Name (A-Z)' }) },
                                { value: 'name_desc', label: t('applicants.sortOptions.name-desc', { defaultValue: 'Name (Z-A)' }) },
                            ]}
                        />
                    </div>
                </div>

                {/* Status Counts */}
                <div className="flex items-center text-sm text-gray-500 overflow-x-auto pb-3 border-b border-gray-100">
                    {COLUMN_DEFS.map((col, index) => (
                        <React.Fragment key={col.id}>
                            {index > 0 && <span className="text-gray-300 mx-3 mb-1 font-bold text-lg leading-none">.</span>}
                            <div className="whitespace-nowrap flex items-baseline gap-1">
                                <span className="text-gray-500 font-medium">{columnMap[col.id].length}</span>
                                <span className="text-gray-500">{t(col.titleKey, { defaultValue: col.fallback })}</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ── Loading State ── */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00664F]"></div>
                </div>
            )}

            {/* ── Kanban Board ── */}
            {!isLoading && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-x-auto px-6 pt-4 pb-2 gap-4 kanban-board-container flex hide-scrollbar">
                        {COLUMN_DEFS.map((colDef) => {
                            const items = columnMap[colDef.id];
                            const ids = items.map((a) => a.id);

                            return (
                                <div key={colDef.id} className="min-w-[250px] w-[250px] flex flex-col shrink-0">
                                    {/* Column Header */}

                                    <DroppableColumn id={colDef.id} bg={colDef.bg}>
                                        <SortableContext id={colDef.id} items={ids} strategy={verticalListSortingStrategy}>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-medium text-[#373737] text-md">
                                                    {t(colDef.titleKey, { defaultValue: colDef.fallback })} :{' '}
                                                    <span className="text-[#00664F] font-bold">{items.length}</span>
                                                </h3>
                                            </div>
                                            <div className="flex flex-col gap-3 overflow-y-auto min-h-[300px]">
                                                {items.map((applicant) => (
                                                    <SortableApplicantCard
                                                        key={applicant.id}
                                                        applicant={applicant}
                                                        onClick={handleCardClick}
                                                        onMenuAction={handleCardMenuAction}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DroppableColumn>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Scroll Navigation Bar ── */}
                    <div className="flex items-center px-6 py-2 gap-3 pb-4">
                        <button
                            onClick={scrollLeft}
                            className="w-6 h-6 rounded bg-[#00664F] text-white flex items-center justify-center hover:bg-[#005542] transition-colors shrink-0"
                        >
                            {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                        </button>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#00664F] rounded-full transition-all duration-300 ease-out" style={{ width: `${scrollProgress}%` }} />
                        </div>
                        <button
                            onClick={scrollRight}
                            className="w-6 h-6 rounded bg-[#00664F] text-white flex items-center justify-center hover:bg-[#005542] transition-colors shrink-0 rotate-180"
                        >
                            {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                        </button>
                    </div>

                    <DragOverlay dropAnimation={null}>
                        {activeApplicant ? (
                            <ApplicantCardUI
                                applicant={activeApplicant}
                                onClick={() => { }}
                                isOverlay
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}

            <ApplicantDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                applicant={selectedApplicant}
                onMenuAction={handleCardMenuAction}
                refreshKey={detailRefreshKey}
            />

            <EditLabelsModal
                isOpen={isLabelsModalOpen}
                onClose={() => setIsLabelsModalOpen(false)}
                applicant={labelsTarget}
                allLabels={formattedLabels}
                onSave={handleSaveLabels}
                jobId={jobId}
                onCreateTag={async (name: string, color: string) => {
                    if (!jobId) return;
                    await createEmployerTag({ job_id: jobId, name, color });
                    await fetchTags(); // Refresh tags list
                }}
                onUpdateTag={async (id: string | number, name: string, color: string) => {
                    await updateEmployerTag(id, { name, color });
                    await fetchTags();
                }}
            />

            <AddRatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                applicant={ratingTarget}
                onSubmit={handleAddRatingSubmit}
            />

            <AddNotesModal
                isOpen={isNotesModalOpen}
                onClose={() => setIsNotesModalOpen(false)}
                applicant={notesTarget}
                onSubmit={handleAddNoteSubmit}
            />

            <AddFileModal
                isOpen={isFileModalOpen}
                onClose={() => setIsFileModalOpen(false)}
                applicant={fileTarget}
                onSubmit={handleAddFileSubmit}
            />

            <CustomConfirmModal
                open={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteTarget(null);
                }}
                title={t('applicants.deleteConfirmTitle', { defaultValue: 'Delete Applicant' })}
                subtitle={t('applicants.deleteConfirmMessage', {
                    name: deleteTarget?.name || 'this applicant'
                })}
                onConfirm={handleDeleteApplicant}
                type="danger"
                confirmText={t('common.delete', { defaultValue: 'Delete' })}
                cancelText={t('common.cancel', { defaultValue: 'Cancel' })}
            />
        </div>
    );
};


export default ApplicantsBoard;

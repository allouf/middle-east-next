"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import JobsStats from '../JobsServices/JobsStats';
import JobsFilters from '../JobsServices/JobsFilters';
import JobsTable from '../JobsServices/JobsTable';
import { Job, JobFilterState, JobCategory, JobFilterParams, PaginationConfig } from '../JobsServices/types';
import { JobStatus } from '../JobsServices/enums';
import Button from '@/components/ui/Button';
import { Building2, FileText } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import useJobsApi from '../JobsServices/useJobsApi';
import JobIcon from "@/assets/icons/JobIcon.svg";
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { useAlert } from '@/lib/context/AlertProvider';
import { formatWorkMode, formatCurrency, formatJobStatus } from '../JobsServices/helper';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';

const LoadingView = () => <div className="flex min-h-[400px] items-center justify-center"><Spin size="large" /></div>;

const JobDetails = dynamic(() => import('../JobsServices/JobDetails'), { ssr: false, loading: LoadingView });
const TemplateJobPage = dynamic(() => import('../JobsServices/TemplateJobPage'), { ssr: false, loading: LoadingView });
const ApplicantsBoard = dynamic(() => import('../JobsServices/Applicants/ApplicantsBoard'), { ssr: false, loading: LoadingView });
const AddJob = dynamic(() => import('../JobsServices/AddJob/AddJob'), { ssr: false, loading: LoadingView });
const EditJob = dynamic(() => import('../JobsServices/AddJob/EditJob'), { ssr: false, loading: LoadingView });
const CompanyProfileTabs = dynamic(() => import('../JobsServices/CompanyView').then(m => m.CompanyProfileTabs), { ssr: false, loading: LoadingView });
const MyCompanyManagment = dynamic(() => import('../JobsServices/CompanyView/ComplatedProfile/MyCompanyManagment'), { ssr: false, loading: LoadingView });
const DeleteModal = dynamic(() => import('@/components/shered/DeleteModel'), { ssr: false });




const ProfileIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="38"
        viewBox="0 0 36 38"
        fill="none"
        className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d="M24.7501 10.5945C24.7501 15.387 21.8551 19.5 18.0001 19.5C14.1421 19.5 11.2501 15.387 11.2501 10.593C11.2501 5.802 13.7401 3 18.0001 3C22.2601 3 24.7501 5.8005 24.7501 10.5945ZM6.15308 30.213C6.73058 30.9 9.21758 33 18.0001 33C26.7826 33 29.2681 30.9 29.8471 30.2145C29.9008 30.1486 29.9405 30.0725 29.9637 29.9907C29.9869 29.9089 29.9932 29.8233 29.9821 29.739C29.8501 28.416 28.6591 22.5 18.0001 22.5C7.34108 22.5 6.15008 28.416 6.01658 29.739C6.00572 29.8234 6.01222 29.9091 6.0357 29.9909C6.05917 30.0726 6.09912 30.1472 6.15308 30.213Z" fill="#00664F" />
        <circle cx="27" cy="30" r="8" fill="#CCE0DC" />
        <g clipPath="url(#clip0_461_2660)">
            <path d="M31.6921 26.2632H22.5501C22.0621 26.2632 21.6665 26.6589 21.6665 27.1468V28.357L26.173 29.3074V28.7049H28.0432V29.3074L32.5756 28.3509V27.1468C32.5756 26.6589 32.18 26.2632 31.6921 26.2632Z" fill="#00664F" />
            <path d="M28.0434 31.1984H26.1733V29.9836L21.9785 29.1505V32.7044C21.9785 33.1923 22.3739 33.588 22.8618 33.588H31.3808C31.8687 33.588 32.2642 33.1923 32.2642 32.7044V29.1443L28.0434 29.9836V31.1984Z" fill="#00664F" />
            <path d="M27.5759 29.1721H26.6409V30.7303H27.5759V29.1721Z" fill="#00664F" />
            <path d="M25.7956 24.8717C25.7958 24.8355 25.8092 24.8066 25.8329 24.7821C25.8569 24.7586 25.8859 24.7455 25.9219 24.7451H28.3205C28.3564 24.7455 28.3857 24.7586 28.4097 24.7821C28.4332 24.8066 28.4465 24.8355 28.4466 24.8717V25.503H29.204V24.8717C29.2041 24.6286 29.1046 24.4057 28.9452 24.2468C28.7866 24.0874 28.5631 23.9876 28.3205 23.9878H25.9219C25.6791 23.9876 25.4558 24.0874 25.2971 24.2468C25.138 24.4057 25.0381 24.6286 25.0386 24.8717V25.503H25.7956V24.8717Z" fill="#00664F" />
        </g>
        <defs>
            <clipPath id="clip0_461_2660">
                <rect width="10.9091" height="10.9091" fill="white" transform="translate(21.6665 23.3335)" />
            </clipPath>
        </defs>
    </svg>
);
const JobsServicesContent = () => {
    const { t } = useTranslation();
    const {message} = useAlert();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { getMyJobs ,getAllJobStatistics,  getJobCategories, getJobStatistics, loading, statusCode, clearStatusCode } = useJobsApi();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [categories, setCategories] = useState<JobCategory[]>([]);
    const [view, setView] = useState<'list' | 'details' | 'template' | 'add' | 'edit' | 'applicants' | 'applied_jobs' | 'user_profile' | "company_view" | 'applied_detials'>('list');
    const [selectedJobId, setSelectedJobId] = useState<string | number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [isInProfileUpdate, setIsInProfileUpdate] = useState(false);
    const { role } = useAuth();
    // const normalizedRole = role === "consumer" || role === "company"
    const [filters, setFilters] = useState<JobFilterState>({
        search: '',
        category: null,
        workMode: null,
        minSalary: null,
        maxSalary: null,
        status: null,
        applicationDate: null,
        sortBy: null,
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    // Debounce timer ref for search
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Function to update URL when view changes
    const updateViewInUrl = useCallback((newView: string, id?: string | number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newView === 'list') {
            params.delete('view');
            params.delete('id');
        } else {
            params.set('view', newView);
            if (id) {
                params.set('id', id.toString());
            } else {
                params.delete('id');
            }
        }
        router.push(`?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    // Function to set view and update URL
    const setViewWithUrl = useCallback((newView: typeof view, id?: string | number) => {
        setView(newView);
        updateViewInUrl(newView, id);
    }, [updateViewInUrl]);

    // Build API filter params from the filter state
    const buildFilterParams = useCallback((filterState: JobFilterState, page: number, perPage: number): JobFilterParams => {
        const params: JobFilterParams = {};
        if (filterState.category) params.category_id = filterState.category;
        if (filterState.workMode) params.work_mode = filterState.workMode;
        if (filterState.applicationDate) params.application_deadline_to = filterState.applicationDate;
        if (filterState.minSalary) params.min_salary = filterState.minSalary;
        if (filterState.maxSalary) params.max_salary = filterState.maxSalary;
        if (filterState.status) params.status = filterState.status;
        if (filterState.search) params.search = filterState.search;
        params.page = page;
        params.per_page = perPage;
        return params;
    }, []);

    // Fetch Jobs from API with current filters
    const fetchJobs = useCallback(async (filterState: JobFilterState, page: number = currentPage, perPage: number = pageSize) => {
        try {
            setJobs([]);
            const apiParams = buildFilterParams(filterState, page, perPage);
            const response = await getMyJobs(apiParams);
            console.log("Fetched jobs response:", response);

            let rawJobs: any[] = [];
            if (response && response.data && Array.isArray((response.data as any).jobs)) {
                rawJobs = (response.data as any).jobs;
                const totalItems = (response.data as any).meta?.total || rawJobs.length;
                setTotal(totalItems);
            } else if (response && Array.isArray(response.data)) {
                rawJobs = response.data;
                setTotal(rawJobs.length);
            } else if (Array.isArray(response)) {
                rawJobs = response as any[];
                setTotal(rawJobs.length);
            }

            const mappedJobs: Job[] = rawJobs.map((job: any) => ({
                ...job, // Spread original job data to preserve all fields
                id: job.id,
                title: job.title,
                category: typeof job.category === 'object' ? job.category?.name : job.category,
                // store original category if needed/available
                category_id: job.category_id || (typeof job.category === 'object' ? job.category.id : undefined),
                work_mode: job.work_mode ? formatWorkMode(t, job.work_mode) : job.work_mode,
                salary: job.hide_salary ? t('jobs.hidden', { defaultValue: 'Hidden' }) : `${job.salary_min || 0} - ${job.salary_max || 0}`,
                currency: job.currency ? formatCurrency(t, job.currency) : job.currency,
                application_date: job.created_at ? new Date(job.created_at).toLocaleDateString() : '',
                visibility: `${job.expires_in_days || 0} ${t('jobs.days', { defaultValue: 'Days' })}`,
                expiry_date: job.expires_at ? new Date(job.expires_at).toLocaleDateString() : '',
                state: job.status,
                description: job.description,
                experience_level: job.experience_level,
                employment_type: job.employment_type,
                location: `${job.region || ''}, ${job.country_code || ''}`,
                visibility_duration: `${job.expires_in_days || 0} ${t('jobs.daysUpper', { defaultValue: 'DAYS' })}`
            }));

            setJobs(mappedJobs);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
            setJobs([]);
        }
    }, [getMyJobs, buildFilterParams, currentPage, pageSize]);


    // Fetch full job details from API


    // Fetch categories on mount
    const fetchCategories = useCallback(async () => {
        try {
            const response = await getJobCategories();
            let rawCategories: any[] = [];
            // API returns { data: { categories: [...] } }
            if (response && response.data && Array.isArray((response.data as any).categories)) {
                rawCategories = (response.data as any).categories;
            } else if (response && response.data && Array.isArray(response.data)) {
                rawCategories = response.data;
            } else if (response && Array.isArray((response as any).categories)) {
                rawCategories = (response as any).categories;
            } else if (Array.isArray(response)) {
                rawCategories = response as any[];
            }
            setCategories(rawCategories.map((cat: any) => ({ id: cat.id, name: cat.name })));
        } catch (error) {
            console.error("Failed to fetch categories", error);
            setCategories([]);
        }
    }, [getJobCategories]);

    // Set profile update mode when statusCode is 478
    useEffect(() => {
        if (statusCode === 478) {
            setIsInProfileUpdate(true);
        }
    }, [statusCode]);

    // Initial fetch
    useEffect(() => {
        const viewParam = searchParams.get('view') as any;
        const idParam = searchParams.get('id');

        const validViews = ['list', 'details', 'template', 'add', 'edit', 'applicants', 'applied_jobs', 'user_profile', 'company_view', 'applied_detials'];

        if (viewParam && validViews.includes(viewParam)) {
            setView(viewParam);
        } else {
            setView(role === 'consumer' ? 'applied_jobs' : 'list');
        }

        if (idParam) {
            setSelectedJobId(idParam);
        }

        fetchCategories();
        fetchJobs(filters, currentPage, pageSize);
        fetchStatistics();
    }, [searchParams, role]); // Consider optimizing dependency array if fetch functions are not fully stable

    // Re-fetch jobs when filters change (with debounce for search)
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Clear previous debounce timer
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        // Debounce search input, trigger immediately for other filters
        searchTimerRef.current = setTimeout(() => {
            setCurrentPage(1);
            fetchJobs(filters, 1, pageSize);
        }, 400);

        return () => {
            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current);
            }
        };
    }, [filters]);

    // Statistics state (from API)
    const [stats, setStats] = useState<import('../JobsServices/types').JobStatistics>({
        activeJobs: { count: 0, trend: 0 },
        pausedJobs: { count: 0, trend: 0 },
        draftJobs: { count: 0, trend: 0 },
        expiredJobs: { count: 0, trend: 0 },
    });

    // // Fetch statistics from API
    const fetchStatistics = useCallback(async () => {
        try {
            const response = await getAllJobStatistics();
            console.log("Job statistics response:", response);

            // Find the actual stats data — handle multiple response shapes
            let data: any = null;
            if (response && response.data && typeof response.data === 'object') {
                // response.data could be the stats object directly or contain nested data
                data = (response.data as any).statistics || (response.data as any).data || response.data;
            } else if (response && typeof response === 'object') {
                data = (response as any).statistics || (response as any).data || response;
            }

            

            if (data) {
                if (data.by_status && Array.isArray(data.by_status)) {
                    const getStatusInfo = (status: string) => {
                        const item = data.by_status.find((s: any) => s.status === status);
                        return {
                            count: item?.count || 0,
                            trend: item?.percentage || 0
                        };
                    };

                    setStats({
                        activeJobs: getStatusInfo('ACTIVE'),
                        pausedJobs: getStatusInfo('PAUSED'),
                        draftJobs: getStatusInfo('DRAFT'),
                        expiredJobs: getStatusInfo('EXPIRED'),
                    });
                } else {
                    setStats({
                        activeJobs: { count: data.active ?? data.ACTIVE ?? 0, trend: data.active_trend ?? 0 },
                        pausedJobs: { count: data.paused ?? data.PAUSED ?? 0, trend: data.paused_trend ?? 0 },
                        draftJobs: { count: data.draft ?? data.DRAFT ?? 0, trend: data.draft_trend ?? 0 },
                        expiredJobs: { count: data.expired ?? data.EXPIRED ?? 0, trend: data.expired_trend ?? 0 },
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch job statistics", error);
        }
    }, [getJobStatistics]);

    // For server-side pagination, jobs already contains the current page's data
    const paginatedData = useMemo(() => {
        return jobs;
    }, [jobs]);

    const paginationConfig: PaginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: total,
    };

    const handleFilterChange = (newFilters: Partial<JobFilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleViewJob = (id: number | string) => { 
        console.log("id",id)
        setSelectedJobId(id);
        setViewWithUrl('details', id);
    };



    const handleEditJob = (id: number | string) => {
        setSelectedJobId(id);
        setViewWithUrl('edit', id);
    };

    const handleDeleteJob = (id: number | string) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };


    const handleAddJob = () => {
        setViewWithUrl('add');
    };

    const handleStatusChange = (id: number | string, newStatus: string) => {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, state: newStatus as JobStatus, status: newStatus as JobStatus } : j));
    };

    const handleBackToList = () => {
        setViewWithUrl(role === 'consumer' ? 'applied_jobs' : 'list');
        fetchJobs(filters, currentPage, pageSize);
        setSelectedJobId(null);
        setIsInProfileUpdate(false); // Reset profile update state
    };

    const handleDeleteSuccess = useCallback((id: number | string) => {
        setJobs(prev => prev.filter(j => j.id !== id));
        if (selectedJobId === id) {
            handleBackToList();
        }
    }, [selectedJobId, handleBackToList, role, fetchJobs, filters]);

    const handleProfileUpdate = () => {
        setIsInProfileUpdate(true); // Set profile update mode
    };

    const handleApplicants = () => {
        setViewWithUrl('applicants');
    };

    const handleViewApplicants = (id: string | number) => {
        setSelectedJobId(id);
        setViewWithUrl('applicants', id);
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

        // useEffect(()=>{
    //     console.log("view", view);
    //     console.log("selectedJobId", selectedJobId);
    //     // console.log("detailedJob", detailedJob);
    //     // console.log("jobs", jobs);
    // },[view, selectedJobId])

    const handleSuccess = () => {
        fetchJobs(filters, currentPage, pageSize);
        fetchStatistics();
    };
    if (view === 'details' && selectedJobId) {
        return (
            <JobDetails
                jobId={selectedJobId}
                onBack={handleBackToList}
                onEdit={handleEditJob}
                onDelete={handleDeleteSuccess}
                onStatusChange={handleStatusChange}
                onViewApplicants={handleViewApplicants}
            />
        );
    }

    if (view === 'template') {
        return <TemplateJobPage onBack={handleBackToList} />;
    }

    if ((statusCode === 478 || isInProfileUpdate) && role === 'company') {
        return <CompanyProfileTabs onBack={handleBackToList} statusCode={statusCode || undefined} refetchJobs={() => fetchJobs(filters, currentPage, pageSize)} clearStatusCode={clearStatusCode} />;
    }


    if (view === 'add') {
        return <AddJob onBack={handleBackToList} onSuccess={handleSuccess} />;
    }

    if (view === 'edit' && selectedJobId) {
        // console.log("jobs",jobs)
        const job = jobs.find(j => j.id === Number(selectedJobId));
        // console.log("job",job)
       
        return <EditJob  jobId={selectedJobId} onBack={handleBackToList} onSuccess={handleSuccess} />;
        
    }

    if (view === 'applicants') {
        return <ApplicantsBoard onBack={handleBackToList} jobId={selectedJobId} onEdit={handleEditJob} />;
    }

    if (view === "company_view") {
        return <MyCompanyManagment onBack={handleBackToList} />
    }
    return (
        <div className="p-6">
            {/* Page Title */}
            <div className="flex flex-row justify-between items-center gap-4 sm:gap-0 mb-6">
                <h1 className="text-base md:text-xl font-medium text-[#373737]">{t("jobs.title")}:</h1>
                <div className="flex flex-row gap-2 sm:gap-3 items-center   ">
                    {role === "consumer" && <Button
                        onClick={() => setViewWithUrl('applied_jobs')}
                        unstyled
                        className="bg-[#00664F]/20 hover:bg-[#00664F]/30 text-blueSite px-3 sm:px-6 h-10 rounded-[10px] font-medium transition-colors flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                        <Image src={JobIcon} alt={t('jobs.icons.jobsIcon', { defaultValue: 'Jobs Icon' })} width={16} height={10} className="sm:w-5 sm:h-5" />
                        <span className="sm:inline">{t('jobs.appliedJobs', { defaultValue: 'Applied Jobs' })}</span>
                    </Button>}
                    <Button
                        onClick={() => setViewWithUrl('template')}
                        className="bg-[#00664F] hover:bg-[#005542] text-white px-3 sm:px-6 h-10 rounded-[10px] font-medium transition-colors flex items-center gap-2 text-sm sm:text-base"
                    >
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        <span className=" sm:inline">{t("jobs.templateJob")}</span>
                    </Button>
                    {role === "consumer" && <Button
                        onClick={() => setViewWithUrl('user_profile')}
                        unstyled
                        className="bg-[#00664F]/20 hover:bg-[#00664F]/30 text-blueSite px-3 sm:px-6 h-10 rounded-[10px] font-medium transition-colors flex items-center gap-2 text-sm sm:text-base"
                    >
                        <ProfileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blueSite" />
                        <span className="hidden sm:inline">{t('jobs.profile', { defaultValue: 'Profile' })}</span>
                    </Button>}
                    {role === "company" && <Button
                        onClick={() => setViewWithUrl('company_view')}
                        unstyled
                        className="bg-[#00664F]/20 hover:bg-[#00664F]/30 text-blueSite px-3 sm:px-6 h-10 rounded-[10px] font-medium transition-colors flex items-center gap-2 text-sm sm:text-base"
                    >
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blueSite" />
                        {/* <span className="hidden sm:inline">{t('jobs.company', { defaultValue: 'Company' })}</span> */}
                    </Button>}

                </div>
            </div>

            <JobsStats stats={stats} />

            <JobsFilters
                filters={filters}
                categories={categories}
                onFilterChange={handleFilterChange}
                onApplyFilters={() => {
                    setCurrentPage(1);
                    fetchJobs(filters, 1, pageSize);
                }}
                onAddJob={handleAddJob}
                onApplicants={handleApplicants}
            />

            <JobsTable
                data={paginatedData}
                loading={loading}
                pagination={paginationConfig}
                onPageChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                    fetchJobs(filters, page, size);
                }}
                onView={handleViewJob}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
            />
            {deleteId && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    title={t('jobs.deleteJobTitle', { defaultValue: 'Delete job' })}
                    description={t('jobs.deleteJobDescription', { defaultValue: 'Are you sure you want to delete this job post?' })}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteId(null);
                    }}
                    onSuccess={() => {
                        if (deleteId) {
                            handleDeleteSuccess(deleteId);
                            message.success(t('jobs.deletedSuccessfully', { defaultValue: 'Job deleted successfully' }));
                        }
                    }}
                    url={`/job-postings/delete`}
                    id={deleteId}
                />
            )}
        </div>
    );
};

export default JobsServicesContent;

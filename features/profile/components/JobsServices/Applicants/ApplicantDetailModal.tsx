import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'antd';
import { X, Edit, FileText, Trash2, Star, Clock, CircleDot, Upload, StickyNote, Pencil } from 'lucide-react';
import { Applicant } from './applicantsTypes';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Button from '@/components/ui/Button';
import useJobsApi from '../useJobsApi';

interface ApplicantDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicant: Applicant | null;
    onMenuAction?: (action: string, applicant: Applicant) => void;
    refreshKey?: number;
}

type TabKey = 'details' | 'attachments' | 'history';

const ApplicantDetailModal: React.FC<ApplicantDetailModalProps> = ({ isOpen, onClose, applicant, onMenuAction, refreshKey }) => {
    const { t } = useTranslation();
    const { showApplication, downloadAttachment, deleteAttachment, uploadAttachment } = useJobsApi();
    const [activeTab, setActiveTab] = useState<TabKey>('details');
    const [fullData, setFullData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    // Reset tab & fetch details when applicant changes
    useEffect(() => {
        if (!applicant || !isOpen) {
            setFullData(null);
            setActiveTab('details');
            return;
        }

        const fetchDetails = async () => {
            setIsFetchingDetail(true);
            try {
                const res = await showApplication(applicant.id);
                if (res?.data) {
                    // Merge with applicant to retain necessary fields if missing from response
                    setFullData({ ...applicant, ...res.data });
                } else {
                    setFullData(applicant);
                }
            } catch (error) {
                console.error("Failed to fetch details", error);
                setFullData(applicant);
            } finally {
                setIsFetchingDetail(false);
            }
        };

        fetchDetails();
    }, [applicant, isOpen, showApplication, refreshKey]);

    if (!applicant) return null;

    const data = fullData || applicant;

    const StatusBadge = () => {
        let text = data.status.replace(/_/g, ' ');
        text = text.charAt(0).toUpperCase() + text.slice(1);
        return (
            <span className="px-3 py-0.5 rounded-full text-[10px] bg-[#00664F]/10 text-[#00664F] font-medium ml-2 whitespace-nowrap">
                {text}
            </span>
        );
    };

    const tabs: { key: TabKey; label: string }[] = [
        { key: 'details', label: t('applicants.tabs.details', { defaultValue: 'Details Employee' }) },
        { key: 'attachments', label: t('applicants.tabs.attachments', { defaultValue: 'Attachments & Rating' }) },
        { key: 'history', label: t('applicants.tabs.history', { defaultValue: 'History' }) },
    ];

    /* ── Details Employee Tab ── */
    const renderDetailsTab = () => {
        const answers = data.field_answers || data.form_answers || [];

        return (
            <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-6">
                    {answers.length > 0 && (
                        <>
                            <div className="flex items-center gap-2 mb-5 text-gray-800 font-medium text-md">
                                <div className="w-7 h-7 rounded-lg bg-[#E6F0ED] flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-[#00664F]" />
                                </div>
                                {t('applicants.keyAnswer', { defaultValue: 'Key Answer :' })}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-8 mb-6">
                                {answers.map((item: any, i: number) => (
                                    <div key={i}>
                                        <div className="text-md font-medium text-gray-900 mb-1">
                                            {item.label || item.question} :
                                        </div>
                                        <div className="text-sm text-[#676767]">
                                            {item.value || item.answer}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Long Question / Cover Letter */}
                    {(data.cover_letter || data.longAnswer) ? (
                        <div className="mb-2">
                            <div className="text-md font-medium text-gray-900 mb-2">
                                {t('applicants.longQuestion', { defaultValue: 'Long Question :' })}
                            </div>
                            <p className="text-sm text-[#676767] leading-relaxed whitespace-pre-wrap">
                                {data.cover_letter || data.longAnswer}
                            </p>
                        </div>
                    ) : (
                        <div className="mb-2">
                            <div className="text-xs font-bold text-gray-900 mb-2">
                                {t('applicants.longQuestion', { defaultValue: 'Long Question :' })}
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed italic">
                                {t('common.noData', { defaultValue: 'No cover letter provided.' })}
                            </p>
                        </div>
                    )}
                </div>

                {/* CV Upload Button */}
                <a
                    href={data.resume_url || '#'}
                    target={data.resume_url ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex w-fit items-center gap-2 bg-[#00664F]/20 text-[#676767] px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                    <img src="/FileIcon.svg" alt="" />
                    <span>{t('applicants.cvUpload', { defaultValue: 'CV Upload' })}</span>
                </a>
            </div>
        );
    };

    /* ── Attachments & Rating Tab ── */
    const renderAttachmentsTab = () => {
        const attachments = data.attachments || [];

        const handleDeleteAttachment = async (attachmentId: number | string) => {
            if (!attachmentId) return;
            setLoading(true);
            try {
                await deleteAttachment(attachmentId);
                setFullData((prev: any) => ({
                    ...prev,
                    attachments: prev.attachments?.filter((a: any) => a.id !== attachmentId)
                }));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const handleDownloadAttachment = async (attachment: any) => {
            if (attachment.url) {
                window.open(attachment.url, '_blank');
                return;
            }
            if (!attachment.id) return;
            await downloadAttachment(attachment.id);
        };

        return (
            <div className="space-y-5">
                {/* Attachments Section */}
                <div className="border border-gray-200 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">
                            {t('applicants.attachments', { defaultValue: 'Attachments :' })}
                        </h3>
                        <Button
                            className="bg-[#00664F] text-white hover:bg-[#005542] h-9 px-5 text-xs font-medium flex items-center gap-2 rounded-lg"
                            onClick={() => onMenuAction && onMenuAction('files', applicant)}
                        >
                            <Upload className="w-3.5 h-3.5" />
                            {t('common.addFiles', { defaultValue: 'Add Files' })}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {attachments.length > 0 ? attachments.map((file: any, i: number) => {
                            const fileName = file.label || file.file_name || file.name || file.type || 'Attachment';
                            const dateStr = file.uploaded_at || file.created_at || file.editedOn;
                            const createdDate = dateStr ? new Date(dateStr).toLocaleDateString() : '';
                            return (
                                <div key={file.id || i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => handleDownloadAttachment(file)}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: `${file.iconColor || '#4CAF50'}20` }}
                                        >
                                            <FileText className="w-4 h-4" style={{ color: file.iconColor || '#4CAF50' }} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="text-xs font-semibold text-gray-900 truncate" title={fileName}>{fileName}</div>
                                            {createdDate && (
                                                <div className="text-[10px] text-[#00664F]">
                                                    {t('applicants.lastedEdited', { defaultValue: 'Lasted Edited On' })} {createdDate}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {file.id && (
                                        <button
                                            onClick={() => handleDeleteAttachment(file.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        }) : (
                            <div className="text-xs text-gray-400 col-span-full py-2">
                                {t('common.noAttachments', { defaultValue: 'No attachments found.' })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Rating Section */}
                <div className="border border-gray-200 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                            {t('applicants.rating', { defaultValue: 'The Rating :' })}
                        </h3>
                        <Button
                            className="bg-[#00664F] text-white hover:bg-[#005542] h-9 px-5 text-xs font-medium flex items-center gap-2 rounded-lg"
                            onClick={() => onMenuAction && onMenuAction('rating', applicant)}
                        >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            {t('common.editRating', { defaultValue: 'Edit Rating' })}
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#00664F] fill-[#00664F] shrink-0" />
                        <span className="text-sm font-bold text-gray-900">{data.rating || 0}</span>
                        {data.ratingText && (
                            <span className="text-xs text-gray-500">
                                {data.ratingText}
                            </span>
                        )}
                    </div>
                </div>

                {/* Notes Section */}
                <div className="border border-gray-200 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                            {t('applicants.notes', { defaultValue: 'The Notes :' })}
                        </h3>
                        <Button
                            className="bg-[#00664F] text-white hover:bg-[#005542] h-9 px-5 text-xs font-medium flex items-center gap-2 rounded-lg"
                            onClick={() => onMenuAction && onMenuAction('notes', applicant)}
                        >
                            <StickyNote className="w-3.5 h-3.5" />
                            {t('common.addNotes', { defaultValue: 'Add Notes' })}
                        </Button>
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed space-y-2">
                        {Array.isArray(data.notes) ? (
                            data.notes.length > 0 ? (
                                data.notes.map((note: any, i: number) => (
                                    <p key={note.id || i}>{note.content || JSON.stringify(note)}</p>
                                ))
                            ) : (
                                <p>No notes available.</p>
                            )
                        ) : typeof data.notes === 'object' && data.notes !== null ? (
                            <p>{(data.notes as any).content || JSON.stringify(data.notes)}</p>
                        ) : data.notes ? (
                            <p>{data.notes}</p>
                        ) : (
                            <p className="italic">{t('common.noData', { defaultValue: 'No notes available.' })}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    /* ── History Tab ── */
    const renderHistoryTab = () => {
        const history = data.history || [];

        return (
            <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-5 text-gray-800 font-semibold text-sm">
                    <div className="w-7 h-7 rounded-lg bg-[#E6F0ED] flex items-center justify-center">
                        <Clock className="w-4 h-4 text-[#00664F]" />
                    </div>
                    {t('applicants.history', { defaultValue: 'The History :' })}
                </div>

                <div className="flex flex-col">
                    {history.length > 0 ? history.map((entry: any, i: number) => (
                        <div key={entry.id || i} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-start gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00664F] mt-1.5 shrink-0" />
                                <div>
                                    <div className="text-sm text-gray-800 font-medium">
                                        {entry.action}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        {entry.from_status && (
                                            <>
                                                <span>{entry.from_status}</span>
                                                <span className="mx-1">–</span>
                                                <span className="text-[#00664F] font-medium cursor-pointer hover:underline">
                                                    {entry.to_status}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 whitespace-nowrap ml-4 mt-0.5">
                                {t('applicants.lastedEdited', { defaultValue: 'Lasted Edited On' })} {entry.date}
                            </div>
                        </div>
                    )) : (
                        <div className="text-xs text-gray-400 py-2">
                            {t('common.noHistory', { defaultValue: 'No history available.' })}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={800}
            closeIcon={<X className="w-5 h-5 text-gray-600" />}
            className="applicant-detail-modal [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!rounded-2xl overflow-hidden"
            centered
        >
            <div className="p-7">
                {/* ── Header ── */}
                <div className="mb-5">
                    <div className="text-sm text-gray-400 mb-1">#{data.id}</div>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1 mb-3">
                            <h2 className="text-lg text-gray-900 m-0">{data.name}</h2>
                            <StatusBadge />
                        </div>
                        {/* <Button
                            className="bg-[#00664F] hover:bg-[#005542] text-white px-6 h-10 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            {t('common.edit', { defaultValue: 'Edit' })}
                        </Button> */}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {data.tags?.map((tag: any, i: number) => (
                            <span
                                key={i}
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{ backgroundColor: `${tag.color || '#00664F'}12`, color: tag.color || '#00664F', borderColor: `${tag.color || '#00664F'}40` }}
                            >
                                {tag.name || tag.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-0 mb-6 bg-[#FAFAFA] w-fit rounded-full px-5 py-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-[#00664F]/20 text-[#00664F]'
                                : 'bg-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                <div className="min-h-[300px] max-h-[400px] overflow-y-auto relative">
                    {isFetchingDetail && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00664F]"></div>
                        </div>
                    )}
                    {activeTab === 'details' && renderDetailsTab()}
                    {activeTab === 'attachments' && renderAttachmentsTab()}
                    {activeTab === 'history' && renderHistoryTab()}
                </div>
            </div>
        </Modal>
    );
};

export default ApplicantDetailModal;

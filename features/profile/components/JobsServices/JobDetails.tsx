"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, Clock, Calendar, Globe, Layers, ArrowRight, Star, FileText } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Job } from './types';
import { ExperienceLevel, EmploymentType } from './enums';
import FormPreviewModal from './FormBuilder/FormPreviewModal';
import { apiFieldsToElements } from './FormBuilder/formBuilderTypes';
import type { FormElement } from './FormBuilder/formBuilderTypes';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';
import DeleteModal from '@/components/shered/DeleteModel';
import CustomConfirmModal from '@/components/shered/CustomConfirmModal';
import { useAlert } from '@/lib/context/AlertProvider';
import useJobsApi from './useJobsApi';
import { JobStatus } from './enums';
import { Spin } from 'antd';
import { getCountryNameByCode } from '@/shared/utils/locationApi';
import { formatWorkMode, formatExperience, formatEmploymentType, formatCurrency } from './helper';

interface JobDetailsProps {
    jobId: string | number;
    onBack: () => void;
    onEdit: (id: string | number) => void;
    onDelete: (id: string | number) => void;
    onStatusChange: (id: string | number, currentStatus: string) => void;
    onViewApplicants: (id: string | number) => void;
    isApplied?: boolean;
}

import SafeHtml from "@/components/shared/SafeHtml";

const JobDetails: React.FC<JobDetailsProps> = ({ jobId, onBack, onEdit, onDelete, onStatusChange, onViewApplicants, isApplied = false }) => {
    const { t } = useTranslation();
    const { message } = useAlert();
    const { isRTL } = useLocaleDirection();
    const { updateJobStatus, getJobDetails, loading: statusLoading } = useJobsApi();

    const [job, setJob] = useState<Job | null>(null);
    const [fetchingDetails, setFetchingDetails] = useState(true);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [countryName, setCountryName] = useState<string>('');

    const fetchInternalJobDetails = useCallback(async () => {
        setFetchingDetails(true);
        try {
            const response = await getJobDetails(jobId);
            let jobData: any = null;
            if (response?.data?.job) {
                jobData = response.data.job;
            } else if (response?.data) {
                jobData = response.data;
            }

            if (jobData) {
                const mapped: Job = {
                    ...jobData,
                    id: jobData.id,
                    title: jobData.title,
                    category: typeof jobData.category === 'object' ? jobData.category : jobData.category,
                    category_id: jobData.category_id || (typeof jobData.category === 'object' ? jobData.category?.id : undefined),
                    work_mode: jobData.work_mode,
                    salary: jobData.hide_salary ? t('jobs.hidden', { defaultValue: 'Hidden' }) : `${jobData.salary_min || 0} - ${jobData.salary_max || 0}`,
                    currency: jobData.currency || 'USD',
                    application_date: jobData.created_at ? new Date(jobData.created_at).toLocaleDateString() : '',
                    visibility: `${jobData.expires_in_days || 0} ${t('jobs.days', { defaultValue: 'Days' })}`,
                    expiry_date: jobData.expires_at ? new Date(jobData.expires_at).toLocaleDateString() : '',
                    state: jobData.status as any,
                    description: jobData.description,
                    experience_level: jobData.experience_level,
                    employment_type: jobData.employment_type,
                    location: `${jobData.region || ''}, ${jobData.country_code || ''}`,
                    visibility_duration: `${jobData.expires_in_days || 0} ${t('jobs.daysUpper', { defaultValue: 'DAYS' })}`,
                    job_template: jobData.job_template,
                    employer: jobData.employer,
                    latest_applications: jobData.latest_applications,
                };
                setJob(mapped);
                
                // Fetch country name if country_code exists
                if (jobData.country_code) {
                    const name = await getCountryNameByCode(jobData.country_code);
                    setCountryName(name);
                }
            }
        } catch (error) {
            console.error("Failed to fetch job details", error);
        } finally {
            setFetchingDetails(false);
        }
    }, [jobId, getJobDetails, t]);

    useEffect(() => {
        fetchInternalJobDetails();
    }, [fetchInternalJobDetails]);

    // Convert job_template fields to FormElement[] for the preview modal
    const templateElements: FormElement[] = React.useMemo(() => {
        if (job?.job_template?.fields && Array.isArray(job.job_template.fields)) {
            return apiFieldsToElements(job.job_template.fields);
        }
        return [];
    }, [job?.job_template]);

    const templateName = job?.job_template?.title || 'Job Template';

    // Get category name (handle both string and object shapes)
    const categoryName = typeof job?.category === 'object' && job.category
        ? job.category.name
        : (job?.category as string) || '';

    // Get salary display
    const salaryDisplay = job?.hide_salary
        ? 'Hidden'
        : (job?.salary || `${job?.salary_min || 0} - ${job?.salary_max || 0}`);

    const latestApplications = job?.latest_applications || [];

    const handleInternalStatusChange = async () => {
        if (!job) return;
        const currentStatus = job.state || job.status || 'ACTIVE';
        let newStatus = JobStatus.PAUSED;
        if (currentStatus === JobStatus.PAUSED || currentStatus === JobStatus.EXPIRED || currentStatus === JobStatus.DRAFT) {
            newStatus = JobStatus.ACTIVE;
        }

        try {
            await updateJobStatus(job.id, { status: newStatus },{showMessage:false});
            message.success(t('jobs.statusUpdated', { defaultValue: 'Job status updated successfully' }));
            fetchInternalJobDetails()
            onStatusChange(job.id, newStatus);
        } catch (error) {
            console.error("Failed to update job status", error);
        }
    };

    if (fetchingDetails) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spin size="large" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="p-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#00664F] mb-6 hover:opacity-80 transition-opacity font-medium uppercase text-sm"
                >
                    {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    {t('common.goBack', { defaultValue: 'GO BACK' })}
                </button>
                <div className="bg-white rounded-xl border-2 border-[#E7F0FA] p-12 text-center text-[#767F8C]">
                    {t('jobs.details.notFound', { defaultValue: 'Job details not found' })}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-[#00664F] mb-6 hover:opacity-80 transition-opacity font-medium uppercase text-sm"
            >
                {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {t('common.goBack', { defaultValue: 'GO BACK' })}
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Job Description */}
                <div className="flex-1">
                    <h1 className="text-2xl font-medium text-[#18191C] mb-1">{job.title}</h1>
                    <p className="text-[#18191C] font-semibold mb-6">{categoryName}</p>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-[#18191C] mb-2">{t('jobs.details.jobDescription', { defaultValue: 'Job Description :' })}</h3>
                        <SafeHtml className="text-[#424242] text-sm leading-relaxed whitespace-pre-line"
                            html={typeof job.description === 'string' ? job.description : t('common.jobDescriptionNotAvailable')}
                            config="MODERATE" />
                    </div>

                    {/* From Template Button */}
                    {job.job_template && templateElements.length > 0 && (
                        <button
                            onClick={() => setIsPreviewOpen(true)}
                            className="flex items-center gap-2 text-[#00664F] bg-[#E6F5F0] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#D4EDE5] transition-colors mb-6"
                        >
                            <FileText className="w-4 h-4" />
                            {t('jobs.details.fromTemplate', { defaultValue: 'From Template' })}
                        </button>
                    )}

                    {/* View Candidates Section */}
                    <div className="mt-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-md font-medium text-[#18191C]">
                                {t('jobs.details.viewCandidates', { defaultValue: 'View candidates' })} :
                            </h3>
                            <button
                                onClick={() => onViewApplicants(job.id)}
                                className="flex items-center gap-1 text-[#18191C] text-sm font-medium hover:text-[#00664F] transition-colors"
                            >
                                {t('common.viewAll', { defaultValue: 'View All' })}
                                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>

                        {latestApplications.length > 0 ? (
                            <div className="flex gap-3 flex-wrap">
                                {latestApplications.slice(0, 3).map((app: any) => (
                                    <Link
                                        key={app.id}
                                        href={`/profile?tab=jobs_services&view=applicants&id=${job.id}&applicant_id=${app.id}`}
                                        className="bg-white rounded-xl border border-[#E7F0FA] p-4 min-w-[180px] flex-1 max-w-[220px] hover:border-[#00664F] transition-all group"
                                    >
                                        <p className="text-xs text-[#767F8C] mb-1">#{app.id}</p>
                                        <p className="text-sm font-medium text-[#18191C] mb-1 group-hover:text-[#00664F] transition-colors">
                                            {app?.candidate?.name}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-[#767F8C] mb-2">
                                            <span className={`inline-block w-2 h-2 rounded-full ${app.status === 'new' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                            {app.status === 'new' ? 'New' : app.status.replace('_', ' ')}
                                        </div>
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1 mt-auto pt-2">
                                            {app.tags.map((tag: any, index: number) => (
                                                <span
                                                    key={index}
                                                    className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                                                    style={{ backgroundColor: `${tag.color || '#00664F'}15`, color: tag.color || '#00664F' }}
                                                >
                                                    {tag.label || tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-[#767F8C]">
                                {t('jobs.details.noApplications', { defaultValue: 'No applications yet' })}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column: Job Overview Card */}
                <div className="w-full lg:w-[430px]">
                    <div>
                        <div className="flex justify-between items-start mb-6 bg-white rounded-xl border-2 border-[#E7F0FA] p-6 pb-6">
                            <div className="w-full flex justify-between items-center">
                                <div className="text-center w-1/2 border-r-2 border-[#E7F0FA] pr-4">
                                    <p className="text-xs font-medium text-[#18191C] uppercase">{t('jobs.details.salary', { defaultValue: 'Salary' })}  {job.currency && formatCurrency(t,job.currency )}</p>
                                    {/* <p className="text-xs font-medium text-[#18191C] uppercase">{t('jobs.details.salary', { defaultValue: 'Salary' })} ({job.currency })</p> */}
                                    <p className="text-[#00664F] text-lg">{salaryDisplay}</p>
                                    {/* <p className="text-xs text-[#767F8C]">Yearly salary</p> */}
                                </div>
                                <div className="text-center w-1/2 pl-4">
                                    <div className="flex justify-center mb-1 text-[#00664F]">
                                        <img src={"/MapTrifold.svg"} className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-[#18191C]">{t('jobs.details.jobLocation', { defaultValue: 'Job Location' })}</p>
                                    <p className="text-[#767F8C] text-sm">{job.region ? `${job.region}, ${countryName || job.country_code}` : (countryName || job.country_code || 'Remote')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-xl border-2 border-[#E7F0FA] p-6'>

                            <h3 className="text-md font-medium text-[#18191C] mb-5">{t('jobs.details.jobOverview', { defaultValue: 'Job Overview' })}</h3>

                            <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                                {/* Visibility Duration */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/CalendarBlank.svg"} className="w-6 h-6" /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.visibilityDuration', { defaultValue: 'VISIBILITY DURATION :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{job.visibility_duration || `${job.expires_in_days || 0} DAYS`}</p>
                                </div>

                                {/* Application Date */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/Timer.svg"} className="w-6 h-6" /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.applicationDate', { defaultValue: 'APPLICATION DATE:' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{job.application_date || (job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : '')}</p>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/Stack.svg"} className="w-6 h-6" /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.experienceLevel', { defaultValue: 'EXPERINCE LEVEL:' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{formatExperience(t, job.experience_level as any)}</p>
                                </div>

                                {/* Work Mode */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/Wallet.svg"} className="w-6 h-6" /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.workMode', { defaultValue: 'WORK MODE :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{formatWorkMode(t, job.work_mode as any)}</p>
                                </div>

                                {/* Category */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/briefcase.svg"} className="w-6 h-6" /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.category', { defaultValue: 'CATEGORY :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{categoryName}</p>
                                </div>

                                {/* Employment Type */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><img src={"/briefcase.svg"} className="w-6 h-6" /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.employmentType', { defaultValue: 'EMPLOYMENT TYPE :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{formatEmploymentType(t, job.employment_type as any)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {!isApplied && <div className="mt-6 flex flex-col gap-3">
                        <button
                            onClick={() => onEdit(job.id)}
                            className="w-full bg-[#00664F] text-white py-3 rounded-md font-medium hover:bg-[#005542] transition-colors"
                        >
                            {t('jobs.details.editJob', { defaultValue: 'Edit Job' })}
                        </button>

                        <button
                            onClick={() => setIsStatusModalOpen(true)}
                            disabled={statusLoading}
                            className="w-full border-2 border-[#00664F] text-[#00664F] py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {statusLoading && <Spin size="small" />}
                            {(job.state === 'PAUSED' || job.status === 'PAUSED')
                                ? t('jobs.details.resumeJob', { defaultValue: 'Resume Job' })
                                : (job.state === 'EXPIRED' || job.status === 'EXPIRED')
                                    ? t('jobs.details.renewJob', { defaultValue: 'Renew Job' })
                                    : (job.state === 'DRAFT' || job.status === 'DRAFT')
                                        ? t('jobs.details.activeJob', { defaultValue: 'Active Job' })
                                        : t('jobs.details.pauseJob', { defaultValue: 'Pause Job' })
                            }
                        </button>

                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="text-[#BF2033] font-semibold border-b-2 border-[#BF2033] text-sm py-2 w-fit mx-auto pb-1"
                        >
                            {t('jobs.details.deleteJob', { defaultValue: 'Delete Job' })}
                        </button>
                    </div>}
                </div>
            </div>

            {/* Form Template Preview Modal */}
            <FormPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                elements={templateElements}
                templateName={templateName}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                title={t('jobs.deleteJobTitle', { defaultValue: 'Delete job' })}
                description={t('jobs.deleteJobDescription', { defaultValue: 'Are you sure you want to delete this job post?' })}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                }}
                onSuccess={() => {
                    message.success(t('jobs.deletedSuccessfully', { defaultValue: 'Job deleted successfully' }));
                    onDelete(job.id);
                    onBack();
                }}
                url={`/job-postings/delete`}
                id={job.id}
            />

            <CustomConfirmModal
                open={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                title={
                    (job.state === 'PAUSED' || job.status === 'PAUSED')
                        ? t('jobs.details.resumeConfirmTitle', { defaultValue: 'Resume Job?' })
                        : (job.state === 'EXPIRED' || job.status === 'EXPIRED')
                            ? t('jobs.details.renewConfirmTitle', { defaultValue: 'Renew Job?' })
                            : (job.state === 'DRAFT' || job.status === 'DRAFT')
                                ? t('jobs.details.activeConfirmTitle', { defaultValue: 'Active Job?' })
                                : t('jobs.details.pauseConfirmTitle', { defaultValue: 'Pause Job?' })
                }
                subtitle={
                    (job.state === 'PAUSED' || job.status === 'PAUSED')
                        ? t('jobs.details.resumeConfirmSubtitle', { defaultValue: 'Are you sure you want to resume this job post?' })
                        : (job.state === 'EXPIRED' || job.status === 'EXPIRED')
                            ? t('jobs.details.renewConfirmSubtitle', { defaultValue: 'Are you sure you want to renew this job post?' })
                            : (job.state === 'DRAFT' || job.status === 'DRAFT')
                                ? t('jobs.details.activeConfirmSubtitle', { defaultValue: 'Are you sure you want to activate this job post?' })
                                : t('jobs.details.pauseConfirmSubtitle', { defaultValue: 'Are you sure you want to pause this job post?' })
                }
                onConfirm={handleInternalStatusChange}
                confirmText={t('common.confirm', { defaultValue: 'Confirm' })}
                cancelText={t('common.cancel', { defaultValue: 'Cancel' })}
                type="warning"
                loading={statusLoading}
            />
        </div>
    );
};

export default JobDetails;

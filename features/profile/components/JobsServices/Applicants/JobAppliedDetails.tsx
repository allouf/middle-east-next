"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Job } from '../types';
import { apiFieldsToElements } from '../FormBuilder/formBuilderTypes';
import type { FormElement } from '../FormBuilder/formBuilderTypes';
import dynamic from 'next/dynamic';

const FormPreviewModal = dynamic(() => import('../FormBuilder/FormPreviewModal'), { 
    ssr: false 
});
import { ExperienceLevel, EmploymentType, WorkMode } from '../enums';
import { formatEmploymentType, formatWorkMode, formatExperience } from '../helper';
import useJobsApi from '../useJobsApi';
import { Spin } from 'antd';
import SafeHtml from "@/components/shared/SafeHtml";

interface JobDetailsProps {
    jobId: string | number;
    onBack: () => void;
    onEdit?: (id: string | number) => void;
    onDelete?: (id: string | number) => void;
    onStatusChange?: (id: string | number, currentStatus: string) => void;
    onViewApplicants?: (id: string | number) => void;
    isApplied?: boolean;
}

const JobAppliedDetails: React.FC<JobDetailsProps> = ({ jobId, onBack, onEdit, onDelete, onStatusChange, onViewApplicants, isApplied = false }) => {
    const { t } = useTranslation();
    const { getAppliedJobDetails ,loading } = useJobsApi();
    const [job, setJob] = useState<Job | null>(null);
    const [application, setApplication] = useState<any>(null);
    // const [loading, setLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!jobId) return;
            // setLoading(true);
            try {
                const response = await getAppliedJobDetails(jobId);
                let jobData: any = null;
                let appData: any = null;

                if (response?.data?.job) {
                    appData = response.data;
                    jobData = response.data.job;
                    setApplication(appData);
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
                        work_mode: jobData.work_mood || jobData.work_mode,
                        salary: jobData.hide_salary ? t('jobs.hidden', { defaultValue: 'Hidden' }) : `${jobData.salary_range?.min || jobData.salary_min || 0} - ${jobData.salary_range?.max || jobData.salary_max || 0}`,
                        currency: jobData.currency || 'USD',
                        application_date: appData?.created_at ? new Date(appData.created_at).toLocaleDateString() : (jobData.created_at ? new Date(jobData.created_at).toLocaleDateString() : ''),
                        visibility: `${jobData.expires_in_days || 0} ${t('jobs.days', { defaultValue: 'Days' })}`,
                        expiry_date: jobData.expires_at ? new Date(jobData.expires_at).toLocaleDateString() : '',
                        state: jobData.status as any,
                        description: jobData.description,
                        experience_level: jobData.experience_level,
                        employment_type: jobData.employment_type,
                        location: jobData.location?.display || `${jobData.region || ''}, ${jobData.country_code || ''}`,
                        visibility_duration: `${jobData.expires_in_days || 0} ${t('jobs.daysUpper', { defaultValue: 'DAYS' })}`,
                        job_template: jobData.job_template,
                        employer: jobData.employer,
                        latest_applications: jobData.latest_applications,
                    };
                    setJob(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch applied job details", error);
            } finally {
                // setLoading(false);
            }
        };

        fetchDetails();
    }, [jobId]);

    // Convert job_template fields to FormElement[] for the preview modal
    const templateElements: FormElement[] = React.useMemo(() => {
        if (job?.job_template?.fields && Array.isArray(job.job_template.fields)) {
            return apiFieldsToElements(job.job_template.fields);
        }
        return [];
    }, [job?.job_template]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spin size="large" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="p-6 text-center text-gray-500">
                {t('common.noData', { defaultValue: 'No data found' })}
            </div>
        );
    }

    const templateName = job.job_template?.title || 'Job Template';

    // Get category name (handle both string and object shapes)
    const categoryName = typeof job.category === 'object' && job.category
        ? job.category.name
        : (job.category as string) || '';

    // Get salary display
    const salaryDisplay = job.hide_salary
        ? 'Hidden'
        : (job.salary || `${job.salary_min || 0} - ${job.salary_max || 0}`);

    const latestApplications = job.latest_applications || [];

    return (
        <div className="p-6">
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-[#00664F] mb-6 hover:opacity-80 transition-opacity font-medium uppercase text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
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
                             html={typeof job.description === 'string' ? job.description : ''}
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
                    {!isApplied && (
                        <div className="mt-2 text-left w-full ltr">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-medium text-[#18191C]">
                                    {t('jobs.details.viewCandidates', { defaultValue: 'View candidates' })} :
                                </h3>
                                <button
                                    onClick={() => onViewApplicants?.(job.id)}
                                    className="flex items-center gap-1 text-[#18191C] text-sm font-medium hover:text-[#00664F] transition-colors"
                                >
                                    {t('common.viewAll', { defaultValue: 'View All' })}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {latestApplications.length > 0 ? (
                                <div className="flex gap-3 flex-wrap">
                                    {latestApplications.slice(0, 3).map((app: any) => (
                                        <div
                                            key={app.id}
                                            className="bg-white rounded-xl border border-[#E7F0FA] p-4 min-w-[180px] flex-1 max-w-[220px]"
                                        >
                                            <p className="text-xs text-[#767F8C] mb-1">#{app.id}</p>
                                            <p className="text-sm font-medium text-[#18191C] mb-1">
                                                {app.candidate?.name || 'Applicant'}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-[#767F8C]">
                                                <span className={`inline-block w-2 h-2 rounded-full ${app.status === 'new' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                                {app.status === 'new' ? 'New' : app.status.replace('_', ' ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-[#767F8C]">
                                    {t('jobs.details.noApplications', { defaultValue: 'No applications yet' })}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Application Details for Consumer View */}
                    {isApplied && application && (
                        <div className="mt-6">
                            <h3 className="text-md font-medium text-[#18191C] mb-4">
                                {t('jobs.details.yourApplication', { defaultValue: 'Your Application' })}
                            </h3>
                            <div className=" p-4 rounded-xl border-2 border-[#E7F0FA]  flex flex-col gap-4">
                                
                                {/* Candidate Info */}
                                {application.candidate && (
                                    <div className="flex items-center gap-3 pb-4 border-b border-[#E7F0FA]">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                            {application.candidate.image ? (
                                                <img 
                                                    src={application.candidate.image.startsWith('http') ? application.candidate.image : `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${application.candidate.image}`} 
                                                    alt={application.candidate.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/logo-no-background.svg';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                    <span className="text-xl font-bold">{application.candidate.name?.charAt(0) || 'U'}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[#18191C]">{application.candidate.name}</p>
                                            <p className="text-xs text-[#767F8C]">{t('jobs.details.applicant', { defaultValue: 'Applicant' })}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#767F8C]">{t('jobs.details.status', { defaultValue: 'Status' })}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                        application.status === 'new' ? 'bg-green-100 text-[#00664F]' : 
                                        application.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {application.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#767F8C]">{t('jobs.details.appliedOn', { defaultValue: 'Applied On' })}</span>
                                    <span className="text-sm font-medium text-[#18191C]">
                                        {new Date(application.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                {application.field_answers && application.field_answers.length > 0 && (
                                    <div className="mt-2 pt-4 border-t border-[#E7F0FA]">
                                        <h4 className="text-sm font-medium text-[#18191C] mb-3">{t('jobs.details.yourAnswers', { defaultValue: 'Your Answers' })}</h4>
                                        <div className="flex flex-col gap-3">
                                            {application.field_answers.map((answer: any, idx: number) => (
                                                <div key={idx}>
                                                    <p className="text-xs text-[#767F8C] mb-1">{answer.label}</p>
                                                    <p className="text-sm text-[#18191C] font-medium">{answer.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Job Overview Card */}
                <div className="w-full lg:w-[430px]">
                    <div>
                        <div className="flex justify-between items-start mb-6 bg-white rounded-xl border-2 border-[#E7F0FA] p-6 pb-6">
                            <div className="w-full flex justify-between items-center">
                                <div className="text-center w-1/2 border-r-2 border-[#E7F0FA] pr-4">
                                    <p className="text-xs font-medium text-[#18191C] uppercase">{t('jobs.details.salary', { defaultValue: 'Salary' })} ({job.currency || 'USD'})</p>
                                    <p className="text-[#00664F] text-lg">{salaryDisplay}</p>
                                    <p className="text-xs text-[#767F8C]">{t('jobs.details.salaryHint', { defaultValue: 'Yearly salary' })}</p>
                                </div>
                                <div className="text-center w-1/2 pl-4">
                                    <div className="flex justify-center mb-1 text-[#00664F]">
                                        <Image src="/MapTrifold.svg" alt="Location" width={24} height={24} />
                                    </div>
                                    <p className="text-sm font-medium text-[#18191C]">{t('jobs.details.jobLocation', { defaultValue: 'Job Location' })}</p>
                                    <p className="text-[#767F8C] text-sm">{job.location || `${job.region || ''}, ${job.country_code || ''}` || 'Remote'}</p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-xl border-2 border-[#E7F0FA] p-6'>

                            <h3 className="text-md font-medium text-[#18191C] mb-5">{t('jobs.details.jobOverview', { defaultValue: 'Job Overview' })}</h3>

                            <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                                {/* Visibility Duration */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><Image src="/CalendarBlank.svg" alt="Calendar" width={24} height={24} /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.visibilityDuration', { defaultValue: 'VISIBILITY DURATION :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{job.visibility_duration || `${job.expires_in_days || 0} DAYS`}</p>
                                </div>

                                {/* Application Date */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><Image src="/Timer.svg" alt="Timer" width={24} height={24} /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.applicationDate', { defaultValue: 'APPLICATION DATE:' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{job.application_date || (job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : '')}</p>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><Image src="/Stack.svg" alt="Stack" width={24} height={24} /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.experienceLevel', { defaultValue: 'EXPERINCE LEVEL:' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{job.experience_level ? formatExperience(t, job.experience_level as ExperienceLevel) : formatExperience(t, ExperienceLevel.JUNIOR)}</p>
                                </div>

                                {/* Work Mode */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><Image src="/Wallet.svg" alt="Wallet" width={24} height={24} /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.workMode', { defaultValue: 'WORK MODE :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{job.work_mode ? formatWorkMode(t, job.work_mode as WorkMode) : '-'}</p>
                                </div>

                                {/* Category */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><Image src="/briefcase.svg" alt="Briefcase" width={24} height={24} /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.category', { defaultValue: 'CATEGORY :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{categoryName}</p>
                                </div>

                                {/* Employment Type */}
                                <div>
                                    <div className="text-[#00664F] mb-2"><Image src="/briefcase.svg" alt="Briefcase" width={24} height={24} /></div>
                                    <p className="text-[11px] text-[#767F8C] uppercase mb-[2px]">{t('jobs.details.employmentType', { defaultValue: 'EMPLOYMENT TYPE :' })}</p>
                                    <p className="text-sm text-[#18191C] font-medium">{job.employment_type ? formatEmploymentType(t, job.employment_type as EmploymentType) : formatEmploymentType(t, EmploymentType.FULL_TIME)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {!isApplied && <div className="mt-6 flex flex-col gap-3">
                        <button
                            onClick={() => onEdit?.(job.id)}
                            className="w-full bg-[#00664F] text-white py-3 rounded-md font-medium hover:bg-[#005542] transition-colors"
                        >
                            {t('jobs.details.editJob', { defaultValue: 'Edit Job' })}
                        </button>

                        <button
                            onClick={() => onStatusChange?.(job.id, job.state || job.status || 'ACTIVE')}
                            className="w-full border-2 border-[#00664F] text-[#00664F] py-3 rounded-md font-medium transition-colors"
                        >
                            {(job.state === 'PAUSED' || job.status === 'PAUSED')
                                ? t('jobs.details.resumeJob', { defaultValue: 'Resume Job' })
                                : (job.state === 'EXPIRED' || job.status === 'EXPIRED')
                                    ? t('jobs.details.renewJob', { defaultValue: 'Renew Job' })
                                    : t('jobs.details.pauseJob', { defaultValue: 'Pause Job' })
                            }
                        </button>

                        <button
                            onClick={() => onDelete?.(job.id)}
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
        </div>
    );
};

export default JobAppliedDetails;

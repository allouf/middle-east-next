"use client";

import React, { useCallback, useEffect, useState } from 'react';
import StepIndicator from '@/components/ui/StepIndicator';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Job, JobFormData } from '../types';
import JobBasic from './steps/JobBasic';
import JobDescription from './steps/JobDescription';
import Salary from './steps/Salary';
import VisibilityDeadline from './steps/VisibilityDeadline';
import PreviewJob from './PreviewJob';
import JobPublishModal from './JobPublishModal';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import useJobsApi from '../useJobsApi';
import { Spin } from 'antd';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';

interface EditJobProps {

    onBack: () => void;
    onSuccess?: () => void;
    jobId:string|number
}

/**
 * Maps a Job object (API shape) to the internal JobFormData shape.
 */
function jobToFormData(job: Job): JobFormData {
    // Derive category ID — could be a nested object or a string
    let categoryId: string | undefined;
    if (typeof job.category === 'object' && job.category?.id) {
        categoryId = job.category.id.toString();
    } else if (job.category_id) {
        categoryId = job.category_id.toString();
    } else if (typeof job.category === 'string') {
        categoryId = job.category;
    }


    // Derive visibility duration
    let visibilityDuration: string | undefined;

    // Helper to map days to duration key
    const mapDaysToDuration = (days: number) => {
        if (days <= 7) return "7days";
        if (days <= 14) return "14days";
        if (days <= 30) return "30days";
        if (days <= 60) return "60days";
        return "90days";
    };

    // 1. Try to calculate from created_at and expires_at (Most accurate for original duration)
    if (job.created_at && job.expires_at) {
        const created = new Date(job.created_at);
        const expires = new Date(job.expires_at);
        const diffTime = expires.getTime() - created.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            visibilityDuration = mapDaysToDuration(diffDays);
        }
    }

    // 2. Fallback to visibility_duration field if present
    if (!visibilityDuration && job.visibility_duration) {
        visibilityDuration = job.visibility_duration;
    }

    // 3. Fallback to expires_in_days (Least accurate as it decays)
    if (!visibilityDuration && job.expires_in_days !== undefined && job.expires_in_days !== null) {
        const remainingDays = Number(job.expires_in_days);
        // This is tricky because remaining days < original duration. 
        // We might just show what's left or map to closest bucket?
        // Using same mapping means if 1 day left, it maps to 7days. 
        // This is acceptable as fallback if dates are missing.
        if (!isNaN(remainingDays)) {
            visibilityDuration = mapDaysToDuration(remainingDays);
        }
    }

    return {

        // Step 1
        templateId: job.job_template_id ? String(job.job_template_id) : undefined,
        category: categoryId,
        workMode: job.work_mode || undefined,
        title: job.title || undefined,
        employmentType: job.employment_type || undefined,
        experienceLevel: job.experience_level || undefined,
        country:job.country_code|| undefined, // Will be resolved by JobBasic when countries load
        countryCode: job.country_code || null,
        city: job.region || job.location || undefined,

        // Step 2
        description: job.description || undefined,

        // Step 3
        salaryMin: job.salary_min != null ? Number(job.salary_min) : undefined,
        salaryMax: job.salary_max != null ? Number(job.salary_max) : undefined,
        currency: job.currency || undefined,
        hideSalary: job.hide_salary === true || (job.hide_salary as any) === 1 || false,

        // Step 4
        applicationDeadline: job.application_deadline || job.application_date || null,
        visibilityDuration,
    };

}

const EditJob: React.FC<EditJobProps> = ({ jobId, onBack, onSuccess }) => {
    const { t } = useTranslation();
    const {isRTL} = useLocaleDirection();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<JobFormData>();
    const [isPreview, setIsPreview] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const { getJobDetails ,updateJob, loading } = useJobsApi();
    const [detailsLoading,setDetailsLoading] = useState(false);
    const [job, setJob] = useState<Job | null>(null);

    const fetchJobDetails = useCallback(async (id: string | number) => {
        setDetailsLoading(true);
        try {
            const response = await getJobDetails(id);
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
                    country_code:jobData.country_code,
                    region:jobData.region,
                    location: `${jobData.region || ''}, ${jobData.country_code || ''}`,
                    visibility_duration: `${jobData.expires_in_days || 0} ${t('jobs.daysUpper', { defaultValue: 'DAYS' })}`,
                    job_template: jobData.job_template,
                    employer: jobData.employer,
                    latest_applications: jobData.latest_applications,
                };
                setJob(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch job details", error);
        } finally {
            setDetailsLoading(false);
        }
    }, [getJobDetails]);

    useEffect(() => {
        if (jobId) {
            fetchJobDetails(jobId);
        }
    }, [jobId, fetchJobDetails]);

    const stepLabels = [
        t("jobs.stepBasic", "Job Basic"),
        t("jobs.stepDescription", "Job Description"),
        t("jobs.stepSalary", "Salary"),
        t("jobs.stepVisibility", "Visibility & Deadline")
    ];

    // Re-initialize form data if job changes
    useEffect(() => {
        if(job)
            setFormData(jobToFormData(job));
    }, [job]);


    // ─── Validation per step ────────────────────────────────
    const validateStep = (currentStep: number): Record<string, string> => {
        const errors: Record<string, string> = {};
        if(!formData) return errors;
        switch (currentStep) {
            case 1:
                if (!formData.category) errors.category = t("validation.categoryRequired", "Category is required");
                if (!formData.workMode) errors.workMode = t("validation.workModeRequired", "Work Mode is required");
                if (!formData.title?.trim()) errors.title = t("validation.titleRequired", "Job Title is required");
                if (!formData.employmentType) errors.employmentType = t("validation.employmentTypeRequired", "Employment Type is required");
                if (!formData.experienceLevel) errors.experienceLevel = t("validation.experienceLevelRequired", "Experience Level is required");
                if (!formData.country) errors.country = t("validation.countryRequired", "Country is required");
                if (!formData.city?.trim()) errors.city = t("validation.cityRequired", "City is required");
                break;
            case 2:
                if (!formData.description?.trim()) errors.description = t("validation.descriptionRequired", "Job Description is required");
                break;
            case 3:
                if (!formData.salaryMin && formData.salaryMin !== 0) errors.salaryMin = t("validation.minSalaryRequired", "Minimum Salary is required");
                if (!formData.salaryMax && formData.salaryMax !== 0) errors.salaryMax = t("validation.maxSalaryRequired", "Maximum Salary is required");
                if (formData.salaryMin != null && formData.salaryMax != null && formData.salaryMin > formData.salaryMax) {
                    errors.salaryMin = t("validation.salaryRange", "Min Salary cannot exceed Max Salary");
                }
                if (!formData.currency) errors.currency = t("validation.currencyRequired", "Currency is required");
                break;
            case 4:
                if (!formData.applicationDeadline) errors.applicationDeadline = t("validation.deadlineRequired", "Application Deadline is required");
                break;
        }

        return errors;
    };

    const handleStepChange = (newStep: number) => {
        if (newStep > step) {
            const errors = validateStep(step);
            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                return;
            }
            setFieldErrors({});
        }

        if (newStep > 4) {
            setIsPreview(true);
        } else {
            setStep(newStep);
        }
    };

    const handleBackFromPreview = () => {
        setIsPreview(false);
        setStep(4);
    };

    const constructPayload = (status?: string) => {
        if(!formData) return {};
        return {
            title: formData.title,
            employment_type: formData.employmentType,
            experience_level: formData.experienceLevel,
            country_code: formData.countryCode,
            region: formData.city,
            work_mode: formData.workMode,
            description: formData.description,
            salary_min: formData.salaryMin,
            salary_max: formData.salaryMax,
            hide_salary: formData.hideSalary ? 1 : 0,
            application_deadline: formData.applicationDeadline,
            ...(status ? { status } : {}),
            application_link: null,
            job_template_id: formData.templateId || null,
            category_id: formData.category ,
            currency:formData.currency
        };
    };

    const handleSubmit = async () => {
        try {
            const payload = constructPayload();
            await updateJob(job.id, payload);
            setModalType("success");
            setModalOpen(true);
        } catch (error) {
            console.error(error);
            setModalType("error");
            setModalOpen(true);
        }
    };

    const handleSaveDraft = async () => {
        try {
            const payload = constructPayload("DRAFT");
            await updateJob(job.id, payload);
            if (onSuccess) onSuccess();
            onBack();
        } catch (error) {
            console.error("Failed to save draft", error);
        }
    };

    if (isPreview&&formData) {
        return (
            <>
                <PreviewJob
                    data={formData}
                    onBack={handleBackFromPreview}
                    onSubmit={handleSubmit}
                    onSaveDraft={handleSaveDraft}
                />
                <JobPublishModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    type={modalType}
                    onGoToJobs={() => {
                        if (onSuccess) onSuccess();
                        onBack();
                    }}
                />
            </>
        );
    }
    if(detailsLoading){
        return    <div className="flex justify-center items-center min-h-[400px]">
                            <Spin size="large" />
                        </div>;
    }
    if(!formData){
        return    <div className="flex justify-center items-center min-h-[400px]">
                    <Spin size="large" />
                </div>;
    }

    return (
        <div className="w-full py-6 px-8">
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-[#00664F] hover:underline gap-2 font-medium"
                >
                    {isRTL?<ArrowRight className="w-4 h-4" />:<ArrowLeft className="w-4 h-4" />}
                    {t("buttons.goBack", "GO BACK")}
                </button>
            </div>

            <div className="mb-8">
                <h1 className={`text-2xl font-bold text-[#373737] ${isRTL?'border-r-4 pr-3':'border-l-4 pl-3'} border-[#00664F] `}>
                    {t("jobs.editJobTitle", "Edit Job")}
                </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm min-h-[500px]">
                <StepIndicator
                    step={step}
                    setStep={handleStepChange}
                    totalSteps={4}
                    stepLabels={stepLabels}
                    onCancel={onBack}
                    onSaveDraft={handleSaveDraft}
                    onFinish={() => handleStepChange(5)}
                    wrapperButton="justify-start"
                    variant="circular"
                >
                    <div className="py-6">
                        {step === 1 && (
                            <JobBasic
                                data={formData}
                                updateData={(data: Partial<JobFormData>) => setFormData(prev => ({ ...prev, ...data }))}
                                errors={fieldErrors}
                                initialTemplateName={job?.job_template?.title}
                            />
                        )}
                        {step === 2 && (
                            <JobDescription
                                data={formData}
                                updateData={(data: Partial<JobFormData>) => setFormData(prev => ({ ...prev, ...data }))}
                                errors={fieldErrors}
                            />
                        )}
                        {step === 3 && (
                            <Salary
                                data={formData}
                                updateData={(data: Partial<JobFormData>) => setFormData(prev => ({ ...prev, ...data }))}
                                errors={fieldErrors}
                            />
                        )}
                        {step === 4 && (
                            <VisibilityDeadline
                                data={formData}
                                updateData={(data: Partial<JobFormData>) => setFormData(prev => ({ ...prev, ...data }))}
                                errors={fieldErrors}
                            />
                        )}
                    </div>
                </StepIndicator>
            </div>
        </div>
    );
};

export default EditJob;

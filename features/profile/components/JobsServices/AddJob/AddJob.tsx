"use client";

import React, { useState } from 'react';
import StepIndicator from '@/components/ui/StepIndicator';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { JobFormData } from '../types';
import JobBasic from './steps/JobBasic';
import JobDescription from './steps/JobDescription';
import Salary from './steps/Salary';
import VisibilityDeadline from './steps/VisibilityDeadline';
import PreviewJob from './PreviewJob';
import JobPublishModal from './JobPublishModal';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useJobsApi from '../useJobsApi';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';

interface AddJobProps {
    onBack: () => void;
    onSuccess?: () => void;
}

const AddJob: React.FC<AddJobProps> = ({ onBack, onSuccess }) => {
    const { t } = useTranslation();
    const {isRTL} = useLocaleDirection();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<JobFormData>({});
    const [isPreview, setIsPreview] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const { createJob, loading } = useJobsApi();

    const stepLabels = [
        t("jobs.stepBasic", "Job Basic"),
        t("jobs.stepDescription", "Job Description"),
        t("jobs.stepSalary", "Salary"),
        t("jobs.stepVisibility", "Visibility & Deadline")
    ];

    // ─── Validation per step — returns field-level errors ────
    const validateStep = (currentStep: number): Record<string, string> => {
        const errors: Record<string, string> = {};

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
        // Only validate when moving forward
        if (newStep > step) {
            const errors = validateStep(step);
            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                return;
            }
            // Clear errors when step is valid
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

    const constructPayload = (status: "ACTIVE" | "DRAFT") => {
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
            status: status,
            application_link: null,
            job_template_id: formData.templateId || null,
            category_id: formData.category ,
            currency:formData.currency
        };
    };

    const handleSubmit = async () => {
        try {
            const payload = constructPayload("ACTIVE");
            await createJob(payload);
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
            await createJob(payload);
            if (onSuccess) onSuccess();
            onBack();
        } catch (error) {
            console.error("Failed to save draft", error);
        }
    };

    const handleUpdateData = (data: Partial<JobFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
        
        setFieldErrors(prev => {
            if (Object.keys(prev).length === 0) return prev;
            
            const newErrors = { ...prev };
            let hasChanges = false;
            
            Object.entries(data).forEach(([key, value]) => {
                if (value === undefined || value === null) return;
                
                let isValid = true;
                if (typeof value === 'string') {
                    isValid = value.trim() !== '';
                }
                
                if (isValid && newErrors[key]) {
                    delete newErrors[key];
                    hasChanges = true;
                }
            });
            
            return hasChanges ? newErrors : prev;
        });
    };

    if (isPreview) {
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
                    {t("jobs.addJobTitle", "Add The Required Data To Create Your Own Job")}
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
                                updateData={handleUpdateData}
                                errors={fieldErrors}
                            />
                        )}
                        {step === 2 && (
                            <JobDescription
                                data={formData}
                                updateData={handleUpdateData}
                                errors={fieldErrors}
                            />
                        )}
                        {step === 3 && (
                            <Salary
                                data={formData}
                                updateData={handleUpdateData}
                                errors={fieldErrors}
                            />
                        )}
                        {step === 4 && (
                            <VisibilityDeadline
                                data={formData}
                                updateData={handleUpdateData}
                                errors={fieldErrors}
                            />
                        )}
                    </div>
                </StepIndicator>
            </div>
        </div>
    );
};

export default AddJob;

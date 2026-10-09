import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ArrowLeft } from 'lucide-react';
import { Checkbox } from 'antd';
import InputField from '@/components/ui/InputField';

import Button from '@/components/ui/Button';
import useFormData from '@/lib/Hooks/useFormData';
import SelectField from '@/components/ui/SelectFiled';
import GlowLight from '@/components/shered/GlowLight';
import { CiCirclePlus } from 'react-icons/ci';
import { Trash2 } from 'lucide-react';
import useJobProfileApi from '../useJobProfileApi';

interface WorkExperienceFormData {
  job_title: string;
  company_name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  industry: string;
  is_current: boolean;
  [key: string]: any;
}
// {
//   "company_name": "ACME Inc.",
//   "job_job_title": "Software Engineer",
//   "industry": "IT",
//   "description": "Worked on various Laravel projects.",
//   "start_date": "2024-01-01",
//   "end_date": null,
//   "is_current": true
// }
interface WorkExperienceFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
  initialData?: WorkExperienceFormData & { id?: string | number };
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({ onBack, onSuccess, initialData }) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addWorkExperience, updateWorkExperience, loading } = useJobProfileApi();

  // Initial state for single experience
  const emptyExperience: WorkExperienceFormData = {
    job_title: '',
    company_name: '',
    description: '',
    start_date: '',
    end_date: null,
    industry: '',
    is_current: false
  };

  // State to manage multiple items (only for add mode)
  const [items, setItems] = useState<WorkExperienceFormData[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<number, Record<string, string>>>({});

  // Populate form when initialData changes or initialization
  React.useEffect(() => {
    if (initialData) {
      setItems([{
        job_title: initialData.job_title || '',
        company_name: initialData.company_name || '',
        description: initialData.description || '',
        start_date: formatDateForInput(initialData.start_date),
        end_date: formatDateForInput(initialData.end_date),
        industry: initialData.industry || '',
        is_current: !!initialData.is_current
      }]);
    } else {
      setItems([emptyExperience]);
    }
  }, [initialData]);

  // Helper to format date strings for datetime-local input (YYYY-MM-DDTHH:mm)
  function formatDateForInput(dateString: string | null) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 16);
    } catch (e) {
      return '';
    }
  }

  const handleItemChange = (index: number, field: string, input: any) => {
    const value = input && typeof input === 'object' && 'target' in input
      ? input.target.value
      : input;

    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };

      // Clear end_date if is_current is checked
      if (field === 'is_current' && value === true) {
        next[index].end_date = null;
      }

      return next;
    });

    // Clear error for this field
    if (fieldErrors[index]?.[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [index]: { ...prev[index], [field]: '' }
      }));
    }
  };

  const handleAddMore = () => {
    setItems(prev => [...prev, { ...emptyExperience }]);
  };

  const handleRemove = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[index];
        // Shift errors if necessary or just recreate? 
        // Simpler to just clear all errors for now or re-validate
        return {};
      });
    }
  };

  const validate = () => {
    const newErrors: Record<number, Record<string, string>> = {};
    let hasErrors = false;

    items.forEach((item, index) => {
      const errors: Record<string, string> = {};
      if (!item.job_title) errors.job_title = t('errors.required');
      if (!item.company_name) errors.company_name = t('errors.required');
      if (!item.description) errors.description = t('errors.required');
      if (!item.start_date) errors.start_date = t('errors.required');
      if (!item.industry) errors.industry = t('errors.required');
      if (!item.is_current && !item.end_date) errors.end_date = t('errors.required');

      if (Object.keys(errors).length > 0) {
        newErrors[index] = errors;
        hasErrors = true;
      }
    });

    setFieldErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!validate()) return;

    try {
      if (initialData?.id) {
        // Update mode - single item
        const payload = items[0];
        await updateWorkExperience(initialData.id, payload, { showMessage: true });
      } else {
        // Add mode - multiple items
        const payload = { items };
        await addWorkExperience(payload, { showMessage: true });
      }

      if (onSuccess) {
        onSuccess()
      }
      if (onBack) {
        onBack()
      }
    } catch (error) {
      console.error('Failed to save work experience:', error);
    }
  };

  const handleCancel = () => {
    if (onBack) onBack();
  };

  return (
    <div>

      <div className="flex flex-col gap-8">
        {items.map((item, index) => (
          <div key={index} className="relative group w-full">
            {/* Remove Button */}
            {!initialData && items.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-3 -right-3 text-red-500 hover:text-red-700 bg-white rounded-full p-2 shadow-sm border border-gray-100 transition-all z-20 opacity-0 group-hover:opacity-100"
                title={t('common.remove', { defaultValue: 'Remove' })}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="w-full bg-[#FCFCFC] rounded-[20px] p-6 relative overflow-hidden border border-gray-100">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id={`job_title_${index}`}
                    type="text"
                    label={t('jobs.userProfile.workExperience.jobTitle', { defaultValue: 'Job title' })}
                    value={item.job_title}
                    onChange={(val) => handleItemChange(index, 'job_title', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.job_title}
                    placeholder={t('jobs.userProfile.workExperience.jobTitlePlaceholder', { defaultValue: 'Enter job title' })}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                  // showErrorMessage
                  />

                  <InputField
                    id={`company_name_${index}`}
                    type="text"
                    label={t('jobs.userProfile.workExperience.companyName', { defaultValue: 'Company Name' })}
                    value={item.company_name}
                    onChange={(val) => handleItemChange(index, 'company_name', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.company_name}
                    placeholder={t('jobs.userProfile.workExperience.companyNamePlaceholder', { defaultValue: 'Enter company name' })}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                  />
                </div>

                <div className="md:col-span-2">
                  <InputField
                    id={`description_${index}`}
                    type="textarea"
                    label={t('jobs.userProfile.workExperience.jobDescription', { defaultValue: 'Job Description' })}
                    value={item.description}
                    onChange={(val) => handleItemChange(index, 'description', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.description}
                    placeholder={t('jobs.userProfile.workExperience.jobDescriptionPlaceholder', { defaultValue: 'Describe your role and responsibilities...' })}
                    withFieldset
                    rows={4}
                    required
                    isSubmited={isSubmitted}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id={`start_date_${index}`}
                    type="datetime-local"
                    label={t('jobs.userProfile.workExperience.startDate', { defaultValue: 'Start Date' })}
                    value={item.start_date}
                    onChange={(val) => handleItemChange(index, 'start_date', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.start_date}
                    placeholder={t('jobs.userProfile.workExperience.startDatePlaceholder', { defaultValue: 'Select start date' })}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                    isPassDate={true}
                    isFeatureDate={false}
                  />

                  <InputField
                    id={`end_date_${index}`}
                    type="datetime-local"
                    label={t('jobs.userProfile.workExperience.endDate', { defaultValue: 'End Date' })}
                    value={item.end_date ?? ''}
                    onChange={(val) => handleItemChange(index, 'end_date', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.end_date}
                    placeholder={t('jobs.userProfile.workExperience.endDatePlaceholder', { defaultValue: 'Select end date' })}
                    withFieldset
                    required={!item.is_current}
                    isSubmited={isSubmitted}
                    isPassDate={true}
                    isFeatureDate={false}
                  />
                </div>

                <div className="md:col-span-2">
                  <InputField
                    id={`industry_${index}`}
                    label={t('jobs.userProfile.workExperience.fieldOfWork', { defaultValue: 'Field of Work' })}
                    value={item.industry}
                    onChange={(val) => handleItemChange(index, 'industry', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.industry}
                    placeholder={t('jobs.userProfile.workExperience.fieldOfWorkPlaceholder', { defaultValue: 'Select field of work' })}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`is_current_${index}`}
                      checked={item.is_current}
                      onChange={(e) => handleItemChange(index, 'is_current', e.target.checked)}
                      className="text-blueSite text-[18px]"
                    >
                      {t('jobs.userProfile.workExperience.isCurrent', { defaultValue: 'Are you still working for this company?' })}
                    </Checkbox>
                  </div>
                </div>
              </div>

              <GlowLight
                color="#06B187"
                size="w-[55px] h-[40px]"
                opacity="opacity-80"
                blur="blur-[35px] sm:blur-[35px]"
                position="top-0 right-0"
              />
              <GlowLight
                color="#06B187"
                size="w-[50px] h-[40px]"
                opacity="opacity-80"
                blur="blur-[35px] sm:blur-[35px]"
                position="bottom-0 left-0"
              />
            </div>
          </div>
        ))}
      </div>

      {!initialData && (
        <div className="mt-4">
          <Button
            unstyled
            onClick={handleAddMore}
            className='text-blueSite flex flex-row items-center gap-2 text-[20px] py-1 hover:opacity-80 transition-opacity'
          >
            <CiCirclePlus className="w-5 h-5" />
            {t('jobs.userProfile.workExperience.addMore', { defaultValue: 'Add more practical experience' })}
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <Button
          unstyled
          className="px-20 text-white font-somar-semibold py-2 bg-blueSite hover:bg-blueSite/90 rounded-[10px] text-[20px] "
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t('common.confirming', { defaultValue: 'Confirming...' }) : t('common.confirm', { defaultValue: 'Confirm' })}
        </Button>
        <Button
          className="px-6 py-2 text-blueSite underline underline-offset-2 text-[20px]"
          unstyled
          onClick={handleCancel}
        >
          {t('common.cancel', { defaultValue: 'Cancel' })}
        </Button>
      </div>
    </div>
  );
};

export default WorkExperienceForm;
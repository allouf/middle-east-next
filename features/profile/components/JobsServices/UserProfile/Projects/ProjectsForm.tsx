import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ArrowLeft } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import useFormData from '@/lib/Hooks/useFormData';
import GlowLight from '@/components/shered/GlowLight';
import useJobProfileApi from '../useJobProfileApi';
import { Checkbox } from 'antd';
import { Project } from './project';
import { CiCirclePlus } from 'react-icons/ci';
import { Trash2 } from 'lucide-react';

interface ProjectsFormData {
  title: string;
  description: string;
  project_url: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  [key: string]: any;
}

interface ProjectsProps {
  onBack?: () => void;
  onSuccess?: () => void;
  initialData?: Project;
}

const ProjectsForm: React.FC<ProjectsProps> = ({ onBack, onSuccess, initialData }) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addProject, updateProject, loading } = useJobProfileApi();

  // Initial state for single item
  const emptyProject: ProjectsFormData = {
    title: '',
    description: '',
    project_url: '',
    start_date: '',
    end_date: null,
    is_current: false
  };

  // State to manage multiple items (only for add mode)
  const [items, setItems] = useState<ProjectsFormData[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<number, Record<string, string>>>({});

  // Populate form when initialData changes or initialization
  useEffect(() => {
    if (initialData) {
      setItems([{
        title: initialData.title,
        description: initialData.description,
        project_url: initialData.project_url || '',
        start_date: formatDateForInput(initialData.start_date),
        end_date: formatDateForInput(initialData.end_date),
        is_current: !initialData.end_date,
      }]);
    } else {
      setItems([emptyProject]);
    }
  }, [initialData]);

  // Helper to format date strings for datetime-local input
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
    setItems(prev => [...prev, { ...emptyProject }]);
  };

  const handleRemove = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[index];
        return {};
      });
    }
  };

  const validate = () => {
    const newErrors: Record<number, Record<string, string>> = {};
    let hasErrors = false;

    items.forEach((item, index) => {
      const errors: Record<string, string> = {};
      if (!item.title) errors.title = t('errors.required');
      // if (!item.description) errors.description = t('errors.required');
      if (!item.start_date) errors.start_date = t('errors.required');
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
        await updateProject(initialData.id, payload, { showMessage: true });
      } else {
        // Add mode - multiple items
        const payload = { items };
        await addProject(payload, { showMessage: true });
      }
        if (onSuccess) onSuccess();
        if (onBack) onBack();

    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleCancel = () => {
    if (onBack) onBack();
  };

  return (
    <div className='pb-4'>

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
                    id={`title_${index}`}
                    type="text"
                    label={t('jobs.userProfile.projects.projectTitle', { defaultValue: 'Project Title' })}
                    value={item.title}
                    onChange={(val) => handleItemChange(index, 'title', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.title}
                    placeholder={t('jobs.userProfile.projects.projectTitlePlaceholder', { defaultValue: 'Enter project title' })}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                  />

                  <InputField
                    id={`project_url_${index}`}
                    type="text"
                    label={t('jobs.userProfile.projects.projectUrl', { defaultValue: 'Project URL (optional)' })}
                    value={item.project_url}
                    onChange={(val) => handleItemChange(index, 'project_url', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.project_url}
                    placeholder={t('jobs.userProfile.projects.projectUrlPlaceholder', { defaultValue: 'Enter project URL' })}
                    withFieldset
                    // required
                    isSubmited={isSubmitted}
                  />
                </div>

                <InputField
                  id={`description_${index}`}
                  type="textarea"
                  label={t('jobs.userProfile.projects.description', { defaultValue: 'Project Description' })}
                  value={item.description}
                  onChange={(val) => handleItemChange(index, 'description', val)}
                  formErrors={fieldErrors[index] || {}}
                  error={fieldErrors[index]?.description}
                  placeholder={t('jobs.userProfile.projects.descriptionPlaceholder', { defaultValue: 'Describe your project in detail...' })}
                  withFieldset
                  rows={4}
                  // required
                  isSubmited={isSubmitted}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id={`start_date_${index}`}
                    type="datetime-local"
                    label={t('jobs.userProfile.projects.startDate', { defaultValue: 'Start Date' })}
                    value={item.start_date}
                    onChange={(val) => handleItemChange(index, 'start_date', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.start_date}
                    placeholder={t('jobs.userProfile.projects.startDatePlaceholder', { defaultValue: 'Select start date' })}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                    isPassDate={true}
                    isFeatureDate={false}
                  />

                  <InputField
                    id={`end_date_${index}`}
                    type="datetime-local"
                    label={t('jobs.userProfile.projects.endDate', { defaultValue: 'End Date' })}
                    value={item.end_date ?? ''}
                    onChange={(val) => handleItemChange(index, 'end_date', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.end_date}
                    placeholder={t('jobs.userProfile.projects.endDatePlaceholder', { defaultValue: 'Select end date' })}
                    withFieldset
                    required={!item.is_current}
                    isSubmited={isSubmitted}
                    isPassDate={true}
                    disabled={item.is_current}
                    isFeatureDate={false}
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
                      {t('jobs.userProfile.projects.isCurrent', { defaultValue: 'Are you currently working on this project?' })}
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
            {t('jobs.userProfile.projects.addMore', { defaultValue: 'Add more project' })}
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <Button 
          unstyled
          className="px-20 text-white font-somar-semibold py-2 bg-blueSite hover:bg-blueSite/90 rounded-[10px] text-[20px]"
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

export default ProjectsForm;

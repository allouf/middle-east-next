'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Checkbox } from 'antd';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import SelectField from '@/components/ui/SelectFiled';
import GlowLight from '@/components/shered/GlowLight';
import useJobProfileApi from '../useJobProfileApi';
import { AcademicRecord } from './academic';
import { CiCirclePlus } from 'react-icons/ci';
import { Trash2 } from 'lucide-react';
import { getCertificateTypeOptions } from '../../helper';

interface AcademicCertificatesFormData {
  degree_type: string;
  university_name: string;
  major: string;
  start_date: string;
  end_date: string | null;
  expected_graduation_date: string;
  is_current: boolean;
  description: string;
  [key: string]: any;
}

interface AcademicCertificatesProps {
  onBack?: () => void;
  onSuccess?: () => void;
  initialData?: AcademicRecord;
}

const AcademicCertificates: React.FC<AcademicCertificatesProps> = ({ onBack, onSuccess, initialData }) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addEducation, updateEducation, loading } = useJobProfileApi();

  // Initial state for single item
  const emptyEducation: AcademicCertificatesFormData = {
    degree_type: '',
    university_name: '',
    major: '',
    start_date: '',
    end_date: null,
    expected_graduation_date: '',
    is_current: false,
    description: '',
  };

  // Certificate type options


  // State to manage multiple items (only for add mode)
  const [items, setItems] = useState<AcademicCertificatesFormData[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<number, Record<string, string>>>({});

  // Populate form when initialData changes or initialization
  useEffect(() => {
    if (initialData) {
      setItems([{
        degree_type: initialData.degree_type,
        university_name: initialData.university_name,
        major: initialData.major,
        start_date: formatDateForInput(initialData.start_date),
        end_date: formatDateForInput(initialData.end_date),
        expected_graduation_date: formatDateForInput(initialData.expected_graduation_date),
        is_current: !!initialData.is_current,
        description: initialData.description || '',
      }]);
    } else {
      setItems([emptyEducation]);
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
    setItems(prev => [...prev, { ...emptyEducation }]);
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
      if (!item.degree_type) errors.degree_type = t('errors.required');
      if (!item.university_name) errors.university_name = t('errors.required');
      if (!item.major) errors.major = t('errors.required');
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
        await updateEducation(initialData.id, payload, { showMessage: true });
      } else {
        // Add mode - multiple items
        const payload = { items };
        await addEducation(payload, { showMessage: true });
      }
        if (onSuccess) onSuccess();
        if (onBack) onBack();
    

    } catch (error) {
      console.error('Failed to save education:', error);
    }
  };

  const handleCancel = () => {
    if (onBack) onBack();
  };

  return (
    <div className='pb-4'>

      <div className="flex flex-col gap-8 ">
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
                    id={`university_name_${index}`}
                    type="text"
                    label={t('jobs.userProfile.academicCertificates.universityName', { defaultValue: 'University Name' })}
                    value={item.university_name}
                    onChange={(val) => handleItemChange(index, 'university_name', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.university_name}
                    placeholder={t('jobs.userProfile.academicCertificates.universityNamePlaceholder', { defaultValue: 'Enter university name' })}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                  />
                  <InputField
                    id={`major_${index}`}
                    type="text"
                    label={t('jobs.userProfile.academicCertificates.major', { defaultValue: 'Major' })}
                    value={item.major}
                    onChange={(val) => handleItemChange(index, 'major', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.major}
                    placeholder={t('jobs.userProfile.academicCertificates.majorPlaceholder', { defaultValue: 'Enter major' })}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                  />
                </div>

                <div className='grid grid-cols-1 gap-6'>
                  <SelectField
                    id={`degree_type_${index}`}
                    label={t('jobs.userProfile.academicCertificates.degreeType', { defaultValue: 'Degree Type' })}
                    value={item.degree_type}
                    onChange={(val) => handleItemChange(index, 'degree_type', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.degree_type}
                    selectorOptions={getCertificateTypeOptions(t)}
                    placeholder={t('jobs.userProfile.academicCertificates.degreeTypePlaceholder', { defaultValue: 'Select degree type' })}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id={`start_date_${index}`}
                    type="datetime-local"
                    label={t('jobs.userProfile.academicCertificates.startDate', { defaultValue: 'Start Date' })}
                    value={item.start_date}
                    onChange={(val) => handleItemChange(index, 'start_date', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.start_date}
                    placeholder={t('jobs.userProfile.academicCertificates.startDatePlaceholder', { defaultValue: 'Select start date' })}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                    isPassDate={true}
                    isFeatureDate={false}
                  />

                  <InputField
                    id={`end_date_${index}`}
                    type="datetime-local"
                    label={t('jobs.userProfile.academicCertificates.endDate', { defaultValue: 'End Date' })}
                    value={item.end_date ?? ''}
                    onChange={(val) => handleItemChange(index, 'end_date', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.end_date}
                    placeholder={t('jobs.userProfile.academicCertificates.endDatePlaceholder', { defaultValue: 'Select end date' })}
                    withFieldset
                    required={!item.is_current}
                    isSubmited={isSubmitted}
                    isPassDate={true}
                    disabled={item.is_current}
                    isFeatureDate={false}
                  />
                </div>

                <InputField
                  id={`expected_graduation_date_${index}`}
                  type="datetime-local"
                  label={t('jobs.userProfile.academicCertificates.expectedGraduation', { defaultValue: 'Expected Graduation Date' })}
                  value={item.expected_graduation_date}
                  onChange={(val) => handleItemChange(index, 'expected_graduation_date', val)}
                  formErrors={fieldErrors[index] || {}}
                  error={fieldErrors[index]?.expected_graduation_date}
                  placeholder={t('jobs.userProfile.academicCertificates.expectedGraduationPlaceholder', { defaultValue: 'Select expected graduation date' })}
                  withFieldset
                  isSubmited={isSubmitted}
                />

                <InputField
                  id={`description_${index}`}
                  type="textarea"
                  label={t('jobs.userProfile.academicCertificates.description', { defaultValue: 'Description' })}
                  value={item.description}
                  onChange={(val) => handleItemChange(index, 'description', val)}
                  formErrors={fieldErrors[index] || {}}
                  error={fieldErrors[index]?.description}
                  placeholder={t('jobs.userProfile.academicCertificates.descriptionPlaceholder', { defaultValue: 'Describe your education program...' })}
                  withFieldset
                  rows={4}
                  isSubmited={isSubmitted}
                />

                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`is_current_${index}`}
                      checked={item.is_current}
                      onChange={(e) => handleItemChange(index, 'is_current', e.target.checked)}
                      className="text-blueSite text-[18px]"
                    >
                      {t('jobs.userProfile.academicCertificates.isCurrent', { defaultValue: 'Are you currently studying at this institution?' })}
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
            {t('jobs.userProfile.academicCertificates.addMore', { defaultValue: 'Add more education' })}
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

export default AcademicCertificates;

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ArrowLeft } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import useFormData from '@/lib/Hooks/useFormData';
import SelectField from '@/components/ui/SelectFiled';
import GlowLight from '@/components/shered/GlowLight';
import useJobProfileApi from '../useJobProfileApi';
import { Language } from './language';
import { CiCirclePlus } from 'react-icons/ci';
import { Trash2 } from 'lucide-react';

interface LanguagesFormData {
  language: string;
  level: string;
  [key: string]: any;
}

interface LanguagesProps {
  onBack?: () => void;
  onSuccess?: () => void;
  initialData?: Language;
}

const LanguagesForm: React.FC<LanguagesProps> = ({ onBack, onSuccess, initialData }) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addLanguage, updateLanguage, loading } = useJobProfileApi();

  // Initial state for single item
  const emptyLanguage: LanguagesFormData = {
    language: '',
    level: ''
  };

  // State to manage multiple items (only for add mode)
  const [items, setItems] = useState<LanguagesFormData[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<number, Record<string, string>>>({});

  // Populate form when initialData changes or initialization
  useEffect(() => {
    if (initialData) {
      setItems([{
        language: initialData.language,
        level: initialData.level.toString(),
      }]);
    } else {
      setItems([emptyLanguage]);
    }
  }, [initialData]);

  // Level options
  const levelOptions = [
    { id: '1', name: t('jobs.userProfile.languages.levels.beginner', { defaultValue: 'Beginner' }) },
    { id: '2', name: t('jobs.userProfile.languages.levels.elementary', { defaultValue: 'Elementary' }) },
    { id: '3', name: t('jobs.userProfile.languages.levels.intermediate', { defaultValue: 'Intermediate' }) },
    { id: '4', name: t('jobs.userProfile.languages.levels.upper_intermediate', { defaultValue: 'Upper-intermediate' }) },
    { id: '5', name: t('jobs.userProfile.languages.levels.advanced_fluent', { defaultValue: 'Advanced / Fluent' }) }
  ];

  const handleItemChange = (index: number, field: string, input: any) => {
    const value = input && typeof input === 'object' && 'target' in input
      ? input.target.value
      : input;

    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
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
    setItems(prev => [...prev, { ...emptyLanguage }]);
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
      if (!item.language) errors.language = t('errors.required');
      if (!item.level) errors.level = t('errors.required');

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
        const payload = {
          language: items[0].language,
          level: parseInt(items[0].level, 10)
        };
        await updateLanguage(initialData.id, payload, { showMessage: true });
      } else {
        // Add mode - multiple items
        const payload = {
          items: items.map(item => ({
            language: item.language,
            level: parseInt(item.level, 10)
          }))
        };
        await addLanguage(payload, { showMessage: true });
      }
        if (onSuccess) onSuccess();
        if (onBack) onBack();

    } catch (error) {
      console.error('Failed to save language:', error);
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
                <InputField
                  id={`language_${index}`}
                  type="text"
                  label={t('jobs.userProfile.languages.language', { defaultValue: 'Language' })}
                  value={item.language}
                  onChange={(val) => handleItemChange(index, 'language', val)}
                  formErrors={fieldErrors[index] || {}}
                  error={fieldErrors[index]?.language}
                  placeholder={t('jobs.userProfile.languages.languagePlaceholder', { defaultValue: 'Enter language' })}
                  withFieldset
                  required
                  isSubmited={isSubmitted}
                />

                <SelectField
                  id={`level_${index}`}
                  label={t('jobs.userProfile.languages.level', { defaultValue: 'Level' })}
                  value={item.level}
                  onChange={(val) => handleItemChange(index, 'level', val)}
                  formErrors={fieldErrors[index] || {}}
                  error={fieldErrors[index]?.level}
                  selectorOptions={levelOptions}
                  placeholder={t('jobs.userProfile.languages.levelPlaceholder', { defaultValue: 'Select proficiency level' })}
                  withFieldset
                  required
                  isSubmited={isSubmitted}
                />
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
            {t('jobs.userProfile.languages.addMore', { defaultValue: 'Add more language' })}
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

export default LanguagesForm;

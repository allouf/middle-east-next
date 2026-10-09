import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ArrowLeft, Instagram, Facebook, Twitter, Music2, Youtube, LinkedinIcon, MessageCircle, Github, Globe, Trash2 } from 'lucide-react';
import { CiCirclePlus } from 'react-icons/ci';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import useFormData from '@/lib/Hooks/useFormData';
import SelectField from '@/components/ui/SelectFiled';
import GlowLight from '@/components/shered/GlowLight';
import useJobProfileApi from '../useJobProfileApi';
import { LinkRecord } from './link';
import { getPlatformOptions } from '../../helper';

interface LinksFormData {
  type: string;
  label: string;
  url: string;
  [key: string]: any;
}

interface LinksProps {
  onBack?: () => void;
  onSuccess?: () => void;
  initialData?: LinkRecord;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram size={18} color="#E4405F" />,
  facebook: <Facebook size={18} color="#1877F2" />,
  x: <Twitter size={18} color="#000000" />,
  tiktok: <Music2 size={18} color="#000000" />,
  youtube: <Youtube size={18} color="#FF0000" />,
  linkedin: <LinkedinIcon size={18} color="#0A66C2" />,
  whatsapp: <MessageCircle size={18} color="#25D366" />,
  github: <Github size={18} color="#181717" />,
  website: <Globe size={18} color="#6B7280" />,
};

const LinksForm: React.FC<LinksProps> = ({ onBack, onSuccess, initialData }) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addLink, updateLink, loading } = useJobProfileApi();

  // Initial state for single item
  const emptyLink: LinksFormData = {
    type: '',
    label: '',
    url: ''
  };

  // State to manage multiple items (only for add mode)
  const [items, setItems] = useState<LinksFormData[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<number, Record<string, string>>>({});

  // Populate form when initialData changes or initialization
  useEffect(() => {
    if (initialData) {
      setItems([{
        type: initialData.type,
        label: initialData.label,
        url: initialData.url,
      }]);
    } else {
      setItems([emptyLink]);
    }
  }, [initialData]);

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
    setItems(prev => [...prev, { ...emptyLink }]);
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
      if (!item.type) errors.type = t('errors.required');
      if (!item.label) errors.label = t('errors.required');
      if (!item.url) errors.url = t('errors.required');

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
        await updateLink(initialData.id, payload, { showMessage: true });
      } else {
        // Add mode - multiple items
        const payload = { items };
        await addLink(payload, { showMessage: true });
      }


      if (onSuccess) onSuccess();
      if (onBack) onBack();

    } catch (error) {
      console.error('Failed to save link:', error);
    }
  };

  const handleCancel = () => {
    if (onBack) onBack();
  };


  // Map platform options with icons
  const platformOptions = getPlatformOptions(t).map(option => ({
    ...option,
    icon: PLATFORM_ICONS[option.id] || PLATFORM_ICONS.website
  }));

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
                title={t('common.remove')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="w-full bg-[#FCFCFC] rounded-[20px] p-6 relative overflow-hidden border border-gray-100">
              <div className="flex flex-col gap-4">
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                  <SelectField
                    id={`type_${index}`}
                    label={t('jobs.userProfile.links.platform')}
                    value={item.type}
                    onChange={(val) => handleItemChange(index, 'type', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.type}
                    selectorOptions={platformOptions}
                    placeholder={t('jobs.userProfile.links.platformPlaceholder')}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                    renderOption={(option) => (
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span>{option.name}</span>
                      </div>
                    )}
                  />

                  <InputField
                    id={`label_${index}`}
                    type="text"
                    label={t('jobs.userProfile.links.title')}
                    value={item.label}
                    onChange={(val) => handleItemChange(index, 'label', val)}
                    formErrors={fieldErrors[index] || {}}
                    error={fieldErrors[index]?.label}
                    placeholder={t('jobs.userProfile.links.labelPlaceholder')}
                    withFieldset
                    required
                    isSubmited={isSubmitted}
                  />
                </div>

                <InputField
                  id={`url_${index}`}
                  type="text"
                  label={t('jobs.userProfile.links.link')}
                  value={item.url}
                  onChange={(val) => handleItemChange(index, 'url', val)}
                  formErrors={fieldErrors[index] || {}}
                  error={fieldErrors[index]?.url}
                  placeholder={t('jobs.userProfile.links.urlPlaceholder')}
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
            {t('jobs.userProfile.links.addMore')}
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
          {loading ? t('common.confirming') : t('common.confirm')}
        </Button>
        <Button
          className="px-6 py-2 text-blueSite underline underline-offset-2 text-[20px]"
          unstyled
          onClick={handleCancel}
        >
          {t('common.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default LinksForm;

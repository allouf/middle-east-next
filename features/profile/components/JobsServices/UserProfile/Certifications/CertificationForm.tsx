import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import useFormData from '@/lib/Hooks/useFormData';
import GlowLight from '@/components/shered/GlowLight';
import { CiCirclePlus } from 'react-icons/ci';
import useJobProfileApi from '../useJobProfileApi';
import { CertificationRecord } from './certification';
import { Trash2 } from 'lucide-react';

interface CertificationFormData {
    name: string;
    issuer: string;
    issue_date: string;
    expiration_date: string | null;
    credential_url: string | null;
    [key: string]: any;
}

interface CertificationFormProps {
    onBack?: () => void;
    onSuccess?: () => void;
    initialData?: CertificationRecord;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ onBack, onSuccess, initialData }) => {
    const { t } = useTranslation();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { addCertification, updateCertification, loading } = useJobProfileApi();

    // Initial state for single item
    const emptyCertification: CertificationFormData = {
        name: '',
        issuer: '',
        issue_date: '',
        expiration_date: null,
        credential_url: null
    };

    // State to manage multiple items (only for add mode)
    const [items, setItems] = useState<CertificationFormData[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<number, Record<string, string>>>({});

    // Populate form when initialData changes or initialization
    useEffect(() => {
        if (initialData) {
            setItems([{
                name: initialData.name || '',
                issuer: initialData.issuer || '',
                issue_date: formatDateForInput(initialData.issue_date),
                expiration_date: formatDateForInput(initialData.expiration_date),
                credential_url: initialData.credential_url || null
            }]);
        } else {
            setItems([emptyCertification]);
        }
    }, [initialData]);

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
        setItems(prev => [...prev, { ...emptyCertification }]);
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
            if (!item.name) errors.name = t('errors.required');
            if (!item.issuer) errors.issuer = t('errors.required');
            if (!item.issue_date) errors.issue_date = t('errors.required');

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
                await updateCertification(initialData.id, payload, { showMessage: true });
            } else {
                // Add mode - multiple items
                const payload = { items };
                await addCertification(payload, { showMessage: true });
            }

            if (onSuccess) {
                
                onSuccess()
            }
            if (onBack) {
                
                onBack()
            }
        } catch (error) {
            console.error('Failed to save certification:', error);
        }
    };

    const handleCancel = () => {
        if (onBack) onBack();
    };

    return (
        <div className='pb-5'>

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
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <InputField
                                        id={`name_${index}`}
                                        type="text"
                                        label={t('jobs.userProfile.certifications.name')}
                                        value={item.name}
                                        onChange={(val) => handleItemChange(index, 'name', val)}
                                        formErrors={fieldErrors[index] || {}}
                                        error={fieldErrors[index]?.name}
                                        placeholder={t('jobs.userProfile.certifications.namePlaceholder')}
                                        withFieldset
                                        required
                                        isSubmited={isSubmitted}
                                    />

                                    <InputField
                                        id={`issuer_${index}`}
                                        type="text"
                                        label={t('jobs.userProfile.certifications.issuer')}
                                        value={item.issuer}
                                        onChange={(val) => handleItemChange(index, 'issuer', val)}
                                        formErrors={fieldErrors[index] || {}}
                                        error={fieldErrors[index]?.issuer}
                                        placeholder={t('jobs.userProfile.certifications.issuerPlaceholder')}
                                        withFieldset
                                        required
                                        isSubmited={isSubmitted}
                                    />
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <InputField
                                        id={`issue_date_${index}`}
                                        type="datetime-local"
                                        label={t('jobs.userProfile.certifications.issueDate')}
                                        value={item.issue_date}
                                        onChange={(val) => handleItemChange(index, 'issue_date', val)}
                                        formErrors={fieldErrors[index] || {}}
                                        error={fieldErrors[index]?.issue_date}
                                        placeholder={t('jobs.userProfile.certifications.issueDatePlaceholder')}
                                        withFieldset
                                        required
                                        isSubmited={isSubmitted}
                                        isPassDate={true}
                                        isFeatureDate={false}
                                    />

                                    <InputField
                                        id={`expiration_date_${index}`}
                                        type="datetime-local"
                                        label={t('jobs.userProfile.certifications.expirationDate')}
                                        value={item.expiration_date ?? ''}
                                        onChange={(val) => handleItemChange(index, 'expiration_date', val)}
                                        formErrors={fieldErrors[index] || {}}
                                        error={fieldErrors[index]?.expiration_date}
                                        placeholder={t('jobs.userProfile.certifications.expirationDatePlaceholder')}
                                        withFieldset
                                        isSubmited={isSubmitted}
                                    // isPassDate={true}
                                    />
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
                                    <InputField
                                        id={`credential_url_${index}`}
                                        type="text"
                                        label={t('jobs.userProfile.certifications.url')}
                                        value={item.credential_url ?? ''}
                                        onChange={(val) => handleItemChange(index, 'credential_url', val)}
                                        formErrors={fieldErrors[index] || {}}
                                        error={fieldErrors[index]?.credential_url}
                                        placeholder={t('jobs.userProfile.certifications.urlPlaceholder')}
                                        withFieldset
                                        isSubmited={isSubmitted}
                                    />
                                </div>
                            </div>

                            <GlowLight
                                color="#06B187"
                                size="w-[55px]  h-[40px]"
                                opacity="opacity-80"
                                blur="blur-[35px] sm:blur-[35px]"
                                position="top-0 right-0"
                            />
                            <GlowLight
                                color="#06B187"
                                size="w-[50px]  h-[40px]"
                                opacity="opacity-80"
                                blur="blur-[35px] sm:blur-[35px]"
                                position="bottom-0 left-0"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {!initialData && (
                <div>
                    <Button
                        unstyled
                        onClick={handleAddMore}
                        className='text-blueSite flex flex-row items-center gap-2 text-[20px] py-1 hover:opacity-80 transition-opacity'
                    >
                        <CiCirclePlus className="w-5 h-5" />
                        {t('jobs.userProfile.certifications.addMore')}
                    </Button>
                </div>
            )}

            <div className="flex gap-4 pt-4">
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

export default CertificationForm;

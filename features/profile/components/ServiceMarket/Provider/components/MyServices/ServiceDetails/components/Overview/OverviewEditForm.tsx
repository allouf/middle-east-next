import React from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import SelectFiled from '@/components/ui/SelectFiled';
import Button from '@/components/ui/Button';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface OverviewEditFormProps {
    formData: {
        title: string;
        service_category_id: string;
        type: string;
        delivery_model: string;
        description: string;
    };
    serviceTypeOptions: Array<{ label: string; value: string }>;
    deliveryModelOptions: Array<{ label: string; value: string }>;
    handleChange: (field: string) => (e: any) => void;
    onSave: () => void;
    onCancel: () => void;
    isSubmited: boolean;
    loading?: boolean;
}

const OverviewEditForm = ({
    formData,
    serviceTypeOptions,
    deliveryModelOptions,
    handleChange,
    onSave,
    isSubmited,
    onCancel,
    loading = false
}: OverviewEditFormProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.1fr]">
                <div className="space-y-5">
                    <InputField
                        id="title"
                        label={t('serviceMarket.myServices.basicInfo.title')}
                        placeholder={t('serviceMarket.myServices.basicInfo.titlePlaceholder')}
                        value={formData.title}
                        onChange={handleChange("title")}
                        withFieldset
                        validate
                        required
                        isSubmited={isSubmited}
                    />

                    <SelectFiled
                        id="category"
                        label={t('serviceMarket.myServices.basicInfo.category')}
                        onChange={handleChange("service_category_id")}
                        value={formData.service_category_id || null}
                        url="/service-categories"
                        placeholder={t('serviceMarket.myServices.basicInfo.categoryPlaceholder')}
                        withFieldset
                        validate
                        required
                        isSubmited={isSubmited}
                    />

                    <SelectFiled
                        id="serviceType"
                        label={t('serviceMarket.myServices.basicInfo.serviceType')}
                        onChange={handleChange("type")}
                        value={formData.type || null}
                        selectorOptions={serviceTypeOptions.map(opt => ({ id: opt.value, name: opt.label }))}
                        placeholder={t('serviceMarket.myServices.basicInfo.serviceTypePlaceholder')}
                        withFieldset
                        validate
                        required
                        isSubmited={isSubmited}
                    />

                    <SelectFiled
                        id="deliveryModel"
                        label={t('serviceMarket.myServices.basicInfo.deliveryModel')}
                        onChange={handleChange("delivery_model")}
                        value={formData.delivery_model || null}
                        selectorOptions={deliveryModelOptions.map(opt => ({ id: opt.value, name: opt.label }))}
                        placeholder={t('serviceMarket.myServices.basicInfo.deliveryModelPlaceholder')}
                        withFieldset
                        validate
                        required
                        isSubmited={isSubmited}

                    />
                </div>

                <div>
                    <InputField
                        id="description"
                        label={t('serviceMarket.myServices.basicInfo.serviceDescription')}
                        placeholder={t('serviceMarket.myServices.basicInfo.descriptionPlaceholder')}
                        value={formData.description}
                        onChange={handleChange("description")}
                        type="textarea"
                        rows={18}
                        withFieldset
                        validate
                        required
                        isSubmited={isSubmited}

                    />
                </div>
            </div>

            <div className="flex gap-4 items-center">
                <Button
                    onClick={onSave}
                    unstyled
                    disabled={loading}
                    className="bg-blueSite hover:bg-blueSiteHover text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                        <Save size={16} className="mr-2" />
                    )}
                    {loading ? t('common.saving') : t('common.saveChanges')}
                </Button>
                <Button
                    onClick={onCancel}
                    unstyled
                    className="text-red-600 hover:text-red-700 underline font-medium flex items-center p-2"
                >
                    <X size={16} className="mr-2" />
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default OverviewEditForm;

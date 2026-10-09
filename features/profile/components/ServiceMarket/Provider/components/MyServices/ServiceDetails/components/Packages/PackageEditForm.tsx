import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectFiled';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { ChangeInput } from '@/lib/Hooks/useFormData';
import { getCurrencyOptions } from '@/features/profile/components/ServiceMarket/Provider/helpers/currencyHelper';

interface PackageData {
    title: string;
    price: string;
    currency: string;
    delivery_time_value: string;
    delivery_time_unit: string;
    revision_window: string;
    revision_scope_rules: string;
    number_of_revisions: string;
}

interface PackageEditFormProps {
    packageData: PackageData;
    editingIndex?: number | null;
    isSubmitted:boolean;
    loading?: boolean;
    onPackageChange: (pkg: PackageData) => void;
    onAdd?: () => void;
    onUpdate?: () => void;
    onCancel: () => void;
}

const PackageEditForm = ({
    packageData,
    editingIndex,
    isSubmitted,
    loading = false,
    onPackageChange,
    onAdd,
    onUpdate,
    onCancel
}: PackageEditFormProps) => {
    const { t } = useTranslation();

    const deliveryTimeUnits = [
        { id: "minutes", label: t("time.minutes") },
        { id: "hours", label: t("time.hours") },
        { id: "days", label: t("time.days") },
    ];

    const currencies = getCurrencyOptions(t);

    const updatePackageField = (key: keyof PackageData, value: ChangeInput) => {
        // Extract string value from ChangeInput
        const stringValue = typeof value === 'string' ? value :
            value && typeof value === 'object' && 'target' in value ?
                (value as any).target.value :
                String(value || '');

        onPackageChange({ ...packageData, [key]: stringValue });
    };

    return (
        <div className="relative overflow-hidden rounded-[22px] space-y-4 border border-[#DDE3E7] bg-[#FCFCFD] p-5 md:p-6">
            <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[0_0_90px_rgba(53,208,182,0.12)_inset]" />

            <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.05fr]">
                <div className="space-y-5">
                    <InputField
                        id={`packageTitle-${editingIndex !== null ? editingIndex : 'new'}`}
                        label={t("serviceMarket.myServices.plans.planTitle")}
                        placeholder={t("serviceMarket.myServices.plans.planTitlePlaceholder")}
                        value={packageData.title}
                        onChange={(value) => updatePackageField('title', value)}
                        withFieldset
                        validate
                        required
                        isSubmited={isSubmitted}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            id={`price-${editingIndex !== null ? editingIndex : 'new'}`}
                            label={t("serviceMarket.myServices.plans.price")}
                            placeholder="0.00"
                            value={packageData.price}
                            onChange={(value) => updatePackageField('price', value)}
                            type="number"
                            withFieldset
                            validate
                            required
                            isSubmited={isSubmitted}
                        />

                        <SelectField
                            id={`currency-${editingIndex !== null ? editingIndex : 'new'}`}
                            label={t("serviceMarket.myServices.plans.currency")}
                            value={packageData.currency}
                            onChange={(value) => updatePackageField('currency', value)}
                            placeholder={t("serviceMarket.myServices.plans.currencyPlaceholder")}
                            selectorOptions={currencies}
                            labelName="label"
                            withFieldset
                            validate
                            required
                            isSubmited={isSubmitted}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            id={`deliveryTime-${editingIndex !== null ? editingIndex : 'new'}`}
                            label={t("serviceMarket.myServices.plans.deliveryTime")}
                            placeholder="1"
                            value={packageData.delivery_time_value}
                            onChange={(value) => updatePackageField('delivery_time_value', value)}
                            type="numric"
                            withFieldset
                            validate
                            required
                            isSubmited={isSubmitted}
                        />

                        <SelectField
                            id={`deliveryTimeUnit-${editingIndex !== null ? editingIndex : 'new'}`}
                            label={t("serviceMarket.myServices.plans.deliveryTimeUnit")}
                            placeholder={t("serviceMarket.myServices.plans.deliveryTimeUnitPlaceholder")}
                            value={packageData.delivery_time_unit}
                            onChange={(value) => updatePackageField('delivery_time_unit', value)}
                            selectorOptions={deliveryTimeUnits}
                            labelName="label"
                            withFieldset
                            validate
                            required
                            isSubmited={isSubmitted}
                        />
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            id={`revisions-${editingIndex !== null ? editingIndex : 'new'}`}
                            label={t("serviceMarket.myServices.plans.numberOfRevisions")}
                            placeholder="3"
                            value={packageData.number_of_revisions}
                            onChange={(value) => updatePackageField('number_of_revisions', value)}
                            type="numric"
                            withFieldset
                            validate
                            required
                            isSubmited={isSubmitted}
                        />

                        <InputField
                            id={`revisionWindow-${editingIndex !== null ? editingIndex : 'new'}`}
                            label={t("serviceMarket.myServices.plans.revisionWindow")}
                            placeholder="7"
                            value={packageData.revision_window}
                            onChange={(value) => updatePackageField('revision_window', value)}
                            type="numric"
                            withFieldset
                            validate
                            required
                            isSubmited={isSubmitted}
                        />
                    </div>

                    <InputField
                        id={`revisionRules-${editingIndex !== null ? editingIndex : 'new'}`}
                        label={t("serviceMarket.myServices.plans.revisionScopeRules")}
                        placeholder={t("serviceMarket.myServices.plans.revisionScopeRulesPlaceholder")}
                        value={packageData.revision_scope_rules}
                        onChange={(value) => updatePackageField('revision_scope_rules', value)}
                        type="textarea"
                        rows={4}
                        withFieldset
                        validate
                        required
                        isSubmited={isSubmitted}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-textColor border border-[#DDE3E7] bg-white rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t("common.cancel")}
                </button>
                <button
                    onClick={editingIndex !== null ? onUpdate : onAdd}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#00664F] rounded-lg hover:bg-[#005543] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {loading ? t("common.saving") : (editingIndex !== null ? t("common.update") : t("serviceMarket.myServices.plans.addPackage"))}
                </button>
            </div>
        </div>
    );
};

export default PackageEditForm;

"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import PackageEditForm from './PackageEditForm';

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

interface PackageFormProps {
    packageData: PackageData;
    editingIndex: number | null;
    title: string;
    isSubmitted:boolean;
    loading?: boolean;
    onPackageChange: (pkg: PackageData) => void;
    onSave: () => void;
    onCancel: () => void;
    onUpdate?: () => void;
}

const PackageForm: React.FC<PackageFormProps> = ({
    packageData,
    editingIndex,
    title,
    isSubmitted,
    loading = false,
    onPackageChange,
    onSave,
    onCancel,
    onUpdate,
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#353635] mb-4">
                {title}
            </h3>
            <PackageEditForm
                packageData={packageData}
                editingIndex={editingIndex}
                isSubmitted={isSubmitted}
                loading={loading}
                onPackageChange={onPackageChange}
                onAdd={editingIndex === null ? onSave : undefined}
                onUpdate={editingIndex !== null ? onUpdate : undefined}
                onCancel={onCancel}
            />
        </div>
    );
};

export default PackageForm;

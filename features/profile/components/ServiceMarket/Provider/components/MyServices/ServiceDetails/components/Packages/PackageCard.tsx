"use client";

import React, { useState } from 'react';
import { Clock, RotateCcw, FileText, Edit3 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Button from '@/components/ui/Button';
import CustomConfirmModal from '@/components/shered/CustomConfirmModal';
import { formatCurrency } from '@/features/profile/components/ServiceMarket/Provider/helpers/currencyHelper';

interface Package {
    id: string;
    title: string;
    price: string;
    currency: string;
    delivery_time_value: string;
    delivery_time_unit: string;
    revision_window: string;
    revision_scope_rules: string;
    number_of_revisions: string;
}

interface PackageCardProps {
    package: Package;
    index: number;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
    package: pkg,
    index,
    onEdit,
    onDelete,
}) => {
    const { t } = useTranslation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <div className=" bg-white p-6 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[#353635]">{pkg.title}</h3>
                <span className="text-2xl font-bold text-[#00664F]">
                    {formatCurrency(t, pkg.currency)} {pkg.price}
                </span>
            </div>

            <p className="text-[#353635]/80 text-sm leading-relaxed mb-6">
                {pkg.revision_scope_rules || t("serviceMarket.myServices.plans.noDescription")}
            </p>

            <div className="space-y-3 mb-6">
                {[
                    {
                        icon: Clock,
                        label: t("serviceMarket.myServices.plans.deliveryTime"),
                        value: t("serviceMarket.myServices.plans.deliveryTimeValue", {
                            value: pkg.delivery_time_value,
                            unit: t(`time.${pkg.delivery_time_unit}`)
                        })
                    },
                    {
                        icon: RotateCcw,
                        label: t("serviceMarket.myServices.plans.revisions"),
                        value: t("serviceMarket.myServices.plans.revisionsIncluded", { count: pkg.number_of_revisions })
                    },
                    {
                        icon: FileText,
                        label: t("serviceMarket.myServices.plans.revisionWindow"),
                        value: t("serviceMarket.myServices.plans.modificationWindow", { count: pkg.revision_window })
                    },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#353635]">
                        <item.icon className="w-4 h-4 text-[#00664F]" />
                        <span>{item.value}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4 ">
                <Button
                    onClick={() => onEdit(index)}
                    unstyled
                    className="px-4 py-2 bg-blueSite font-medium rounded-md text-white"
                >
                    <div className="flex items-center gap-2">
                        <Edit3 size={16} />
                        {t("serviceMarket.myServices.details.tabs.packages.editPackage")}
                    </div>
                </Button>
                <Button
                    onClick={() => setShowDeleteModal(true)}
                    unstyled
                    className="text-red-500 hover:text-red-600 underline font-medium"
                >
                    {t("serviceMarket.myServices.details.tabs.packages.deletePackage")}
                </Button>
            </div>
            
            <CustomConfirmModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title={t("serviceMarket.myServices.details.tabs.packages.deletePackage")}
                subtitle={t("serviceMarket.myServices.details.tabs.packages.deleteConfirm", { packageName: pkg.title })}
                type="danger"
                confirmText={t("serviceMarket.myServices.details.tabs.packages.delete")}
                cancelText={t("common.cancel")}
                onConfirm={() => onDelete(index)}
            />
        </div>
    );
};

export default PackageCard;

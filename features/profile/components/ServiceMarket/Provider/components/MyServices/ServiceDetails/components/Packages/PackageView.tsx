import React from 'react';
import { Edit3, Plus, Clock, RotateCcw, FileText } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import HeaderButton from '../Shared/HeaderButton';
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

interface PackageViewProps {
    packages: Package[];
    onEdit: (index: number) => void;
    onAdd: () => void;
    onDelete: (index: number) => void;
}

const PackageView = ({ packages, onEdit, onAdd, onDelete }: PackageViewProps) => {
    const { t } = useTranslation();

    if (packages.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {t("serviceMarket.myServices.plans.noPackages")}
                </h3>
                <p className="text-gray-500 mb-6">
                    {t("serviceMarket.myServices.plans.addFirstPackage")}
                </p>
                <button
                    onClick={onAdd}
                    className="px-6 py-3 bg-[#00664F] text-white rounded-lg hover:bg-[#005543] transition-colors flex items-center gap-2 mx-auto"
                >
                    <Plus size={16} />
                    {t("serviceMarket.myServices.plans.addFirstPackage")}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {packages.map((pkg, index) => (
                <div key={pkg.id} className="border border-[#E9E9E9] rounded-xl bg-white p-6 hover:shadow-sm transition-shadow">
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
                            { icon: Clock, label: t("serviceMarket.myServices.plans.deliveryTime"), value: `${pkg.delivery_time_value} ${t(`time.${pkg.delivery_time_unit}`)}` },
                            { icon: RotateCcw, label: t("serviceMarket.myServices.plans.revisions"), value: t("serviceMarket.myServices.plans.numberOfRevisions", { count: pkg.number_of_revisions }) },
                            { icon: FileText, label: t("serviceMarket.myServices.plans.revisionWindow"), value: t("serviceMarket.myServices.plans.revisionWindowDays", { count: pkg.revision_window }) },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-[#353635]">
                                <item.icon className="w-4 h-4 text-[#00664F]" />
                                <span>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <HeaderButton 
                            icon={<Edit3 size={16} />} 
                            text={t("serviceMarket.myServices.details.tabs.packages.editPackage")} 
                            variant="default" 
                            onClick={() => onEdit(index)} 
                        />
                        <button 
                            onClick={() => onDelete(index)}
                            className="text-[#BF2033] text-sm font-semibold hover:underline"
                        >
                            {t("serviceMarket.myServices.details.tabs.packages.deletePackage")}
                        </button>
                    </div>
                </div>
            ))}
            
            <div className="text-center mt-6">
                <button
                    onClick={onAdd}
                    className="px-6 py-3 border border-[#00664F50] text-[#00664F] rounded-lg hover:bg-[#00664F10] transition-colors flex items-center gap-2 mx-auto"
                >
                    <Plus size={16} />
                    {t("serviceMarket.myServices.plans.addPackage")}
                </button>
            </div>
        </div>
    );
};

export default PackageView;

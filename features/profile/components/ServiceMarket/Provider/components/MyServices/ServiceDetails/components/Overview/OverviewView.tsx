import React from 'react';
import { Layers, Briefcase, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import InfoCard from './InfoCard';
import ExpandableText from '../ExpandableText';
import { ServiceOffer } from '../../../../../types/provider.types';

interface OverviewViewProps {
    offer: ServiceOffer;
    onEdit: () => void;
}

const OverviewView = ({ offer, onEdit }: OverviewViewProps) => {
    const { t } = useTranslation();
    const description = offer.description || t("serviceMarket.myServices.details.tabs.overview.noDescription");

    return (
        <div className="space-y-6">
            {/* Overview Header with Edit Button */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#353635]">
                    {t("serviceMarket.myServices.details.tabs.overview.basicInformation")}
                </h3>
            </div>

            <div>
                <ExpandableText
                    text={description}
                    maxLength={200}
                    className="text-[#353635] leading-relaxed text-[15px]"
                    as="p"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Card */}
                <InfoCard
                    icon={Layers}
                    label={t("serviceMarket.myServices.details.tabs.overview.category")}
                    value={offer.service_category?.name || ""}
                    onEdit={onEdit}
                    formatValue={false}
                />

                {/* Service Type Card */}
                <InfoCard
                    icon={Briefcase}
                    label={t("serviceMarket.myServices.details.tabs.overview.serviceType")}
                    value={t(`serviceMarket.myServices.serviceTypes.${offer.type || ''}`)}
                    onEdit={onEdit}
                />

                {/* Service Model Card */}
                <InfoCard
                    icon={MapPin}
                    label={t("serviceMarket.myServices.details.tabs.overview.serviceModel")}
                    value={t(`serviceMarket.myServices.deliveryTypes.${offer.delivery_model?.replace(/_/g, '') || ''}`)}
                    onEdit={onEdit}
                />
            </div>
        </div>
    );
};

export default OverviewView;

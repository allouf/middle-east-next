import React from "react";
import { FolderOpen, WalletCards, Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "./Card";
import InfoItem from "./InfoItem";

interface RequestSummaryCardProps {
  category: string;
  title: string;
  serviceType: string;
  deliveryModel: string;
  estimatedDelivery: string;
}

export default function RequestSummaryCard({
  category,
  title,
  serviceType,
  deliveryModel,
  estimatedDelivery,
}: RequestSummaryCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <div className="p-5 md:p-6">
        <span className="rounded-full bg-[#EAF6F1] px-3 py-1 text-xs font-semibold text-[#0B6B57]">
          {category}
        </span>

        <h2 className="mt-4 max-w-[700px] text-[22px] font-bold leading-tight text-[#1F2937] md:text-[24px]">
          {title}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#EEF2F0] bg-[#FBFCFC] px-5 py-4 md:px-6">
        <InfoItem
          icon={<FolderOpen className="h-4 w-4" />}
          label={t('serviceMarket.rfq.orderDetails.serviceType')}
          value={serviceType}
        />
        <InfoItem
          icon={<WalletCards className="h-4 w-4" />}
          label={t('serviceMarket.rfq.orderDetails.deliveryModel')}
          value={deliveryModel}
        />
        <InfoItem
          icon={<Clock3 className="h-4 w-4" />}
          label={t('serviceMarket.rfq.orderDetails.estimatedDelivery')}
          value={estimatedDelivery}
        />
      </div>
    </Card>
  );
}

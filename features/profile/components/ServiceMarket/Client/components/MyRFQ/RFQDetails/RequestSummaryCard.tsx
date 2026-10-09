import React from "react";
import Image from "next/image";
import { FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RequestDetail } from "../../../types/Rfq";
import InfoItem from "./InfoItem";
import SectionCard from "./SectionCard";

interface RequestSummaryCardProps {
  requestDetail?: RequestDetail | null;
}

const RequestSummaryCard = ({ requestDetail }: RequestSummaryCardProps) => {
  const { t } = useTranslation();

  return (
    <SectionCard className="overflow-hidden">
      <div className="p-5 md:p-6">
        <span className="inline-flex rounded-full bg-[#15803D1A] px-3 py-1 text-xs font-semibold text-[#15803D]">
          {requestDetail?.category?.name || t('serviceMarket.rfq.details.summary.loading')}
        </span>

        <h2 className="mt-4 max-w-[700px] text-[24px] font-bold leading-tight text-[#1F2937]">
          {requestDetail?.title || t('serviceMarket.rfq.details.summary.loading')}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#E2E8F0] bg-[#F4F4F4] px-5 py-4 md:px-6">
        <InfoItem
          icon={<FolderOpen className="h-4 w-4" />}
          label={t('serviceMarket.rfq.details.summary.deliveryModel')}
          value={requestDetail?.delivery_model || t('serviceMarket.rfq.details.summary.notAvailable')}
        />
        <InfoItem
          icon={<Image src="/Timer.svg" alt="Timer" width={16} height={16} />}
          label={t('serviceMarket.rfq.details.summary.deadline')}
          value={requestDetail?.deadline_date || t('serviceMarket.rfq.details.summary.notAvailable')}
        />
        <InfoItem
          icon={<Image src="/Wallet.svg" alt="Wallet" width={16} height={16} />}
          label={t('serviceMarket.rfq.details.summary.budget')}
          value={`${requestDetail?.budget_min || 0}$ - ${requestDetail?.budget_max || 0}$`}
        />
      </div>
    </SectionCard>
  );
};

export default RequestSummaryCard;
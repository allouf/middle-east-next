import React from "react";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface OrderHeaderProps {
  requestId: string;
  status: string;
  purchasedDate: string;
  onMessageProvider?: () => void;
}

export default function OrderHeader({ 
  requestId, 
  status, 
  purchasedDate, 
  onMessageProvider 
}: OrderHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="h-8 w-[5px] rounded-full bg-[#0B6B57]" />
          <h1 className="text-[22px] font-bold text-[#1F2937] md:text-[38px]">
            {t('serviceMarket.rfq.orderDetails.requestTitle', { requestId })}
          </h1>

          <span className="rounded-full bg-[#FFF3DC] px-3 py-1 text-xs font-semibold text-[#D98C00]">
            {status}
          </span>
        </div>

        <p className="text-[15px] text-[#667085]">
          {t('serviceMarket.rfq.orderDetails.purchasedOn')}{" "}
          <span className="font-semibold text-[#344054]">{purchasedDate}</span>.
        </p>
      </div>

      <button
        type="button"
        onClick={onMessageProvider}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B6B57] px-4 text-sm font-semibold text-white"
      >
        <MessageCircle className="h-4 w-4" />
        {t('serviceMarket.rfq.orderDetails.messageProvider')}
      </button>
    </div>
  );
}

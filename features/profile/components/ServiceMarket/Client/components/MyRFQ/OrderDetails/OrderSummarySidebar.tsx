import React from "react";
import { WalletCards, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "./Card";
import SoftIcon from "./SoftIcon";

interface OrderSummarySidebarProps {
  servicePrice: string;
  vat: string;
  fees: string;
  totalAmount: string;
  paymentStatus: string;
  statusColor?: string;
}

export default function OrderSummarySidebar({
  servicePrice,
  vat,
  fees,
  totalAmount,
  paymentStatus,
  statusColor = "border-[#AEE5BE] bg-[#EAFBF0] text-[#22A447]",
}: OrderSummarySidebarProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#EEF2F0] bg-[#F8FAF9] px-5 py-4">
        <div className="flex items-center gap-3">
          <SoftIcon className="h-9 w-9">
            <WalletCards className="h-4 w-4" />
          </SoftIcon>
          <h3 className="text-[18px] font-bold text-[#1F2937]">
            {t('serviceMarket.rfq.orderDetails.orderSummary')}
          </h3>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#0B6B57] text-[#0B6B57]"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 px-5 py-5 text-sm">
        <div className="flex items-center justify-between text-[#667085]">
          <span>{t('serviceMarket.rfq.orderDetails.servicePrice')}</span>
          <span className="font-semibold text-[#344054]">{servicePrice}</span>
        </div>

        <div className="flex items-center justify-between text-[#667085]">
          <span>{t('serviceMarket.rfq.orderDetails.vat')}</span>
          <span className="font-semibold text-[#344054]">{vat}</span>
        </div>

        <div className="flex items-center justify-between text-[#667085]">
          <span>{t('serviceMarket.rfq.orderDetails.fees')}</span>
          <span className="font-semibold text-[#344054]">{fees}</span>
        </div>

        <div className="border-t border-[#EEF2F0] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-bold text-[#1F2937]">
              {t('serviceMarket.rfq.orderDetails.totalAmount')}
            </span>
            <span className="text-[30px] font-bold leading-none text-[#159947]">
              {totalAmount}
            </span>
          </div>
        </div>

        <div className={`rounded-xl border ${statusColor} px-4 py-3 text-center text-sm font-bold`}>
          {paymentStatus}
        </div>

        <p className="text-center text-xs leading-5 text-[#98A2B3]">
          {t('serviceMarket.rfq.orderDetails.escrowProtection')}
        </p>
      </div>
    </Card>
  );
}

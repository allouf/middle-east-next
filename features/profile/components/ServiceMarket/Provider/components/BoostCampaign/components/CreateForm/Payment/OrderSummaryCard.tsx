import React from "react";
import {
  WalletCards,
  ArrowRight,
  LockKeyhole,
  CircleAlert,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface OrderSummaryCardProps {
  servicePrice: string;
  vat: string;
  fees: string;
  totalAmount: string;
  paymentStatus: string;
  onConfirm?: () => void;
}

export default function OrderSummaryCard({
  servicePrice,
  vat,
  fees,
  totalAmount,
  paymentStatus,
  onConfirm,
}: OrderSummaryCardProps) {
  const { t } = useTranslation();

  const textBase = "text-[12px] font-medium text-textGrayColor sm:text-[13px]";
  const textBold = "text-[12px] font-bold text-textColor sm:text-[13px]";

  return (
    <div className="w-full overflow-hidden rounded-[16px] border border-grayBorder bg-bgWhite shadow-[0_4px_12px_rgba(16,24,40,0.06)]">
      {/* Header */}
      <div className="flex items-center gap-2 bg-bgOffWhite px-3 py-3 sm:px-4 sm:py-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl text-[#7A8CA5] sm:h-8 sm:w-8">
          <WalletCards className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>

        <h3 className="text-[14px] font-bold text-textColor sm:text-[15px]">
          {t("serviceMarket.boostCampaign.payment.orderSummary", { defaultValue: "Order Summary" })}
        </h3>
      </div>

      {/* Content */}
      <div className="px-3 py-4 sm:px-4 sm:py-4">
        <div className="space-y-3 sm:space-y-3">
          <div className="flex justify-between">
            <span className={textBase}>
              {t("serviceMarket.boostCampaign.payment.servicePrice", { defaultValue: "Service Price" })}
            </span>
            <span className={textBold}>{servicePrice}</span>
          </div>

          <div className="flex justify-between">
            <span className={textBase}>
              {t("serviceMarket.boostCampaign.payment.vat", { defaultValue: "VAT" })}
            </span>
            <span className={textBold}>{vat}</span>
          </div>

          <div className="flex justify-between">
            <span className={textBase}>
              {t("serviceMarket.boostCampaign.payment.fees", { defaultValue: "Fees" })}
            </span>
            <span className={textBold}>{fees}</span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 border-t border-grayBorder pt-3 sm:mt-4 sm:pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-textColor sm:text-[14px]">
              {t("serviceMarket.boostCampaign.payment.totalAmount", { defaultValue: "Total Amount" })}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[16px] font-extrabold text-[#159947] sm:text-[18px]">
                {totalAmount}
              </span>
              <LockKeyhole className="h-3.5 w-3.5 text-[#159947]" />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 sm:mt-4">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-[11px] font-bold uppercase text-[#B45309] sm:text-[12px]">
            <span>{paymentStatus}</span>
            <CircleAlert className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-bgOffWhite px-3 py-4 sm:px-4 sm:py-4">
        <button
          onClick={onConfirm}
          className="flex h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#15803D] text-[13px] font-bold text-white shadow-md sm:h-[48px] sm:text-[14px]"
        >
          {t("serviceMarket.boostCampaign.payment.confirmPayment", { defaultValue: "Confirm Payment" })}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        {/* Payment methods */}
        <div className="mt-3 flex flex-wrap justify-center gap-3 sm:mt-3">
          <span className="text-[12px] font-bold text-[#1D2B53] sm:text-[13px]">
            VISA
          </span>

          <div className="flex items-center">
            <span className="text-[#EA001B]">●</span>
            <span className="-ml-1 text-[#F79E1B]">●</span>
          </div>

          <span className={textBase}>G Pay</span>
        </div>

        {/* Terms */}
        <p className="mx-auto mt-3 max-w-[240px] text-center text-[11px] text-textGrayColor sm:text-[12px]">
          {t("serviceMarket.boostCampaign.payment.termsNote", {
            defaultValue: "By completing the payment, you agree to our",
          })}{" "}
          <span className="font-semibold underline">
            {t("serviceMarket.boostCampaign.payment.termsAndConditions", {
              defaultValue: "Terms and Conditions",
            })}
          </span>
        </p>
      </div>
    </div>
  );
}

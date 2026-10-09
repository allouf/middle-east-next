import React from "react";
import {
  WalletCards,
  ArrowRight,
  LockKeyhole,
  CircleAlert,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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

  const textBase =
    "text-[13px] font-medium text-textGrayColor sm:text-[14px] lg:text-[16px]";
  const textBold =
    "text-[13px] font-bold text-textColor sm:text-[14px] lg:text-[16px]";

  return (
    <div className="w-full overflow-hidden rounded-[20px] border border-grayBorder bg-bgWhite shadow-[0_8px_24px_rgba(16,24,40,0.06)] sm:rounded-[24px]">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-bgOffWhite px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#7A8CA5] sm:h-10 sm:w-10">
          <WalletCards className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>

        <h3 className="text-[16px] font-bold text-textColor sm:text-[18px] lg:text-[20px]">
          {t("serviceMarket.rfq.quotationPayment.orderSummary")}
        </h3>
      </div>

      {/* Content */}
      <div className="px-4 py-5 sm:px-5 sm:py-6 lg:px-6">
        <div className="space-y-4 sm:space-y-5">

          <div className="flex justify-between">
            <span className={textBase}>
              {t("serviceMarket.rfq.quotationPayment.servicePrice")}
            </span>
            <span className={textBold}>{servicePrice}</span>
          </div>

          <div className="flex justify-between">
            <span className={textBase}>
              {t("serviceMarket.rfq.quotationPayment.vat")}
            </span>
            <span className={textBold}>{vat}</span>
          </div>

          <div className="flex justify-between">
            <span className={textBase}>
              {t("serviceMarket.rfq.quotationPayment.fees")}
            </span>
            <span className={textBold}>{fees}</span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-5 border-t border-grayBorder pt-4 sm:mt-6 sm:pt-5">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-extrabold text-textColor sm:text-[16px] lg:text-[18px]">
              {t("serviceMarket.rfq.quotationPayment.totalAmount")}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[18px] font-extrabold text-[#159947] sm:text-[20px] lg:text-[22px]">
                {totalAmount}
              </span>
              <LockKeyhole className="h-4 w-4 text-[#159947]" />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-5 sm:mt-6">
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[13px] font-bold uppercase text-[#B45309] sm:text-[14px] lg:text-[15px]">
            <span>{paymentStatus}</span>
            <CircleAlert className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-bgOffWhite px-4 py-5 sm:px-5 sm:py-6 lg:px-6">
        <button
          onClick={onConfirm}
          className="flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#15803D] text-[14px] font-bold text-white shadow-md sm:h-[54px] sm:text-[15px] lg:h-[58px] lg:text-[16px]"
        >
          {t("serviceMarket.rfq.quotationPayment.confirmPayment")}
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Payment methods */}
        <div className="mt-5 flex flex-wrap justify-center gap-4 sm:mt-6">
          <span className="text-[13px] font-bold text-[#1D2B53] sm:text-[14px] lg:text-[16px]">
            VISA
          </span>

          <div className="flex items-center">
            <span className="text-[#EA001B]">●</span>
            <span className="-ml-1 text-[#F79E1B]">●</span>
          </div>

          <span className={textBase}>G Pay</span>
        </div>

        {/* Terms */}
        <p className="mx-auto mt-4 max-w-[280px] text-center text-[12px] text-textGrayColor sm:text-[13px] lg:text-[14px]">
          By completing the payment, you agree to our{" "}
          <span className="font-semibold underline">
            Terms and Conditions
          </span>
        </p>
      </div>
    </div>
  );
}
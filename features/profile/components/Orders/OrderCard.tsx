"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Button from "@/components/ui/Button";

type OrderCardProps = {
  id: string;
  statusKey: string;
  statusLabel: string;
  statusBg: string;
  statusText: string;
  statusBorder: string;
  itemsCount: string;
  placedAtLabel: string;
  expectedLabel: string;
  totalPriceLabel: string;
  isCancelable: boolean;
  onViewDetails: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
};

const OrderCard = ({
  id,
  statusKey,
  statusLabel,
  statusBg,
  statusText,
  statusBorder,
  itemsCount,
  placedAtLabel,
  expectedLabel,
  totalPriceLabel,
  isCancelable,
  onViewDetails,
  onCancelOrder,
}: OrderCardProps) => {
  const { t } = useTranslation();

  const handleAction = () => {
    if (isCancelable && onCancelOrder) {
      onCancelOrder(id);
    } else {
      onViewDetails(id);
    }
  };

  return (
    <div className="rounded-2xl bg-[#F9FBFA] p-4 sm:p-5 shadow-sm border border-[#E8EFEA] hover:shadow-md transition-shadow duration-200">
      {/* Header - Order ID and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-lg sm:text-xl font-semibold text-[#1B2E35]">
            #{id}
          </span>
          <span
            className={`text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border ${statusBg} ${statusText} ${statusBorder}`}
          >
            {statusLabel}
          </span>
        </div>
        
        {/* Action Button - Mobile First */}
        <div className="sm:hidden">
          <Button
            unstyled
            onClick={handleAction}
            className={`w-full px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition ${isCancelable
              ? "bg-[#C62839] text-white hover:bg-[#b02131]"
              : "bg-blueSite text-white hover:bg-[#0a6b4f]"
              }`}
          >
            {isCancelable ? t("orders.cancelOrder") : t("orders.viewDetails")}
          </Button>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#525656]">
          <span className="font-medium">
            {itemsCount} {t("orders.products")}
          </span>
          <span className="text-[#9CA3AF]">•</span>
          <span>{t("orders.orderPlacedIn")} {placedAtLabel}</span>
        </div>

        <div className="text-sm text-[#525656]">
          {t("orders.orderExpectedArrival")}{" "}
          <span className="font-semibold text-[#303333]">
            {expectedLabel}
          </span>
        </div>
      </div>

      {/* Footer - Price and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#E8EFEA]">
        <div className="text-center sm:text-left">
          <span className="text-sm text-[#525656]">
            {t("orders.totalPrice")} :{" "}
          </span>
          <span className="text-base sm:text-lg font-semibold text-blueSite">
            {totalPriceLabel}
          </span>
        </div>

        {/* Action Button - Desktop */}
        <div className="hidden sm:block">
          <Button
            unstyled
            onClick={handleAction}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm font-semibold shadow-sm transition ${isCancelable
              ? "bg-[#C62839] text-white hover:bg-[#b02131]"
              : "bg-blueSite text-white hover:bg-[#0a6b4f]"
              }`}
          >
            {isCancelable ? t("orders.cancelOrder") : t("orders.viewDetails")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

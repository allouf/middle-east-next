"use client";

import React from "react";
import Image from "next/image";
import Modal from "../../../../../../../../components/ui/Modal";
import Button from "../../../../../../../../components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Star } from "lucide-react";

type QuoteApprovalModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;

  /** Quote details */
  providerName?: string;
  providerRole?: string;
  rating?: number;
  proposedBudget?: string;
  providerAvatar?: string;

  /** Custom content */
  title?: string;
  subtitle?: string;
  confirmText?: string;
  backText?: string;
  icon?: string;
  budgetLabel?: string;
};

const QuoteApprovalModal: React.FC<QuoteApprovalModalProps> = ({
  open,
  onClose,
  onConfirm,

  providerName = "",
  providerRole = "",
  rating = 0,
  proposedBudget = "",
  providerAvatar = "",

  title,
  subtitle,
  confirmText = "Confirm",
  backText = "Back",
  icon = "/rfqConformQute.png",
  budgetLabel = "PROPOSED BUDGET",
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      className="text-center"
      style={{ maxWidth: 520, width: "92%" }}
      padding="p-4 "
      showLine={true}
      classNameContent=" overflow-hidden !rounded-2xl "
    >
      <div className="flex flex-col items-center text-center px-6 py-8">
        {/* Icon */}
        <div className="relative w-[140px] h-[140px] mb-5">
          <Image
            src={icon}
            alt="Quote Approval"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-semibold text-[#00664F] mb-2">
          {title || t("serviceMarket.rfq.details.acceptQuote.title", "Quotation Approval")}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-500 text-sm mb-6 max-w-sm leading-6">
            {subtitle}
          </p>
        )}

        {/* Quote Details Card */}
        {(providerName || proposedBudget) && (
          <div className="w-full bg-gray-50  rounded-2xl p-4 mb-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {providerAvatar ? (
                    <Image src={providerAvatar} alt={providerName || "Provider"} fill className="object-cover" />
                  ) : null}
                </div>
                <div className="text-start">
                  {providerName && (
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      {providerName}
                      {rating > 0 && (
                        <span className="flex items-center text-[13px] text-yellow-500">
                          <Star size={14} className="fill-current text-yellow-500" />
                          <span className="ml-1">{rating}</span>
                        </span>
                      )}
                    </div>
                  )}
                  {providerRole && (
                    <div className="text-xs text-gray-500">{providerRole}</div>
                  )}
                </div>
              </div>
              <div className="text-end">
                {proposedBudget && (
                  <div className="text-xl font-bold text-gray-900">{proposedBudget}</div>
                )}
                <div className="text-[10px] uppercase tracking-wide text-gray-400">{budgetLabel}</div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Button
            type="button"
            onClick={onConfirm}
            unstyled
            className="
              h-11
              rounded-xl
              bg-[#00664F]
              hover:bg-[#00664F]/90
              text-white
              font-medium
              transition
              flex items-center justify-center
            "
          >
            {confirmText}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-800 underline underline-offset-4"
          >
            {backText}
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default QuoteApprovalModal;

"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import GlowLight from "@/components/shered/GlowLight";
import { Check, Star, User } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ReviewSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnToOrder?: () => void;
  rating?: number;
  comment?: string;
  userName?: string;
  userEmail?: string;
}

const ReviewSuccessModal: React.FC<ReviewSuccessModalProps> = ({
  isOpen,
  onClose,
  onReturnToOrder,
  rating = 5.0,
  comment = "",
  userName = "Alex Rivera",
  userEmail = "username@gmail.com",
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showLine={false}
      showCloseButton={false}
      classNameContent="p-0"
      padding=""
      secondPadding=""
      className="!rounded-[24px] overflow-y-auto custom-scrollbar bg-white shadow-xl relative"
      style={{ maxWidth: "520px", zIndex: 9999 }}
    >
      {/* Background Glows matching screenshot */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none rounded-[24px]">
        <GlowLight
          color="#06B187"
          size="w-[80px] h-[80px]"
          opacity="opacity-40"
          blur="blur-[45px] sm:blur-[45px]"
          position="top-[-20px] right-[-20px]"
        />
        <GlowLight
          color="#06B187"
          size="w-[80px] h-[80px]"
          opacity="opacity-30"
          blur="blur-[45px] sm:blur-[45px]"
          position="bottom-[-20px] left-[-20px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-10 px-8 pb-8 text-center">
        {/* Success Icon */}
        <div className="w-[88px] h-[88px] rounded-full bg-[#00664F33] flex items-center justify-center mb-6">
          <div className="w-[44px] h-[44px] rounded-full border-[3px] border-[#00664F] flex items-center justify-center">
            <Check size={24} strokeWidth={3.5} className="text-[#00664F]" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-[28px] font-bold text-[#1E293B] mb-3 leading-tight max-w-[80%] mx-auto">
          {t("services.details.reviewSuccessTitle", { defaultValue: "Your Rating has been submitted successfully" })}
        </h2>
        <p className="text-textGrayColor text-[16px] leading-relaxed mb-8 max-w-[90%] mx-auto">
          {t("services.details.reportSuccessDesc", { defaultValue: "Thank you for helping us keep the platform safe. Our moderation team is currently reviewing your submission." })}
        </p>

        {/* User Info */}
        <div className="w-full flex items-center gap-4 text-left mb-6">
          <div className="w-[50px] h-[50px] rounded-[8px] bg-[#00664F1A] border border-[#00664F33] flex items-center justify-center flex-shrink-0">
            <User size={24} className="text-[#00664F]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#1E293B] leading-tight">
              {userName}
            </span>
            <span className="text-[13px] text-[#64748B]">
              {userEmail}
            </span>
          </div>
        </div>

        {/* Rating Display */}
        <div className="w-full text-left mb-6">
          <p className="text-[14px] font-bold text-subTitleColor uppercase tracking-wider mb-2">
            {t("services.details.yourRatingLabel", { defaultValue: "YOUR RATING" })}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  strokeWidth={1.5}
                  className={`${
                    rating >= star
                      ? "fill-[#FBBF24] text-[#FBBF24]"
                      : "text-[#CBD5E1] fill-transparent"
                  }`}
                />
              ))}
            </div>
            <span className="text-[14px] font-bold text-[#1E293B] mt-0.5">
              {Number(rating).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Comment Box */}
        {comment && (
          <div className="w-full text-left mb-10">
            <p className="text-[14px] font-bold text-subTitleColor uppercase tracking-wider mb-2">
              {t("services.details.yourCommentLabel", { defaultValue: "YOUR COMMENT" })}
            </p>
            <div className="w-full rounded-[8px] bg-[#00664F1A] border border-[#00664F1A] p-4">
              <p className="text-textGrayColor text-[16px] leading-relaxed m-0 italic">
                "{comment}"
              </p>
            </div>
          </div>
        )}

        {/* Actions Button */}
        <div className="flex items-center gap-3 w-full max-w-[400px]">
          <button
            onClick={() => {
              if (onReturnToOrder) onReturnToOrder();
              onClose();
            }}
            className="flex-1 py-3 px-2 text-[14px] font-semibold bg-[#00664F] hover:bg-[#00523F] text-white rounded-[8px] transition-colors"
          >
            {t("services.details.returnToOrder", { defaultValue: "Return to Order" })}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-2 text-[14px] font-semibold text-[#1E293B] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-[8px] transition-colors"
          >
            {t("services.details.close", { defaultValue: "Close" })}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewSuccessModal;

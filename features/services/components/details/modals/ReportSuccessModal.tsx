"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import GlowLight from "@/components/shered/GlowLight";
import Image from "next/image";
import { Info, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ReportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnToService?: () => void;
  serviceId?: string|number;
  serviceTitle?: string;
  serviceImage?: string;
  serviceDescription?: string;
}

const ReportSuccessModal: React.FC<ReportSuccessModalProps> = ({
  isOpen,
  onClose,
  onReturnToService,
  serviceId = "1",
  serviceTitle = "Promoted CloudScale Enterprise Solutions",
  serviceImage = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
  serviceDescription = "",
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
          opacity="opacity-40"
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
        <h2 className="text-[24px] font-bold text-[#1E293B] mb-3 leading-tight max-w-[80%] mx-auto">
          {t("services.details.reportSuccessTitle", { defaultValue: "Your report has been submitted successfully" })}
        </h2>
        <p className="text-[#64748B] text-[14px] leading-relaxed mb-8 max-w-[90%] mx-auto">
          {t("services.details.reportSuccessDesc", { defaultValue: "Thank you for helping us keep the platform safe. Our moderation team is currently reviewing your submission." })}
        </p>

        {/* Info Notification Box */}
        <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-4 flex gap-3 text-left mb-8 shadow-sm">
          <Info size={18} className="text-blueSite flex-shrink-0 mt-0.5" />
          <p className="text-[#64748B] text-[13px] leading-relaxed m-0">
            {t("services.details.reportSuccessNote", { defaultValue: "Note: The advertisement remains visible to users during the review process. You will receive an automated notification via email once a decision has been made." })}
          </p>
        </div>

        {/* Service Thumbnail */}
        <div className="w-full flex gap-4 bg-white border border-[#E2E8F0] p-4 rounded-[12px] mb-10 shadow-sm text-left">
          <div className="relative w-[70px] h-[60px] rounded overflow-hidden flex-shrink-0 bg-gray-100">
            <Image 
              src={serviceImage} 
              alt="Service Thumbnail" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden w-full">
            <span className="text-[13px] font-medium text-blueSite truncate">
              {serviceTitle}
            </span>
            <span className="text-[11px] text-[#94A3B8] mb-1">
              {t("services.details.idLabel", { defaultValue: "ID:" })} {serviceId}
            </span>
            {serviceDescription && (
              <p className="text-[12px] text-gray-500 line-clamp-2 m-0 mt-1" title={serviceDescription}>
                {serviceDescription}
              </p>
            )}
          </div>
        </div>

        {/* Actions Button */}
        <div className="flex items-center gap-3 w-full max-w-[400px]">
          <button
            onClick={() => {
              if(onReturnToService) onReturnToService();
              onClose();
            }}
            className="flex-1 py-3 text-[14px] font-semibold bg-blueSite hover:bg-[#00523F] text-white rounded-[10px] transition-colors"
          >
            {t("services.details.returnToService", { defaultValue: "Return to Service" })}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 text-[14px] font-semibold text-[#1E293B] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-[10px] transition-colors"
          >
            {t("services.details.close", { defaultValue: "Close" })}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportSuccessModal;

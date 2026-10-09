"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import SelectFiled from "@/components/ui/SelectFiled";
import GlowLight from "@/components/shered/GlowLight";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { useAlert } from "@/lib/context/AlertProvider";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ReportServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  serviceId?: string|number;
  serviceTitle?: string;
  serviceImage?: string;
  serviceDescription?: string;
}

const ReportServiceModal: React.FC<ReportServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  serviceId = "1",
  serviceTitle = "Promoted CloudScale Enterprise Solutions",
  serviceImage = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
  serviceDescription = "",
}) => {
  const { t } = useTranslation();
  const { formData, handleChange, handleAddError, errors, isValid } = useFormData();
  const { postData, loading, error } = usePostData(SERVICES_PUBLIC_ENDPOINTS.report(Number(serviceId)));
  const { message } = useAlert();

  const reportingOptions = [
    { id: "spam", name: t("services.details.reportReasons.spam", { defaultValue: "Spam" }) },
    { id: "inappropriate_content", name: t("services.details.reportReasons.inappropriate_content", { defaultValue: "Inappropriate content" }) },
    { id: "misleading", name: t("services.details.reportReasons.misleading", { defaultValue: "Misleading" }) },
    { id: "scam", name: t("services.details.reportReasons.scam", { defaultValue: "Scam" }) },
    { id: "other", name: t("services.details.reportReasons.other", { defaultValue: "Other" }) },
  ];

  const handleSubmit = async() => {
    // Handle submission logic here
    // console.log("Report submitted:", { reason, description });
    try {
      await postData(formData, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
        },
        onError: (err) => {
          // message.error(err)
        },
        showMessage: false,
      });
    } catch (error) {
      // console.log("Report Error",error)
    }
 
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showLine={false}
      showCloseButton={false}
      classNameContent="p-0"
      padding=""
      secondPadding=""
      className="!rounded-[16px] overflow-y-auto custom-scrollbar bg-white shadow-xl relative"
      style={{ maxWidth: "600px", zIndex: 9999 }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none rounded-[16px]">
       <GlowLight
        color="#06B187"
        size="w-[55px] h-[40px]"
        opacity="opacity-80"
        blur="blur-[35px] sm:blur-[35px]"
        position="top-0 right-0"
          />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="p-8 ">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#00664F1A] flex items-center justify-center text-[#00664F] flex-shrink-0">
              <Info size={18} />
            </div>
            <h2 className="text-[24px] font-bold text-subTitleColor m-0">
              {t("services.details.reportAdHeader", { defaultValue: "Report Advertisement" })}
            </h2>
          </div>
          <p className="text-[#64748B] text-[14px] leading-relaxed mb-6">
            {t("services.details.reportAdDesc", { defaultValue: "We take advertisement quality seriously. Please provide details about why you are reporting this content. Our moderation team will review it within 24 hours." })}
          </p>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <SelectFiled
                id="reason"
                label={t("services.details.reasonForReportingLabel", { defaultValue: "Reason For Reporting *" })}
                value={formData.reason}
                onChange={handleChange("reason")}
                selectorOptions={reportingOptions}
                placeholder={t("services.details.selectReasonPlaceholder", { defaultValue: "Select a reason..." })}
                withFieldset 
                handleAddError={handleAddError}
                validate
                
              />
            </div>

            <div className="relative">
              <InputField
                id="description"
                label={t("services.details.reportDescriptionLabel", { defaultValue: "Description" })}
                type="textarea"
                rows={4}
                value={formData.description}
                onChange={handleChange("description")}
                formErrors={errors}
                handleAddError={handleAddError}
                validate
                conditions={{ textarea: { max: 500, min: 10 } }}
                placeholder={t("services.details.reportDescriptionPlaceholder", { defaultValue: "Tell us more about the issue with this ad (optional)..." })}
                withFieldset
              />
              <p className="text-[#94A3B8] text-[12px] mt-2 ml-1">
                {t("services.details.maxCharactersText", { defaultValue: "Maximum 500 characters. If you selected 'Other', please be as specific as possible." })}
              </p>
            </div>
          </div>

          {/* Service Thumbnail */}
          <div className="mt-6 flex gap-4 bg-white border-t border-gray-100 pt-6 p-3 rounded-lg">
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
        </div>

        {/* Footer */}
        <div className="bg-[#00664F1A] p-6 flex items-center justify-end gap-3 border-t border-gray-100 mt-auto">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-[14px] font-medium text-[#475569] hover:text-[#1E293B] hover:bg-gray-200/50 rounded-lg transition-colors"
          >
            {t("services.details.cancel", { defaultValue: "Cancel" })}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !isValid}
            className="px-6 py-2.5 text-[14px] font-medium bg-[#A7CDB9] hover:bg-[#00664F] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("services.details.submitting", { defaultValue: "Submitting..." }) : t("services.details.submitReport", { defaultValue: "Submit Report" })}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportServiceModal;

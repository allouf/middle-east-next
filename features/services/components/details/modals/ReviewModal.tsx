"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Info, Star, CheckCircle2, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import GlowLight from "@/components/shered/GlowLight";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { useAlert } from "@/lib/context/AlertProvider";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: {rating: number, comment: string}) => void;
  orderId?: string;
  serviceId?: string | number;
  serviceTitle?: string;
  serviceImage?: string;
  completionDate?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  orderId = "ORD-88291",
  serviceId = "1",
  serviceTitle = "Professional Web Design Service",
  serviceImage = "",
  completionDate = "Oct 24, 2023",
}) => {
  const { t } = useTranslation();
  const { formData, handleChange, handleAddError, errors, isValid } = useFormData();
  // Using generic review endpoint structure based on existing code style
  const { postData, loading } = usePostData(SERVICES_PUBLIC_ENDPOINTS.review(Number(serviceId)));
  const { message } = useAlert();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async () => {
    try {
      await postData(
        { ...formData, rating },
        {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess({ rating, comment: formData.description });
            }
          },
          showMessage: false,
        }
      );
    } catch (error) {
      // console.log("Review Error", error);
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
          size="w-[80px] h-[60px]"
          opacity="opacity-30"
          blur="blur-[45px] sm:blur-[45px]"
          position="top-0 right-0"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#94A3B8] hover:text-[#475569] z-20 transition-colors"
          aria-label={t("services.details.closeModal", { defaultValue: "Close modal" })}
        >
          <X size={20} />
        </button>

        <div className="p-8 pb-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-[24px] font-bold text-subTitleColor m-0 mb-1">
              {t("services.details.submitReviewHeader", { defaultValue: "Submit Your Review" })}
            </h2>
            <p className="text-textGrayColor text-[14px]">
              {t("services.details.submitReviewDesc", { defaultValue: "Share your experience to help the community grow." })}
            </p>
          </div>

          {/* Service Card */}
          <div className="flex items-center gap-4 bg-[#FAFAFA] p-4 rounded-[8px] mb-8 border border-gray-50">
            <div className="relative w-[70px] h-[70px] rounded-lg overflow-hidden flex-shrink-0 bg-[#8FB5C8] flex items-center justify-center">
              {serviceImage ? (
                <Image
                  src={serviceImage}
                  alt={serviceTitle}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-white/60 font-cursive text-sm -rotate-12 select-none">
                  Image
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-1.5">
                <span className="flex items-center gap-1 bg-[#00664F33] text-[#00664F] text-[9.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  {t("services.details.verifiedPurchase", { defaultValue: "VERIFIED PURCHASE" })}
                </span>
                <span className="text-[12px] font-medium text-[#94A3B8]">
                  {t("services.details.orderNumberLabel", { defaultValue: "Order #" })}{orderId}
                </span>
              </div>
              <span className="text-[15px] font-bold text-[#1E293B] mb-0.5">
                {serviceTitle}
              </span>
              <span className="text-[13px] text-[#94A3B8]">
                {t("services.details.completedOnLabel", { defaultValue: "Completed on" })} {completionDate}
              </span>
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-6">
            <p className="text-[14px] font-bold text-subTitleColor mb-3">
              {t("services.details.rateServiceQuestion", { defaultValue: "How would you rate this service?" })}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-colors"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={28}
                      strokeWidth={1.5}
                      className={`${
                        (hoveredRating || rating) >= star
                          ? "fill-[#FBBF24] text-[#FBBF24]"
                          : "text-[#CBD5E1] fill-transparent hover:text-[#94A3B8]"
                      } transition-all duration-200`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[13px] text-textGrayColor">
                {rating > 0 ? t("services.details.starsCount", { count: rating, defaultValue: `${rating} stars` }) : t("services.details.selectStarsToRate", { defaultValue: "Select stars to rate" })}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="mb-6 relative">
            <InputField
              id="description"
              label={t("services.details.reviewDescriptionLabel", { defaultValue: "Description" })}
              type="textarea"
              rows={4}
              value={formData.description || ""}
              onChange={handleChange("description")}
              formErrors={errors}
              handleAddError={handleAddError}
              validate
              conditions={{ textarea: { max: 500, min: 10 } }}
              placeholder={t("services.details.reviewDescriptionPlaceholder", { defaultValue: "Describe your experience with the seller. What went well? What could be improved ?" })}
              withFieldset
            />
            <p className="text-[#94A3B8] text-[12px] mt-2 ml-1">
              {t("services.details.maxCharactersReview", { defaultValue: "Maximum 500 characters." })}
            </p>
          </div>

          {/* Help Info Box */}
          <div className="bg-[#00664F0D] rounded-[8px] p-4 flex items-start gap-3 border border-[#E2E8F0]/40">
            <Info className="text-[#00664F] mt-0.5 flex-shrink-0" size={18} />
            <p className="text-[#475569] text-[13px] leading-relaxed">
              {t("services.details.reviewHelpInfo", { defaultValue: "Be helpful and honest. Reviews are public and help both buyers and sellers build trust in our marketplace. Please avoid personal information." })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex items-center justify-between border-t border-gray-100 bg-[#F8FAFC] rounded-b-[16px]">
          <button
            onClick={onClose}
            className="text-[14px] font-medium text-textGrayColor hover:text-subTitleColor transition-colors"
          >
            {t("services.details.cancel", { defaultValue: "Cancel" })}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0 || !isValid}
            className="px-6 py-2.5 text-[16px] font-medium bg-[#7BA79B] hover:bg-blueSite text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("services.details.submitting", { defaultValue: "Submitting..." }) : t("services.details.submitReview", { defaultValue: "Submit Review" })}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;

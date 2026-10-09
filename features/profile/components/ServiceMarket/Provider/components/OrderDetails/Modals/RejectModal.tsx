"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import SelectFiled from "@/components/ui/SelectFiled";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Ban, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useAlert } from "@/lib/context/AlertProvider";
import { useOrderDetails } from "../../../hooks/Orders/useOrderDetails";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (reason: string, notes: string) => void;
  isRejecting?: boolean;
}

const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onConfirm, isRejecting }) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { rejectOrder, isRejecting: hookIsRejecting } = useOrderDetails({ orderId: orderId || undefined, autoFetch: false });
  const { message } = useAlert();

  const [formData, setFormData] = useState({
    reason: "",
    notes: ""
  });

  const handleSelectChange = (e: any) => {
    setFormData({ ...formData, [e.target.name || "reason"]: e.target.value });
  };

  const handleInputChange = (e: any) => {
    const val = e?.target?.value !== undefined ? e.target.value : e;
    setFormData({ ...formData, notes: val });
  };

  const submit = async () => {
    if (!formData.reason) {
      message.error(t('orderDetails.reasonRequired', { defaultValue: 'Please select a reason for rejection.' }));
      return;
    }

    console.log("Reson",formData.reason)
    const success = await rejectOrder(Number(formData.reason), formData.notes);
    if (success) {
      if (onConfirm) {
        onConfirm(formData.reason, formData.notes);
      }
      onClose();
    }
  };

  const isLoading = isRejecting || hookIsRejecting;

  return (
    <Modal
      id="reject-modal"
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      showLine={false}
      classNameContent="p-0"
      padding="py-10"
      secondPadding=""
      className="!rounded-[24px] overflow-y-auto custom-scrollbar bg-white relative"
      style={{ maxWidth: "760px", zIndex: 9999 }}
    >
      <div className="flex flex-col  px-8 ">
        {/* Header */}
        <div className="text-center mb-8 w-full max-w-[90%] mx-auto">
          <h2 className="text-[28px] font-bold text-blueSite mb-3 leading-snug">
            {t('orderDetails.rejectRequest', { defaultValue: 'Reject Request' })}
          </h2>
          <p className="text-textGrayColor text-[18px] leading-relaxed max-w-[60%] mx-auto">
            {t('orderDetails.rejectDesc', { defaultValue: 'Please provide a reason why you cannot accept this service request.' })}
          </p>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-6 w-full px-2">
          <SelectFiled
            id="reason"
            label={t('orderDetails.reasonForRejection', { defaultValue: 'Reason For Rejection' })}
            placeholder={t('orderDetails.specifyReason', { defaultValue: 'Please specify your reason' })}
            withFieldset={true}
            value={formData.reason}
            onChange={handleSelectChange}
            url={"/rejection-reasons/active"}
          />

          <div className="flex flex-col w-full">
            <label className="text-blueSite font-bold text-[15px] mb-1">
              {t('orderDetails.additionalFeedback', { defaultValue: 'Additional Feedback/Notes' })}
            </label>
            <p className="text-textGrayColor text-[13px] mb-3">
              {t('orderDetails.feedbackDesc', { defaultValue: 'Your message will be shared with the customer to understand the decision.' })}
            </p>
            <InputField
              id="notes"
              type="textarea"
              rows={4}
              placeholder={t('orderDetails.feedbackPlaceholder', { defaultValue: 'e.g. Thank you for reaching out. Unfortunately, our team is fully booked until a while...' })}
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Info Text */}
        <div className="flex items-center justify-center gap-1.5 mt-8 mb-6 text-textGrayColor text-[12.5px]">
          <ShieldCheck size={14} className="text-[#9CA3AF]" strokeWidth={1.5} />
          <span>{t('orderDetails.rejectionPolicy', { defaultValue: 'All rejections are handled according to the Marketplace Quality Standards.' })}</span>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#F1F5F9] mb-6"></div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-8 py-2 text-[14px] font-medium text-subTitleColor bg-white border border-[#E2E8F0] shadow-sm rounded-[8px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </button>
          
          <button
            onClick={submit}
            disabled={isLoading}
            className="bg-[#DC2626] text-white flex flex-row items-center gap-2  rounded-[8px] py-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                 {t('common.confirming', { defaultValue: 'Confirming...' })}
              </span>
            ) : (
              <>
                <Ban size={16} strokeWidth={2} />
                {t('orderDetails.confirmRejection', { defaultValue: 'Confirm Rejection' })}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectModal;

"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import SelectFiled from "@/components/ui/SelectFiled";
import GlowLight from "@/components/shered/GlowLight";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { AlertCircle } from "lucide-react";
import useFormData from "@/lib/Hooks/useFormData";

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reason_id: number, description: string) => void;
  isSubmitting?: boolean;
  order?: any;
}

const DISPUTE_REASONS = [
  { id: 'quality', name: 'Poor Quality of Work' },
  { id: 'delay', name: 'Delivery Delay' },
  { id: 'communication', name: 'Lack of Communication' },
  { id: 'other', name: 'Other' },
];

const DisputeModal: React.FC<DisputeModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting, order }) => {
  const { t } = useTranslation(); 
  const {formData,handleChange,setFormData,handleArrayChange} = useFormData({
    reason_id:"",
    description:""
  })






  const isFormValid = formData.reason_id && formData.description.length > 0;

  return (
    <Modal
      id="dispute-modal"
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      showLine={false}
      classNameContent="p-0"
      padding=""
      secondPadding=""
      className="!rounded-[24px] overflow-visible custom-scrollbar bg-white relative"
      style={{ maxWidth: "620px", zIndex: 9999 }}
    >
      {/* Glow Effect Top Right */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden rounded-[24px] pointer-events-none">
        <GlowLight
          color="#06B187"
          size="w-[80px] h-[60px]"
          opacity="opacity-40"
          blur="blur-[45px]"
          position="top-[-20px] right-[-20px]"
        />
      </div>

      <div className="flex flex-col px-8 relative z-10 w-full py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-6 w-full pr-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[#E8F3EE] flex items-center justify-center border border-[#CCE0DC]">
              <AlertCircle size={18} className="text-blueSite" strokeWidth={2} />
            </div>
            <h2 className="text-[24px] font-bold text-subTitleColor m-0 leading-none">
              Dispute Request
            </h2>
          </div>
          <p className="text-textGrayColor text-[13px] leading-relaxed">
            Formalize your concern regarding the ongoing service. Our resolution specialists will review all submitted evidence within 48 hours.
          </p>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-4 w-full">
          <SelectFiled
            id="reason_id"
            label="Dispute Reason"
            placeholder="Select a Primary reason..."
            withFieldset={true}
            value={formData.reason_id}
            onChange={handleChange("reason_id")}
            url="/orders-reasons/reasons"
          />

          <div className="flex flex-col w-full -mt-1">
            <InputField
              id="description"
              label="Detailed Explanation"
              type="textarea"
              rows={4}
              placeholder="Tell us more about the issue with this ad ..."
              withFieldset={true}
              value={formData.description}
              onChange={handleChange("description")}
            />
            <p className="text-[#8B96A5] text-[11px] mt-1.5 ml-1">
              Maximum 500 characters. If you selected 'Other', please be as specific as possible.
            </p>
          </div>
        </div>

        {/* Service Details Card */}
        {order && (
          <div className="mt-6 bg-[#EEEEEE] rounded-[8px] p-4 flex flex-col gap-3 border border-[#EBEBEB]">
            <div className="flex items-start justify-between gap-4">
              <span className="font-bold text-[14px] text-subTitleColor leading-snug">{order?.title || "Promoted CloudScale Enterprise Solutions"}</span>
              <span className="bg-[#15803D1A] text-blueSite text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">#{order?.orderNumber || "REQ-9517"}</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-[#EBEBEB] pt-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden relative shrink-0">
                  <img
                    src={order?.customer?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                    alt={order?.customer?.name || "Customer Name"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-subTitleColor leading-tight">{order?.customer?.name || "Customer Name"}</span>
                  <span className="text-[#8B96A5] text-[13px] mt-0.5 capitalize">{order?.customer?.type || "Customer"}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[#8B96A5] text-[12px]">Escrow Balance</span>
                <span className="font-bold text-[18px] text-blueSite leading-tight">{order?.totalPrice ? `${order.totalPrice}$` : "0.00$"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-6 w-full mt-8 mb-2">
          <button
            onClick={() => {
              if (onSubmit && isFormValid) {
                onSubmit(Number(formData.reason_id), formData.description);
              }
            }}
            disabled={isSubmitting || !isFormValid}
            className="bg-blueSite text-white flex items-center justify-center rounded-[8px] py-2.5 px-6 font-bold disabled:bg-[#A9CBC0] disabled:cursor-not-allowed transition-colors text-[16px]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-subTitleColor font-bold text-[16px] underline hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DisputeModal;

"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import SelectFiled from "@/components/ui/SelectFiled";
import GlowLight from "@/components/shered/GlowLight";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAlert } from "@/lib/context/AlertProvider";
import { useOrderDetails } from "../../../hooks/Orders/useOrderDetails";

interface ExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (days: string, reason: string, description: string) => void;
  isSubmitting?: boolean;
}

const EXTENSION_DAYS = [
  { id: '1', name: '1 Day' },
  { id: '2', name: '2 Days' },
  { id: '3', name: '3 Days' },
  { id: '4', name: '4 Days' },
  { id: '5', name: '5 Days' },
  { id: '6', name: '6 Days' },
  { id: '7', name: '1 Week' },
];

const EXTENSION_REASONS = [
  { id: 'personal', name: 'Personal Emergency' },
  { id: 'technical', name: 'Technical Issues' },
  { id: 'scope', name: 'Scope Creep / Additional Requirements' },
  { id: 'other', name: 'Other' },
];

const ExtensionModal: React.FC<ExtensionModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { requestExtension, isRequestingExtension } = useOrderDetails({ orderId: orderId || undefined, autoFetch: false });
  const { message } = useAlert();

  const [formData, setFormData] = useState({
    days: "",
    reason: "",
    description: ""
  });

  const handleSelectChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e: any) => {
    const val = e?.target?.value !== undefined ? e.target.value : e;
    setFormData({ ...formData, description: val });
  };

  const submit = async () => {
    if (!formData.days || !formData.reason) {
      message.error(t('orderDetails.daysAndReasonRequired', { defaultValue: 'Please select both days and a reason.' }));
      return;
    }

    const success = await requestExtension(Number(formData.days), Number(formData.reason), formData.description);
    if (success) {
      if (onSubmit) {
        onSubmit(formData.days, formData.reason, formData.description);
      }
      onClose();
    }
  };

  const isFormValid = formData.days && formData.reason;
  const isLoading = isSubmitting || isRequestingExtension;

  return (
    <Modal
      id="extension-modal"
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
              Extension Request
            </h2>
          </div>
          <p className="text-textGrayColor text-[13px] leading-relaxed">
            You can request for an extension of time, if you have a valid reason. which will allow you to work on the Order
          </p>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-4 w-full">
          <SelectFiled
            id="days"
            
            label="Extension Days"
            placeholder="Add extra days..."
            withFieldset={true}
            value={formData.days}
            onChange={handleSelectChange}
            selectorOptions={EXTENSION_DAYS}
          />

          <SelectFiled
            id="reason"
          
            label="Extension Reason"
            placeholder="Select a reason..."
            withFieldset={true}
            value={formData.reason}
            onChange={handleSelectChange} 
            url={"/extension-reasons/active"}
            selectorOptions={EXTENSION_REASONS}
          />

          <div className="flex flex-col w-full -mt-1">
            <InputField
              id="description"
             
              label="Description (Optional)"
              type="textarea"
              rows={4}
              placeholder="Tell us more about the issue with this ad ..."
              withFieldset={true}
              value={formData.description}
              onChange={handleInputChange}
            />
            <p className="text-[#8B96A5] text-[11px] mt-1.5 ml-1">
              Maximum 500 characters. If you selected 'Other', please be as specific as possible.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-6 w-full mt-8 mb-2">
          <button
            onClick={submit}
            disabled={isLoading || !isFormValid}
            className="bg-blueSite text-white flex items-center justify-center rounded-[8px] py-2.5 px-6 font-bold disabled:bg-[#A9CBC0] disabled:cursor-not-allowed transition-colors text-[14px]"
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-subTitleColor font-bold text-[14px] underline hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExtensionModal;

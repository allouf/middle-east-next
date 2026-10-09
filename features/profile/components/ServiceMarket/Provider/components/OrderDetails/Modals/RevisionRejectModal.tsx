"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { DetailedOrder } from "../types";
import { FileText, XCircle } from "lucide-react";
import Image from "next/image";
import InputField from "@/components/ui/InputField";

interface RevisionRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reason: string) => void;
  order: DetailedOrder;
  isSubmitting?: boolean;
}

const RevisionRejectModal: React.FC<RevisionRejectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  order,
  isSubmitting 
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");

  const activeRevision = order.revisions && order.revisions.length > 0 
    ? order.revisions[0] 
    : null;

  const revisionType = activeRevision?.request_type || 'Standard';

  return (
    <Modal
      id="provider-revision-reject-modal"
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      showLine={true}
      classNameContent="p-0"
      padding=""
      secondPadding=""
      className="!rounded-[24px] bg-white relative overflow-y-auto custom-scrollbar"
      style={{ maxWidth: "550px", zIndex: 9999 }}
    >
      <div className="flex flex-col items-center px-6 md:px-8 py-8 w-full relative z-10">
        
        {/* Main Illustration */}
        <div className="flex justify-center w-full mb-6 relative">
          <div className="w-[100px] h-[100px] rounded-full bg-[#FCE8E8] flex items-center justify-center">
            <XCircle className="w-14 h-14 text-[#E74C3C]" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[28px] 2xl:text-[32px] font-bold text-blueSite mb-8 text-center">
          {t('orderDetails.revisionRejectionReason', { defaultValue: 'Revision Rejection Reason' })}
        </h2>

        {/* Inside Card / Information */}
        <div className="bg-[#FAFAFA] border border-[#E2E8F0] rounded-[20px] p-5 w-[90%] flex flex-col gap-4 mb-8">
          {/* Header row: Service and Budget */}
          <div className="flex flex-row justify-between items-start w-full">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200">
                {order.customer?.avatar ? (
                   <Image 
                     src={order.customer.avatar} 
                     alt={order.customer.name || 'Customer'} 
                     width={44} 
                     height={44} 
                     className="object-cover" 
                   />
                ) : (
                   <div className="w-full h-full bg-gray-300"></div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-subTitleColor text-[15px]">{order.title || 'Service name goes here'}</span>
                <span className="text-textGrayColor text-[13px]">{order.customer?.name || 'customer name goes here'}</span>
              </div>
            </div>

            <div className="flex flex-col items-end pt-1">
              <span className="font-extrabold text-blueSite text-[18px]">
                {order.totalPrice || '0.00'} {order.currency || '$'}
              </span>
              <span className="text-textGrayColor text-[9px] font-bold uppercase mt-0.5 tracking-wider">
                {t('orderDetails.proposedBudget', { defaultValue: 'PROPOSED BUDGET' })}
              </span>
            </div>
          </div>

          {/* Reason Section */}
          <div className="flex items-center gap-2 mt-2">
            <FileText className="w-4 h-4 text-blueSite" />
            <span className="text-[13px] text-textGrayColor">
              {t('orderDetails.reasonLabel', { defaultValue: 'Reason' })}:{' '}
              <span className="text-subTitleColor font-bold capitalize">
                {revisionType.toLowerCase()} Revision
              </span>
            </span>
          </div>
        </div>

        {/* Textarea */}
        <div className="w-full mb-8">
          <InputField
            id="rejection-reason"
            label={t('orderDetails.rejectionReasonLabel', { defaultValue: 'Rejection Reason' })}
            type="textarea"
            value={reason}
            onChange={(e: any) => setReason(e.target.value)}
            placeholder={t('orderDetails.rejectionReasonPlaceholder', { defaultValue: 'Describe your reason' })}
            withFieldset={true}
            rows={6}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-row items-center gap-4 w-full mb-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 bg-[#E2E8F0] text-[#64748B] hover:bg-gray-300 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 text-[14px]"
          >
            {t('common.back', { defaultValue: 'Back' })}
          </button>
          <button
            onClick={() => onSubmit && onSubmit(reason)}
            disabled={isSubmitting || !reason.trim()}
            className="flex-1 bg-blueSite text-white hover:bg-blueSiteHover py-3 rounded-xl font-bold transition-colors disabled:opacity-50 text-[14px]"
          >
            {t('common.send', { defaultValue: 'Send' })}
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default RevisionRejectModal;

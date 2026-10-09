"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { DetailedOrder } from "../types";
import { FileText, XCircle } from "lucide-react";
import Image from "next/image";

interface RevisionRejectSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DetailedOrder;
  reason: string;
}

const RevisionRejectSuccessModal: React.FC<RevisionRejectSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  order,
  reason
}) => {
  const { t } = useTranslation();

  const activeRevision = order.revisions && order.revisions.length > 0 
    ? order.revisions[0] 
    : null;

  const revisionType = activeRevision?.request_type || 'Standard';

  return (
    <Modal
      id="provider-revision-reject-success-modal"
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
          <div className="relative w-[200px] h-[200px]">
             <Image 
               src="/sendImage.png" 
               alt="Rejection Sent" 
               layout="fill" 
               objectFit="contain"
             />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[28px] font-bold text-blueSite mb-8 text-center">
          {t('orderDetails.rejectionReasonSent', { defaultValue: 'Rejection Reason sent' })}
        </h2>

        {/* Inside Card / Information */}
        <div className="bg-[#FAFAFA] border border-[#E2E8F0] rounded-[20px] p-5 w-full flex flex-col gap-4 mb-6">
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
            <FileText className="w-4 h-4 text-[#06B187]" />
            <span className="text-[13px] text-textGrayColor">
              {t('orderDetails.reasonLabel', { defaultValue: 'Reason' })}:{' '}
              <span className="text-subTitleColor font-bold capitalize">
                {revisionType.toLowerCase()} Revision
              </span>
            </span>
          </div>
        </div>

        {/* Rejection Note Box */}
        <div className="w-full bg-[#DC26261A] border border-[#FEE2E2] rounded-[20px] p-4 flex gap-3 mb-8">
          <XCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-bold text-[#DC2626]">
              {t('orderDetails.rejectionLabel', { defaultValue: 'Rejection' })}:
            </span>
            <p className="text-[13px] text-[#DC2626] leading-relaxed">
              {reason}
            </p>
          </div>
        </div>

        {/* OK Button */}
        <button
          onClick={onClose}
          className="w-full max-w-[200px] bg-blueSite text-white hover:bg-blueSiteHover py-3 rounded-xl font-bold transition-colors text-[14px]"
        >
          {t('common.ok', { defaultValue: 'OK' })}
        </button>

      </div>
    </Modal>
  );
};

export default RevisionRejectSuccessModal;

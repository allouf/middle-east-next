"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { DetailedOrder } from "../types";
import { FileText } from "lucide-react";
import Image from "next/image";

interface RevisionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  order: DetailedOrder;
  isSubmitting?: boolean;
}

const RevisionRequestModal: React.FC<RevisionRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onApprove, 
  onReject,
  order,
  isSubmitting 
}) => {
  const { t } = useTranslation();

  const activeRevision = order.revisions && order.revisions.length > 0 
    ? order.revisions[0] 
    : null;

  const revisionType = activeRevision?.request_type || 'Standard';

  return (
    <Modal
      id="provider-revision-request-modal"
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
          <div className="relative w-[230px] h-[230px]">
             {/* Using QuestionCircle.png or fallback structure based on the image provided */}
             <Image 
               src="/requestExtension.png" 
               alt="Revision Request" 
               layout="fill" 
               objectFit="contain"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = '/requestExtension.png';
               }}
             />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-[28px] 2xl:text-[32px] font-bold text-blueSite mb-2 text-center">
          {t('orderDetails.revisionRequestTitle', { defaultValue: 'Revision Request' })}
        </h2>
        <p className="text-textGrayColor text-[18px] text-center mb-8 leading-relaxed max-w-[85%]">
          {t('orderDetails.revisionRequestSubtitle', { defaultValue: 'A revision has been requested. Please check the details and respond accordingly.' })}
        </p>

        {/* Inside Card / Information */}
        <div className="bg-[#FAFAFA] border border-[#E2E8F0] rounded-[20px] p-5 w-full flex flex-col gap-4 mb-8">
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
              <span className="font-extrabold text-blueSite text-[20px]">
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

        {/* Buttons */}
        <div className="flex flex-row items-center gap-4 w-full mb-4">
          <button
            onClick={onReject}
            disabled={isSubmitting}
            className="flex-1 bg-[#FADBD8] text-[#E74C3C] hover:bg-[#F5B7B1] py-3 rounded-xl font-bold transition-colors disabled:opacity-50 text-[14px]"
          >
            {t('common.reject', { defaultValue: 'Reject' })}
          </button>
          <button
            onClick={onApprove}
            disabled={isSubmitting}
            className="flex-1 bg-blueSite text-white hover:bg-[#03543C] py-3 rounded-xl font-bold transition-colors disabled:opacity-50 text-[14px]"
          >
            {t('common.approve', { defaultValue: 'Approve' })}
          </button>
        </div>

        <button 
          onClick={onClose}
          className="text-subTitleColor font-semibold text-[13px] underline hover:opacity-80 transition-opacity"
        >
          {t('orderDetails.viewOrderDetails', { defaultValue: 'View order Details' })}
        </button>

      </div>
    </Modal>
  );
};

export default RevisionRequestModal;

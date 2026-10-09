"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { DetailedOrder } from "../types";
import { LuClock } from 'react-icons/lu';
import { FileText, Star } from "lucide-react";
import Image from "next/image";

interface ExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  order: DetailedOrder;
  isSubmitting?: boolean;
}

const ExtensionModal: React.FC<ExtensionModalProps> = ({ 
  isOpen, 
  onClose, 
  onApprove, 
  onReject,
  order,
  isSubmitting 
}) => {
  const { t } = useTranslation();

  const pendingExtension = order.extensions?.find(ext => ext.status === 'PENDING') || 
                           (order.extensions && order.extensions.length > 0 ? order.extensions[order.extensions.length - 1] : null);

  const extensionRequest = pendingExtension ? {
    days: pendingExtension.requested_days,
    reason: pendingExtension.reason.name || pendingExtension.description
  } : {
    days: 0,
    reason: ""
  };

  return (
    <Modal
      id="client-extension-modal"
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      showLine={true}
      classNameContent="p-0"
      padding=""
      secondPadding=""
      className="!rounded-[24px]  bg-white relative overflow-y-auto custom-scrollbar"
      style={{ maxWidth: "600px", zIndex: 9999 }}
    >
      <div className="flex flex-col items-center px-6 md:px-8 py-8 w-full relative z-10">
        
        {/* Main Illustration */}
        <div className="flex justify-center w-full mb-6 relative">
          <div className="relative w-[240px] h-[240px]">
             <Image 
               src="/requestExtension.png" 
               alt="Extension Request" 
               layout="fill" 
               objectFit="contain"
             />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-[28px] 2xl:text-[32px] font-bold text-blueSite mb-2 text-center">
          {t('orderDetails.extensionRequestTitle', { defaultValue: 'Extention Request' })}
        </h2>
        <p className="text-textGrayColor text-[18px] 2xl:text-[20px] text-center mb-6 leading-relaxed max-w-[85%]">
          {t('orderDetails.extensionRequestSubtitle', { defaultValue: 'Please submit your request to extend the service period.' })}
        </p>

        {/* Inside Card / Information */}
        <div className="bg-[#FAFAFA] border border-[#E2E8F0] rounded-[20px] mx-8 p-4 w-full flex flex-col gap-4 mb-6">
          {/* Header row: Provider and Budget */}
          <div className="flex flex-row justify-between items-start w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {order.provider?.avatar ? (
                   <Image 
                     src={order.provider.avatar} 
                     alt={order.provider.name || 'Provider'} 
                     width={40} 
                     height={40} 
                     className="object-cover" 
                   />
                ) : (
                   <div className="w-full h-full bg-gray-300"></div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-subTitleColor text-[16px]">{order.provider?.name || 'Provider Name'}</span>
                  <div className="flex items-center text-[#EAB308] text-[12px] font-bold">
                    <span>{order.rating || '4.5'}</span>
                    <Star className="w-3 h-3 ml-0.5 fill-current" />
                  </div>
                </div>
                <span className="text-textGrayColor text-[13px]">{order.provider?.role || 'Service Provider'}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-extrabold text-blueSite text-[20px]">
                {order.totalPrice || '0.00'} {order.currency || '$'}
              </span>
              <span className="text-textGrayColor text-[10px] font-semibold uppercase mt-0.5">
                {t('orderDetails.proposedBudget', { defaultValue: 'PROPOSED BUDGET' })}
              </span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#E2E8F0] my-1"></div>

          {/* Extension details */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2 text-textGrayColor">
              <LuClock className="w-4 h-4 text-blueSite mt-0.5" />
              <span className="text-[13px]">
                {t('orderDetails.extension', { defaultValue: 'Extension' })} : <span className="font-bold text-subTitleColor">{extensionRequest.days} {t('common.days', { defaultValue: 'Days' })}</span>
              </span>
            </div>
            <div className="flex items-start gap-2 text-textGrayColor">
              <FileText className="w-4 h-4 text-blueSite mt-0.5 block flex-shrink-0" />
              <span className="text-[13px] leading-snug">
                {t('orderDetails.reason', { defaultValue: 'Reason' })}: <span className="text-subTitleColor">{extensionRequest.reason}</span>
              </span>
            </div>
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

export default ExtensionModal;

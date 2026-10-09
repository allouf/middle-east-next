"use client";

import Modal from "@/components/ui/Modal";
import Image from "next/image";
import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ExtensionRequestSentProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExtensionRequestSent = ({
  isOpen,
  onClose,
}: ExtensionRequestSentProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      showLine={true}
      classNameContent="p-0 "
      padding="py-8"
      secondPadding=""
      className="!rounded-[24px] overflow-y-auto custom-scrollbar bg-white shadow-xl relative"
      style={{ maxWidth: "580px", zIndex: 9999 }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[480px] pt-8 px-8 pb-10 text-center">
        {/* Success Image */}
        <div className="w-[200px] h-[160px] relative mb-6 flex items-center justify-center">
          <Image
            src="/sendImage.png"
            alt={t('orderDetails.extensionRequestSentAlt', { defaultValue: 'Extension Request Sent' })}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h2 className="text-[28px] font-medium text-blueSite mb-4 leading-snug">
          {t('orderDetails.requestSent', { defaultValue: 'Request Sent' })}
        </h2>

        {/* Description */}
        <p className="text-textGrayColor text-[15px] leading-relaxed mb-8 max-w-[85%] mx-auto">
          {t('orderDetails.requestSentDesc', { defaultValue: 'The extension request has been sent to the client, you will receive a response soon. be patient..' })}
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-[70%] py-3 px-6 text-[15px] font-bold bg-blueSite hover:bg-blueSiteHover text-white rounded-[8px] transition-colors duration-200"
        >
          {t('orderDetails.viewOrderDetails', { defaultValue: 'View Order Details' })}
        </button>
      </div>
    </Modal>
  );
};

export default ExtensionRequestSent;

"use client";

import Modal from "@/components/ui/Modal";
import Image from "next/image";
import React from "react";

const PaidFailedModal = ({
  isOpen,
  onClose,
  onTryAgain,
}: {
  isOpen: boolean;
  onClose: () => void;
  onTryAgain?: () => void;
}) => {
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
      style={{ maxWidth: "520px", zIndex: 9999 }}
    >
      <div className="relative z-10 flex flex-col items-center pt-10 px-8 pb-10 text-center">
        {/* Failed Image */}
        <div className="w-[280px] h-[240px] relative mb-6 flex items-center justify-center">
          <Image
            src="/credit-card-reject.png"
            alt="Paid Failed"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h2 className="text-[28px] text-[#DC2626] mb-4 leading-snug font-medium">
          Paid Failed
        </h2>

        {/* Description */}
        <p className="text-textGrayColor text-[16px] leading-relaxed mb-8 max-w-[90%] mx-auto">
          Sorry, the payment was unsuccessful. <br />
          Please try again.
        </p>

        {/* Try Again Button */}
        <button
          onClick={onTryAgain || onClose}
          className="w-auto min-w-[240px] py-2.5 px-6 text-[15px] font-semibold bg-[#818181] hover:bg-[#6c6c6c] text-white rounded-[8px] transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </Modal>
  );
};

export default PaidFailedModal;

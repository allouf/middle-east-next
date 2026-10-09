"use client";

import Modal from "@/components/ui/Modal";
import Image from "next/image";
import React from "react";

const SubmitedSuccess = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
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
      className="!rounded-[24px]  overflow-y-auto custom-scrollbar bg-white shadow-xl relative"
      style={{ maxWidth: "520px", zIndex: 9999 }}
    >
      <div className="relative z-10 flex flex-col items-center pt-10 px-8 pb-10 text-center">
        {/* Success Image */}
        <div className="w-[220px] h-[180px] relative mb-6 flex items-center justify-center">
          <Image
            src="/services/successModalImg.png"
            alt="Order Submitted Successfully"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h2 className="text-[28px]  text-blueSite mb-4 leading-snug">
          Order Submitted !!
        </h2>

        {/* Description */}
        <p className="text-textGrayColor text-[18px] leading-relaxed mb-8 max-w-[90%] mx-auto">
          Please be patient. The client is reviewing the files sent to them and
          delivery will be confirmed soon.
        </p>

        {/* OK Button */}
        <button
          onClick={onClose}
          className="w-[70%] py-2 px-6 text-[15px] font-semibold bg-blueSite hover:bg-blueSiteHover text-white rounded-[8px] transition-colors duration-200"
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default SubmitedSuccess;
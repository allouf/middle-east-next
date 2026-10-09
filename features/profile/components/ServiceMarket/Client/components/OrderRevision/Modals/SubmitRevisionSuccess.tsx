"use client";

import Modal from "@/components/ui/Modal";
import Image from "next/image";
import React from "react";

const SubmitRevisionSuccess = ({
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
      className="!rounded-[24px] overflow-y-auto custom-scrollbar bg-white shadow-xl relative"
      style={{ maxWidth: "520px", zIndex: 9999 }}
    >
      <div className="relative z-10 flex flex-col items-center pt-10 px-8 pb-10 text-center">
        {/* Success Image */}
        <div className="w-[220px] h-[180px] relative mb-6 flex items-center justify-center">
          <Image
            src="/sendImage.png"
            alt="Successfully Sent"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h2 className="text-[28px] text-blueSite mb-4 leading-snug">
          Successfully Sent
        </h2>

        {/* Description */}
        <p className="text-textGrayColor text-[16px] leading-relaxed mb-8 max-w-[90%] mx-auto">
          it to make a type specimen book. It has survived not only five centuries, but also ially unchanged
        </p>

        {/* View Details Button */}
        <button
          onClick={onClose}
          className="w-auto min-w-[240px] py-2.5 px-6 text-[15px] font-semibold bg-blueSite hover:bg-blueSiteHover text-white rounded-[8px] transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </Modal>
  );
};

export default SubmitRevisionSuccess;

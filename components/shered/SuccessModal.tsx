"use client";

import React from "react";
import Image from "next/image";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";

type SuccessModalProps = {
  open: boolean;
  handleClose: () => void;

  /** optional overrides */
  titleKey?: string;
  descriptionKey?: string;
  buttonTextKey?: string;

  title?: string;
  description?: string;

  imageLink?: string;
  textButton?: string;

  onButtonClick?: () => void;
};

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  handleClose,

  titleKey = "usedMarket.successModal.title",
  descriptionKey = "usedMarket.successModal.description",
  buttonTextKey = "usedMarket.successModal.viewDetails",

  title,
  description,

  imageLink = "/gallary.png",
  textButton,
  onButtonClick,
}) => {
  const { t } = useTranslation();

  const handleAction = () => {
    if (onButtonClick) onButtonClick();
    else handleClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      className="text-center"
      style={{ maxWidth: 560, width: "92%" }}
      padding="py-0"
      showLine={false}
      classNameContent="!p-0 overflow-hidden !rounded-2xl"
    >
      {/* Wrapper */}
      <div className="flex flex-col items-center text-center px-6 py-8">
        {/* Illustration */}
        <div className="relative w-[220px] h-[220px] md:w-[250px] md:h-[250px] mb-5">
          <Image
            src={imageLink}
            alt="Success"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-semibold text-[#00664F] mb-3">
          {title ?? t(titleKey, { defaultValue: "Success!" })}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm md:text-base mb-7 max-w-sm leading-6">
          {description ??
            t(descriptionKey, {
              defaultValue: "Your action has been completed successfully.",
            })}
        </p>

        {/* Action Button */}
        <Button
          type="button"
          onClick={handleAction}
          unstyled
          className="
            w-full max-w-xs
            h-11
            rounded-xl
            bg-[#00664F]
            hover:bg-[#00664F]/90
            text-white
            font-medium
            transition
            flex items-center justify-center
          "
        >
          {textButton ?? t(buttonTextKey, { defaultValue: "Done" })}
        </Button>

        {/* Optional close link */}
        <button
          type="button"
          onClick={handleClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-800 underline underline-offset-4"
        >
          {t("common.close", { defaultValue: "Close" })}
        </button>
      </div>
    </Modal>
  );
};

export default SuccessModal;

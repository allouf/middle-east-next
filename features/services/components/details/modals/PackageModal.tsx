"use client";

import React from "react";
import { FaCheck } from "react-icons/fa";
import { MdOutlineTimer, MdSync, MdOutlineSecurity } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { CursorClicking } from "@/components/Icons/CursorClicking";
import Modal from "@/components/ui/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";

export interface PackageDef {
  key: string;
  tabLabel: string;
  title: string;
  description: string;
  priceValue: string;
  features: string[];
  delivery: string;
  revisions: string;
  modDays: string;
}

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: () => void;
  selectedPackage: PackageDef | null;
}

const PackageModal: React.FC<PackageModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedPackage,
}) => {
  const { t } = useTranslation();
  if (!selectedPackage) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showLine={false}
      showCloseButton={false}
      classNameContent="p-0"
      padding="p-0"
      className="!rounded-[16px] overflow-hidden"
      style={{ maxWidth: "800px" ,maxHeight:"95vh"}}
    >
      <div className="p-8 pb-10 relative bg-white">
        {/* Close Button matching screenshot */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#333333] hover:bg-black text-white flex flex-col items-center justify-center transition-colors shadow-sm z-10"
          aria-label={t("services.details.closeModal", { defaultValue: "Close modal" })}
        >
          <AiOutlineClose size={14} strokeWidth={20} />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 pr-12">
          <h4 className="text-[24px] font-bold text-[#333333] mb-2 leading-tight">
            {selectedPackage.title}
          </h4>
          <div className="text-[28px] font-bold text-[#00664F] whitespace-nowrap">
            {selectedPackage.priceValue}
          </div>
        </div>

        <p className="text-[#888888] text-[13px] leading-relaxed mb-6 pr-4">
          {selectedPackage.description}{" "}
          <button className="text-[#00664F] font-bold hover:underline">
            {t("services.details.readLess", { defaultValue: "Read Less." })}
          </button>
        </p>

        <ul className="space-y-3 mb-8">
          {selectedPackage.features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start gap-4 text-[14px] text-[#555555]"
            >
              <FaCheck
                className="text-[#00664F] mt-1 flex-shrink-0"
                size={12}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-3 text-[14px] text-[#555555]">
            <MdOutlineTimer className="text-[#00664F]" size={18} />
            <span>{selectedPackage.delivery}</span>
          </div>
          <div className="flex items-center gap-3 text-[14px] text-[#555555]">
            <MdSync className="text-[#00664F]" size={18} />
            <span>{selectedPackage.revisions}</span>
          </div>
          <div className="flex items-start gap-3 text-[14px] text-[#555555]">
            <MdOutlineSecurity
              className="text-[#00664F] mt-0.5"
              size={18}
            />
            <span>
              {t("services.details.requestModificationsWithin", { defaultValue: "Request modifications within" })}{" "}
              <span className="text-[#EF4444] font-bold">
                {selectedPackage.modDays}
              </span>{" "}
              {t("services.details.ofDeliveryDate", { defaultValue: "of the delivery date" })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              onSelect?.();
              onClose();
            }}
            className="px-16 py-2.5 bg-[#00664F] hover:bg-[#00523F] transition-colors text-white font-bold rounded-[8px] flex items-center justify-center gap-2 text-[15px]"
          >
            <CursorClicking />
            {t("services.details.select", { defaultValue: "Select" })}
          </button>
          <button
            onClick={onClose}
            className="text-[#333333] font-bold text-[15px] hover:text-black border-b-[2px] border-[#333333] pb-0.5"
          >
            {t("services.details.cancel", { defaultValue: "Cancel" })}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PackageModal;

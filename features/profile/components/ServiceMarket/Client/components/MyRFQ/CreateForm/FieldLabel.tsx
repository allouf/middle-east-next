import React from "react";
import { useTranslation } from "react-i18next";

export default function FieldLabel({
  children,
  required,
  optional,
}: {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  const { t } = useTranslation();
  
  return (
    <label className="mb-2 inline-flex items-center gap-1 text-[16px] font-semibold text-[#0B6B57]">
      {children}
      {required && <span className="text-[#F04438]">*</span>}
      {optional && (
        <span className="font-normal text-[15px] text-[#0B6B57] opacity-80">
          ({t('serviceMarket.rfq.createForm.optional')})
        </span>
      )}
    </label>
  );
}

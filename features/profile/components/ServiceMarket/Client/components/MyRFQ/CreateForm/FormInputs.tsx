import React from "react";
import { ChevronDown, CloudUpload, CalendarDays, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TextInput({
  placeholder,
  icon,
  type = "text",
}: {
  placeholder: string;
  icon?: React.ReactNode;
  type?: string;
}) {
  return (
    <div className="flex h-[56px] items-center rounded-[10px] border border-[#D0D5DD] bg-white px-4">
      {icon && <span className="mr-3 text-[#98A2B3]">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent text-[16px] text-[#344054] outline-none placeholder:text-[#98A2B3]"
      />
    </div>
  );
}

export function SelectInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex h-[56px] items-center rounded-[10px] border border-[#D0D5DD] bg-white px-4">
      <select className="w-full appearance-none bg-transparent text-[16px] text-[#98A2B3] outline-none">
        <option>{placeholder}</option>
      </select>
      <ChevronDown className="ml-3 h-5 w-5 text-[#98A2B3]" />
    </div>
  );
}

export function TextArea({ placeholder }: { placeholder: string }) {
  return (
    <textarea
      placeholder={placeholder}
      className="min-h-[202px] w-full resize-none rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-4 text-[16px] text-[#344054] outline-none placeholder:text-[#98A2B3]"
    />
  );
}

export function UploadBox() {
  const { t } = useTranslation();

  return (
    <label className="flex min-h-[92px] cursor-pointer flex-col items-center justify-center rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-4 text-center transition hover:border-[#0B6B57]">
      <CloudUpload className="mb-2 h-8 w-8 text-[#98A2B3]" />
      <div className="text-[15px] text-[#667085]">
        <span className="font-semibold text-[#0B6B57] underline">
          {t('serviceMarket.rfq.createForm.upload.uploadFile')}
        </span>{" "}
        {t('serviceMarket.rfq.createForm.upload.dragDrop')}
      </div>
      <p className="mt-1 text-[12px] text-[#98A2B3]">
        {t('serviceMarket.rfq.createForm.upload.fileTypes')}
      </p>
      <input type="file" className="hidden" />
    </label>
  );
}

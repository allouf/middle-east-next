import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, children }: FieldProps) {
  const { t } = useTranslation();

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[#0B6B57] sm:text-sm">
        {label}
      </label>
      {children}
    </div>
  );
}

interface InputProps {
  placeholder: string;
  icon?: React.ReactNode;
  rightNode?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ placeholder, icon, rightNode, value, onChange }: InputProps) {
  return (
    <div className="flex h-[44px] items-center rounded-lg border border-[#D7DFDB] bg-white px-3 sm:h-[48px]">
      {icon && <span className="mr-2 text-[#98A2B3]">{icon}</span>}
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-[13px] text-[#344054] outline-none placeholder:text-[#98A2B3] sm:text-[14px]"
      />
      {rightNode}
    </div>
  );
}

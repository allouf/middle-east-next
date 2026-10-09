import React from "react";
import { useTranslation } from "react-i18next";

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, children }: FieldProps) {
  const { t } = useTranslation();

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#0B6B57]">
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
    <div className="flex h-[54px] items-center rounded-xl border border-[#D7DFDB] bg-white px-4">
      {icon && <span className="mr-3 text-[#98A2B3]">{icon}</span>}
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-[15px] text-[#344054] outline-none placeholder:text-[#98A2B3]"
      />
      {rightNode}
    </div>
  );
}

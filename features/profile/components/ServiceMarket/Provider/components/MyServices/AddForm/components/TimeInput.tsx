"use client";

import React from "react";
import TimePickerField from "@/components/ui/TimePickerField";

type TimeInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export default function TimeInput({ label, placeholder, value, onChange }: TimeInputProps) {
  return (
    <TimePickerField
      id={`time-input-${label}`}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      unstyled={true}
      className="h-[52px] w-full"
    />
  );
}

"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

type FieldProps = {
  label: string;
  optional?: boolean;
  placeholder?: string;
  textarea?: boolean;
  value?: string;
};

export function ProviderField({
  label,
  optional,
  placeholder,
  textarea,
  value,
}: FieldProps) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-[12px] font-semibold text-blueSite">
        {label}
        {optional ? (
          <span className="ms-1 font-normal text-[11px] text-textGrayColor">
            (Optional)
          </span>
        ) : null}
      </label>

      {textarea ? (
        <textarea
          defaultValue={value}
          placeholder={placeholder}
          className="min-h-[180px] w-full resize-none rounded-lg border border-grayBorder bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#B5B5B5] focus:border-blueSite"
        />
      ) : (
        <input
          defaultValue={value}
          placeholder={placeholder}
          className="h-12 w-full rounded-lg border border-grayBorder bg-white px-4 text-sm outline-none transition placeholder:text-[#B5B5B5] focus:border-blueSite"
        />
      )}
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  optional?: boolean;
  placeholder?: string;
};

export function ProviderSelectField({
  label,
  optional,
  placeholder,
}: SelectFieldProps) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-[12px] font-semibold text-blueSite">
        {label}
        {optional ? (
          <span className="ms-1 font-normal text-[11px] text-textGrayColor">
            (Optional)
          </span>
        ) : null}
      </label>

      <button
        type="button"
        className="flex h-12 w-full items-center justify-between rounded-lg border border-grayBorder bg-white px-4 text-sm text-[#B5B5B5] transition hover:border-blueSite"
      >
        <span>{placeholder}</span>
        <ChevronDown className="h-4 w-4 text-[#A3A3A3]" />
      </button>
    </div>
  );
}

type TagFieldProps = {
  label: string;
  tags: string[];
  placeholder?: string;
};

export function ProviderTagsField({
  label,
  tags,
  placeholder,
}: TagFieldProps) {
  return (
    <div className="w-full rounded-lg border border-grayBorder bg-white p-3">
      <label className="mb-2 block text-[12px] font-semibold text-blueSite">
        {label}
      </label>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-[#DDEEE8] px-3 py-1 text-[11px] font-medium text-blueSite"
          >
            {tag}
            <span className="text-[10px]">×</span>
          </span>
        ))}
      </div>

      {placeholder ? (
        <p className="mt-2 text-xs text-[#B5B5B5]">{placeholder}</p>
      ) : null}
    </div>
  );
}
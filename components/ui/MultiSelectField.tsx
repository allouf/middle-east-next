'use client';

import React, { useState, useEffect } from "react";
import useGetData from "@/lib/api/useGetData";
import { getLastSegment } from "@/lib/utils/helper";
import { Select, ConfigProvider } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { CaretDownOutlined } from "@ant-design/icons";

interface Option {
  id: string | number;
  name: string;
}

interface MultiSelectFieldProps {
  id: string;
  url?: string;
  onChange: (values: (string | number)[]) => void;
  values?: (string | number)[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  unstyled?: boolean;
  className?: string;
  withFieldset?: boolean;
  validate?: boolean;
  required?: boolean;
  formErrors?: Record<string, string>;
  selectorOptions?: Option[];
  name?: string;
  maxHeight?: string;
  isSubmited?: boolean;
  onSubmit?: boolean;
  handleAddError?: (id: string, value?: string) => void;
}

const MultiSelectField = ({
  id,
  url,
  onChange,
  values = [],
  label,
  disabled = false,
  unstyled = false,
  className = "",
  withFieldset = false,
  validate = false,
  required = false,
  isSubmited = false,
  onSubmit = false,
  formErrors,
  selectorOptions = [],
  name = "category_ids",
  handleAddError,
}: MultiSelectFieldProps) => {
  const { t } = useTranslation();

  const { data: apiData, loading } = url
    ? useGetData({ url })
    : { data: { data: selectorOptions }, loading: false } as any;

  const endpoint = url ? getLastSegment(url) : "";
  const options = Array.isArray(apiData?.data?.[endpoint])
    ? apiData.data[endpoint]
    : Array.isArray(apiData?.data)
      ? apiData.data
      : (selectorOptions || []);

  useEffect(() => {
    if (!required || !handleAddError) return;
    handleAddError(id, Array.isArray(values) && values.length > 0 ? "" : t("errorRequired"));
  }, [required, id, values, handleAddError, t]);

  const handleSelectChange = (newValues: (string | number)[]) => {
    onChange(newValues);
  };

  const shouldShowErrors = onSubmit ? isSubmited : (isSubmited || !!formErrors?.[id]);
  const hasError = validate && required && shouldShowErrors && values.length === 0;
  const fieldError = formErrors?.[id];

  const renderSelect = () => (
    <Select
      mode="multiple"
      id={id}
      value={values}
      onChange={handleSelectChange}
      placeholder={`${t("labels.select")} ${label}`}
      disabled={disabled}
      loading={loading}
      className={className}
      style={{ width: '100%' }}
      variant={unstyled ? "borderless" : "outlined"}
      suffixIcon={<CaretDownOutlined />}
      options={options.map((opt: Option) => ({ label: opt.name, value: opt.id }))}
      status={(hasError || (shouldShowErrors && fieldError)) ? "error" : undefined}
    />
  );

  return (
    <div key={id} className="relative w-full">
      {withFieldset ? (
        <ConfigProvider
          theme={{
            components: {
              Select: {
                selectorBg: 'transparent',
                activeBorderColor: 'transparent',
                hoverBorderColor: 'transparent',
              }
            }
          }}
        >
          <fieldset
            className={`py-2 px-4 border rounded-md relative transition-colors ${disabled ? "opacity-60 bg-gray-50" : "bg-white"} ${(hasError || (shouldShowErrors && fieldError)) ? "border-red-400" : "border-grayBorder"}`}
          >
            <legend className="px-2 text-blueSite font-semibold text-sm">{label}</legend>
            {renderSelect()}
          </fieldset>
        </ConfigProvider>
      ) : (
        <div className="w-full">
          {label && (
            <label className="block mb-1 text-sm font-medium text-subTitleColor">
              {label}
            </label>
          )}
          {renderSelect()}
        </div>
      )}

      {/* Hidden indexed inputs for backend compatibility */}
      {values.map((val, i) => (
        <input key={i} type="hidden" name={`${name}[${i}]`} value={val} />
      ))}

      {shouldShowErrors && validate && (fieldError || (required && values.length === 0)) && (
        <p className="text-red-500 text-xs mt-1">
          {fieldError || t("errorRequired")}
        </p>
      )}
    </div>
  );
};

export default MultiSelectField;


"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useGetData from "@/lib/api/useGetData";
import { getLastSegment } from "../../lib/utils/helper";
import { Select, ConfigProvider, Spin } from "antd";

type GalleryItem = {
  file_path?: string | null;
};

export type SelectOption = {
  id: string | number;
  name?: string | null;
  gallery?: GalleryItem[] | null;
  [key: string]: unknown;
};

type ApiResponseShape = {
  data?: unknown;
};

type Props = {
  id: string;
  url?: string | null;
  value?: string | number | null;
  label: string;
  enabled?: boolean | string;
  onChange: (value: string | number | null) => void;
  disabled?: boolean;
  unstyled?: boolean;
  className?: string;
  selectorOptions?: SelectOption[];
  allowClear?: boolean;
  clearLabel?: string;
  debounceMs?: number;
  filterOption?: boolean | ((input: string, option?: any) => boolean);
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function toOptionsFromUnknown(
  raw: unknown,
  endpoint: string,
  fallback: SelectOption[]
): SelectOption[] {
  if (Array.isArray(raw)) return raw as SelectOption[];

  if (isRecord(raw)) {
    const byEndpoint = endpoint ? raw[endpoint] : undefined;
    if (Array.isArray(byEndpoint)) return byEndpoint as SelectOption[];

    const firstKey = Object.keys(raw)[0];
    const maybe = firstKey ? raw[firstKey] : undefined;
    if (Array.isArray(maybe)) return maybe as SelectOption[];
  }

  return fallback;
}

const SelectFieldWithSearch: React.FC<Props> = ({
  id,
  url,
  value,
  label,
  onChange,
  disabled = false,
  unstyled = false,
  className = "",
  selectorOptions = [],
  allowClear = true,
  clearLabel,
  enabled = true,
  debounceMs = 300,
  filterOption,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const endpoint = useMemo(() => getLastSegment(url || "") || "", [url]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchValue), debounceMs);
    return () => clearTimeout(timer);
  }, [searchValue, debounceMs]);

  const { data: apiData, loading } = useGetData<ApiResponseShape>({
    url: url || null,
    enabled: !!enabled,
    extraParams: { search: debouncedSearch || undefined },
  } as any);

  const optionsData = useMemo<SelectOption[]>(() => {
    return toOptionsFromUnknown(apiData?.data, endpoint, selectorOptions);
  }, [apiData?.data, endpoint, selectorOptions]);

  const handleSelectChange = (val: any) => {
    onChange(val === undefined ? null : val);
  };

  const renderSelect = () => (
    <Select
      id={id}
      showSearch
      value={value === "" || value === undefined ? null : value}
      placeholder={`${t("labels.select")} ${label}`}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={filterOption !== undefined ? filterOption : !url}
      onSearch={(v) => setSearchValue(v)}
      onChange={handleSelectChange}
      notFoundContent={loading ? <Spin size="small" /> : null}
      disabled={disabled}
      allowClear={allowClear}
      className={className}
      style={{ width: '100%' }}
      variant={unstyled ? "borderless" : "outlined"}
      optionLabelProp="label"
    >
      {optionsData.map((item) => {
        const imgSrc =
          item?.gallery?.[0]?.file_path &&
            typeof item.gallery?.[0]?.file_path === "string"
            ? item.gallery[0].file_path
            : "https://placehold.co/40x40?text=P";

        return (
          <Select.Option key={String(item.id)} value={item.id} label={item.name}>
            <div className="flex items-center gap-3">
              <img
                src={imgSrc}
                alt={item?.name ? `${item.name} img` : "option img"}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="truncate">{item?.name ?? ""}</span>
            </div>
          </Select.Option>
        );
      })}
    </Select>
  );

  return (
    <div className="w-full">
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
        <fieldset className={`py-2 px-4 border rounded-md transition-colors ${disabled ? "opacity-60 bg-gray-50" : "bg-white"}`}>
          <legend className="px-2 text-blueSite font-semibold sm:text-sm text-[12px]">
            {label}
          </legend>
          {renderSelect()}
        </fieldset>
      </ConfigProvider>
    </div>
  );
};

export default SelectFieldWithSearch;


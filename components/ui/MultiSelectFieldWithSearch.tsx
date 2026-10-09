"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { useEffect, useState, useMemo } from "react";
import { getLastSegment } from "../../lib/utils/helper";
import useGetData from "../../lib/api/useGetData";
import { Select, ConfigProvider, Spin, Divider } from "antd";
import Pagination from "./Pagination";
import ErrorWithRetry from "./ErrorWithRetry";

// Type definitions
interface Option {
  id: string | number;
  name?: string;
  title?: string;
  gallery?: Array<{
    file_path?: string;
  }>;
  [key: string]: unknown;
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more?: boolean;
}

interface ApiResponse {
  data?: unknown;
  meta?: Meta;
}

interface MultiSelectFieldWithSearchProps {
  id: string;
  url?: string | null;
  values?: Array<string | number>;
  label: string;
  onChange: (values: Array<string | number>) => void;
  disabled?: boolean;
  unstyled?: boolean;
  className?: string;
  selectorOptions?: Option[];
  hideLabel?: boolean;
  required?: boolean;
  validate?: boolean;
  formErrors?: Record<string, string | undefined>;
  handleAddError?: (id: string, error?: string) => void;
  isSubmited?: boolean;
  onSubmit?: boolean;
  oldValue?: null;
  enabled?: boolean | string;
}

const MultiSelectFieldWithSearch = ({
  id,
  url,
  values = [],
  label,
  onChange,
  disabled = false,
  unstyled = false,
  className = "",
  selectorOptions = [],
  required = true,
  validate = true,
  formErrors = {},
  handleAddError,
  isSubmited = false,
  onSubmit = false,
  enabled
}: MultiSelectFieldWithSearchProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const { data: apiData, loading, error, refetch } = useGetData({
    url: url || undefined,
    enabled: !!enabled,
    extraParams: { search: searchValue },
    paginate: true,
    page: currentPage
  });

  const endpoint = useMemo(() => getLastSegment(url || "") || "", [url]);

  const options: Option[] = useMemo(() => {
    const data = apiData?.data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      if (endpoint && Array.isArray(data[endpoint])) {
        return data[endpoint];
      }

      const arrayKey = Object.keys(data).find(key => key !== 'meta' && Array.isArray(data[key]));
      if (arrayKey && Array.isArray(data[arrayKey])) {
        return data[arrayKey];
      }
    } else if (Array.isArray(data)) {
      return data;
    } else if (Array.isArray(apiData)) {
      return apiData;
    }
    return selectorOptions;
  }, [apiData, endpoint, selectorOptions]);

  const meta: Meta = apiData?.data?.meta || apiData?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    has_more: false,
  };

  useEffect(() => {
    if (!required || !handleAddError) return;
    handleAddError(id, Array.isArray(values) && values.length > 0 ? "" : t("errorRequired"));
  }, [required, id, values, handleAddError, t]);

  const handleSelectChange = (newValues: Array<string | number>) => {
    onChange(newValues);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const shouldShowErrors = onSubmit ? isSubmited : (isSubmited || !!formErrors?.[id]);
  const hasError = validate && required && shouldShowErrors && values.length === 0;
  const fieldError = formErrors?.[id];

  const renderSelect = () => (
    <Select
      mode="multiple"
      id={id}
      showSearch
      value={values.map(String)}
      placeholder={`${t("labels.select")} ${label}`}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={(v) => setSearchValue(v)}
      onChange={handleSelectChange}
      notFoundContent={loading ? <Spin size="small" /> : (error ? <ErrorWithRetry onRetry={refetch} /> : null)}
      disabled={disabled}
      className={className}
      style={{ width: '100%' }}
      variant={unstyled ? "borderless" : "outlined"}
      optionLabelProp="label"
      status={(hasError || (shouldShowErrors && fieldError)) ? "error" : undefined}
      dropdownRender={(menu) => (
        <div>
          {menu}
          {meta.last_page > 1 && (
            <>
              <Divider style={{ margin: '4px 0' }} />
              <div className="p-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={meta.last_page}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      )}
    >
      {options.map((item) => {
        const imgSrc = item?.gallery?.[0]?.file_path || "";
        const firstLetter = (item.name || item.title || "").charAt(0).toUpperCase();
        return (
          <Select.Option key={String(item.id)} value={String(item.id)} label={item.name || item.title}>
            <div className="flex items-center gap-3">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt="option img"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blueSite flex items-center justify-center text-white font-semibold text-sm">
                  {firstLetter}
                </div>
              )}
              <span className="truncate">{item.name || item.title}</span>
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
        <fieldset className={`py-2 px-4 border rounded-md transition-colors ${disabled ? "opacity-60 bg-gray-50" : "bg-white"} ${(hasError || (shouldShowErrors && fieldError)) ? "border-red-400" : "border-grayBorder"}`}>
          <legend className="px-2 text-blueSite font-semibold sm:text-sm text-[12px]">
            {label}
          </legend>
          {renderSelect()}
        </fieldset>
      </ConfigProvider>
      {shouldShowErrors && validate && (fieldError || (required && values.length === 0)) && (
        <p className="text-red-500 text-xs mt-1">
          {fieldError || t("errorRequired")}
        </p>
      )}
    </div>
  );
};

export default MultiSelectFieldWithSearch;


'use client';

import useGetData from "@/lib/api/useGetData";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getLastSegment } from "@/lib/utils/helper";
import { CaretDownOutlined } from "@ant-design/icons";
import { message, Select, ConfigProvider } from "antd";
import {
  useEffect,
  useState,
} from "react";

type SelectOption = {
  id: string | number;
  flag?: string;
  icon?: React.ReactNode;
  [key: string]: any;
};

interface SelectFieldProps {
  id: string;
  url?: string;
  onChange?: (value: any) => void;
  value?: string | number | null;
  label: string;
  disabled?: boolean;
  unstyled?: boolean;
  className?: string;
  withFieldset?: boolean;
  selectorOptions?: SelectOption[];
  hideLable?: boolean;
  error?: string;
  onMouseDown?: (event: any) => boolean | void;
  onClick?: (event: any) => boolean | void;
  validate?: boolean;
  required?: boolean;
  formErrors?: Record<string, string>;
  placeholder?: string;
  labelName?: string;
  disableMessage?: string;
  disableNote?: string;
  isSubmited?: boolean;
  onSubmit?: boolean;
  canHide?: boolean;
  handleAddError?: (id: string, message: string) => void;
  showSearch?: boolean;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  renderOption?: (option: SelectOption) => React.ReactNode;
  open?: boolean;
  onDropdownVisibleChange?: (open: boolean) => void;
}

const isSelectOptionArray = (value: unknown): value is SelectOption[] =>
  Array.isArray(value) &&
  value.every((item) => item && typeof item === "object" && "id" in item);

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  url,
  onChange,
  value,
  label,
  disabled = false,
  unstyled = false,
  className = "",
  withFieldset = false,
  selectorOptions = [],
  hideLable = false,
  error = "",
  validate = false,
  required = true,
  formErrors = {},
  placeholder,
  labelName = "name",
  isSubmited = false,
  onSubmit = false,
  handleAddError,
  disableMessage = "This Filed is Disabeld",
  disableNote = "This field is Disabeld",
  canHide = false,
  showSearch = false,
  dropdownRender,
  renderOption,
  open,
  onDropdownVisibleChange,
}) => {
  const [suppressError, setSuppressError] = useState(false);

  // لما يحصل submit جديد: رجّع عرض الأخطاء
  useEffect(() => {
    if (isSubmited) setSuppressError(false);
  }, [isSubmited]);

  const { data: apiData, loading } = useGetData<{ data?: unknown }>({
    url: url || undefined,
    enabled: !!url,
    extraParams:{
      paginate:false
    }
  });
  const endpoint = url ? getLastSegment(url) : null;
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const options: SelectOption[] = (() => {
    const dataPayload = (apiData as { data?: unknown } | null)?.data;

    if (
      endpoint &&
      isSelectOptionArray(
        (dataPayload as Record<string, unknown> | undefined)?.[endpoint]
      )
    ) {
      return (dataPayload as Record<string, unknown>)[endpoint] as SelectOption[];
    }

    if (isSelectOptionArray(dataPayload)) {
      return dataPayload;
    }

    return selectorOptions;
  })();

  const [selectedItem, setSelectedItem] = useState<SelectOption | null>(null);

  const shouldShowErrors = onSubmit ? isSubmited : (isSubmited || !!formErrors?.[id] || !!error);
  const fieldError = formErrors[id] || error;
  const hasError =
    !suppressError &&
    shouldShowErrors &&
    (fieldError || (validate && required && !value));

  const labelErrorStyle = hasError ? "text-red-500" : "text-blueSite";
  const placeholderText = (() => {
    const defaultPlaceholder = t("labels.select") + " " + label;
    const textToUse = placeholder || defaultPlaceholder;
    // Truncate to 20 characters if longer
    if (textToUse.length > 20) {
      return textToUse.substring(0, 25) + "...";
    }
    return textToUse;
  })();

  const selectValue = (() => {
    const val = value === undefined || value === null ? null : value;
    if (val === null) return null;

    const matchedById = options?.find((o) => String(o.id) === String(val));
    if (matchedById) return matchedById.id;

    const matchedByName = options?.find(
      (o) => String(o[labelName]) === String(val)
    );
    if (matchedByName) return matchedByName.id;

    return null;
  })();

  useEffect(() => {
    if (selectValue === undefined) {
      setSelectedItem(null);
      return;
    }

    const found = options?.find(
      (o) =>
        String(o.id) === String(selectValue) ||
        String(o[labelName]) === String(selectValue)
    );

    setSelectedItem(found || null);
  }, [selectValue, options, labelName]);


  useEffect(() => {
    if (!validate || !required || !handleAddError)
      return

    if (!value) {
      handleAddError(id, t("errorRequired"))
    } else {
      handleAddError(id, "")
    }
  }, [value, id, handleAddError, required, t, validate])

  const handleSelectChange = (val: any) => {
    setSuppressError(true);
    if (onChange) {
      onChange({ target: { value: val, name: id } } as any);
    }
  };

  const selectStyles = unstyled ? { width: '100%' } : { width: '100%' };

  const renderSelect = () => (
    <div className="flex items-center gap-2 w-full">
      {selectedItem?.flag && (
        <img
          src={selectedItem.flag}
          alt={String(selectedItem[labelName] ?? "")}
          className={withFieldset ? "w-14 h-8 object-cover rounded-sm" : "w-5 h-4 object-cover rounded-sm"}
        />
      )}
      {/* {selectedItem?.icon && (
        <div className="flex items-center justify-center shrink-0">
          {selectedItem.icon}
        </div>
      )} */}
      <div className="flex-1 relative">
        <Select
          id={id}
          value={selectValue}
          onChange={handleSelectChange}
          placeholder={placeholderText}
          allowClear={true}
          disabled={disabled}
          loading={loading}
          className={className + "!py-0"}
          style={selectStyles}
          variant={unstyled || withFieldset ? "borderless" : "outlined"}
          status={hasError ? "error" : undefined}
          suffixIcon={<CaretDownOutlined />}
          showSearch={showSearch}
          open={open}
          onOpenChange={onDropdownVisibleChange}
          popupRender={dropdownRender}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
          filterOption={(input, option) => {
            if (!showSearch) return true;
            const opt = options?.find(o => String(o.id) === String(option?.value));
            if (opt) {
              return String(opt[labelName] || "").toLowerCase().includes(input.toLowerCase());
            }
            return false;
          }}
        >
          {Array.isArray(options) &&
            options.map((item) => (
              <Select.Option key={item.id} value={item.id} label={item[labelName]}>
                {renderOption ? (
                  renderOption(item)
                ) : (
                  <div className="flex items-center gap-2">
                    {item.flag && <img src={item.flag} className="w-5 h-3 object-cover" alt="" />}
                    {item[labelName]}
                  </div>
                )}
              </Select.Option>
            ))}
        </Select>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blueSite border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {!(canHide && options?.length === 0) &&
        <div className="relative">
          {contextHolder}
          {withFieldset ? (
            <fieldset
              title={disabled ? disableNote : undefined}
              onClick={() => {
                if (disabled && disableMessage) {
                  messageApi.error(disableMessage);
                }
              }}
              className={`
            px-3 py-2 gap-1 border border-blueSite rounded-lg transition-colors
            ${hasError ? "border-red-400" : "border-grayBorder"}
            ${disabled ? "opacity-60 bg-gray-50" : "bg-white"}
          `}
            >
              <legend
                className={`px-2 text-blueSite font-semibold text-sm ${labelErrorStyle}`}
              >
                {label}
              </legend>
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
                {renderSelect()}
              </ConfigProvider>
            </fieldset>
          ) : (
            <>
              {!hideLable && (
                <label
                  className={`block mb-1 text-sm font-medium ${hasError ? "text-red-500" : "text-subTitleColor"
                    }`}
                >
                  {label}
                </label>
              )}
              {renderSelect()}
            </>
          )}
          {hasError && (
            <p className="text-red-500 text-xs mt-1">
              {fieldError || t("errorRequired")}
            </p>
          )}
        </div>}
    </>
  );
};

export default SelectField;

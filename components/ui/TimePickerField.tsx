'use client';

import React, { useMemo, useCallback } from 'react';
import { TimePicker, ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { motion } from 'framer-motion';

dayjs.extend(customParseFormat);

type Props = {
  id: string;
  label: string;
  placeholder?: string;
  value?: string | null; // expected "HH:mm"
  onChange: (value: string) => void;

  required?: boolean;
  error?: string;

  unstyled?: boolean;
  className?: string;

  disabled?: boolean;
  isSubmited?: boolean;
  onSubmit?: boolean;
};

const TimePickerField: React.FC<Props> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  unstyled = false,
  className = '',
  disabled = false,
  isSubmited = false,
  onSubmit = false,
}) => {
  const { t } = useTranslation();

  const parsedValue = useMemo<Dayjs | null>(
    () => (value ? dayjs(value, 'HH:mm') : null),
    [value]
  );

  const handleTimeChange = useCallback((time: Dayjs | null) => {
    if (!time) {
      onChange('');
      return;
    }
    // Maintain HH:mm for backend/state compatibility while displaying in 12hr
    const formatted = time.format('HH:mm');
    onChange(formatted);
  }, [onChange]);

  const shouldShowErrors = onSubmit ? isSubmited : (isSubmited || !!error);
  const hasError = shouldShowErrors && (error || (required && !value));

  const renderError = () => {
    const errorMessage = error || (required && !value ? t("errors.required") : null);
    if (!shouldShowErrors || !errorMessage) return null;

    return (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-xs mt-1"
      >
        {errorMessage}
      </motion.p>
    );
  };

  const renderPicker = () => (
    <TimePicker
      id={id}
      value={parsedValue}
      onChange={handleTimeChange}
      use12Hours
      format="h:mm a"
      showNow={false}
      placeholder={placeholder || t('labels.selectTime')}
      disabled={disabled}
      className={`w-full ${className}`}
      variant="borderless" // Always borderless as we handle borders via fieldset or want it clean
      status={hasError ? "error" : undefined}
      allowClear={!required}
    />
  );

  return (
    <div className="flex flex-col w-full">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#00664f', // blueSite primary color
            colorLink: '#00664f',
          },
          components: {
            DatePicker: {
              activeBorderColor: 'transparent',
              hoverBorderColor: 'transparent',
            }
          }
        }}
      >
        {!unstyled ? (
          <fieldset
            className={`
            py-2 px-4 border rounded-lg transition-colors
            ${hasError ? "border-red-400" : "border-grayBorder"}
            ${disabled ? "opacity-60 bg-gray-50" : "bg-white"}
          `}
          >
            <legend className="px-2 text-blueSite font-semibold text-sm">
              {label}
            </legend>
            {renderPicker()}
          </fieldset>
        ) : (
          <div className="flex flex-col w-full">
            {label && (
              <label htmlFor={id} className="block text-sm font-medium text-textGrayColor mb-1">
                {label}
              </label>
            )}
            {renderPicker()}
          </div>
        )}
      </ConfigProvider>
      {renderError()}
    </div>
  );
};

export default TimePickerField;

'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Eye, EyeClosed, X, UploadCloud, Paperclip } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  Input,
  Button,
  Tag,
  ConfigProvider,
  Upload
} from 'antd';
import { defaultConditions, getSchemaByType } from '@/lib/schemas/formSchemas';
import { useTranslation } from '@/lib/i18n/useTranslation';

type MultiInputType = 'text' | 'textarea' | 'phone' | 'password' | 'email' | 'url' | 'number'|'file';

type Conditions = Record<string, any>;

type Props = {
  id: string;
  label: string;

  type?: MultiInputType;
  required?: boolean;

  className?: string;
  placeholder?: string;

  values?: any[];
  onChange: (next: any[]) => void;

  disabled?: boolean;
  unstyled?: boolean;
  withFieldset?: boolean;

  validate?: boolean;
  handleAddError?: (id: string, message?: string) => void;
  formErrors?: Record<string, string | undefined>;
  conditions?: Conditions;
  isSubmited?: boolean;
  onSubmit?: boolean;
  showList?: boolean;
};

const MultiInputField: React.FC<Props> = ({
  id,
  label,
  type = 'text',
  required = false,
  className = '',
  values = [],
  onChange,
  disabled = false,
  unstyled = false,
  placeholder = '',
  withFieldset = false,
  validate = false,
  handleAddError,
  formErrors = {},
  conditions = {},
  isSubmited = false,
  onSubmit = false,
  showList = true,
}) => {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();

  const isTextarea = type === 'textarea';
  const isPhoneNumber = type === 'phone';
  const isPassword = type === 'password';
  const isFile = type === 'file';

  const mergedConditions: Record<string, any> = useMemo(() => ({ ...defaultConditions, ...conditions }), [conditions]);
  const activeConds = mergedConditions[type] || mergedConditions.text;

  const runValidation = useCallback(
    (fieldValue: string) => {
      if (!validate || !fieldValue) {
        setError('');
        return true;
      }

      try {
        const schema = getSchemaByType(type, activeConds);
        schema.parse(type === 'number' ? Number(fieldValue) : fieldValue);
        setError('');
        return true;
      } catch (err: unknown) {
        if (err) {
          try {
            const parsed = JSON.parse(String(err));
            setError(parsed[0]?.message || t("errors.invalidValue"));
          } catch {
            setError(t("errors.invalidValue"));
          }
        }
        return false;
      }
    },
    [validate, type, activeConds, t]
  );

  const handleChangeData = useCallback(
    (val: string) => {
      if (disabled) return;
      setValue(val);
      if (error) setError('');
    },
    [disabled, error]
  );

  const handleAddValue = useCallback(() => {
    if (disabled) return;
    if (!value) return;

    if (runValidation(value)) {
      const nextValues = [...(values || []), value];
      onChange(nextValues);
      setValue('');
      setError('');
    }
  }, [disabled, onChange, value, values, runValidation]);

  const handleRemoveValue = useCallback(
    (valToRemove: string) => {
      if (disabled) return;
      const updated = (values || []).filter((v) => v !== valToRemove);
      onChange(updated);
    },
    [disabled, onChange, values]
  );

  // Field-level required validation
  useEffect(() => {
    if (!validate || !required || !handleAddError) return;
    if (values.length === 0) {
      handleAddError(id, t('errorRequired'));
    } else {
      handleAddError(id, '');
    }
  }, [values, required, validate, handleAddError, id, t]);

  const hasValues = Array.isArray(values) && values.length > 0;
  const shouldShowErrors =onSubmit? isSubmited :false ;

  const fieldError = formErrors[id];
  const showRequiredError = shouldShowErrors && !hasValues && (fieldError || required);
  const showValidationError = !!error;

  const renderInput = () => {
    if (isTextarea) {
      return (
        <Input.TextArea
          id={id}
          value={value}
          onChange={(e) => handleChangeData(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          variant={unstyled ? "borderless" : "outlined"}
          autoSize={{ minRows: 1, maxRows: 4 }}
          className="flex-1"
        />
      );
    }

    if (isPhoneNumber) {
      return (
        <div className="flex-1">
          <PhoneInput
            country={'us'}
            value={value}
            onChange={(v: string) => handleChangeData(v)}
            containerClass="!border-0 !shadow-none !outline-none !py-0"
            inputClass="!w-full !py-0 !rounded-xl !border-0 !pl-12 !ml-1 !bg-transparent"
            buttonClass="!border-0 !border-r-2 !border-blueSite !pr-1 !bg-transparent"
            disabled={disabled}
          />
        </div>
      );
    }

    if (isPassword) {
      return (
        <Input.Password
          id={id}
          value={value}
          onChange={(e) => handleChangeData(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          variant={unstyled ? "borderless" : "outlined"}
          className="flex-1"
          iconRender={(visible) => (visible ? <Eye size={20} className="text-blueSite" /> : <EyeClosed size={20} className="text-blueSite" />)}
        />
      );
    }

    if (isFile) {
      return (
        <div className="w-full">
          <Upload.Dragger
            multiple
            beforeUpload={() => false}
            fileList={
              values.map((v: any, i: number) => {
                if (v && v.uid && v.raw_value !== undefined) return v;
                return {
                  uid: v?.id || v?.uid || `file_uid_${i}`,
                  name: v?.name || (typeof v === 'string' ? v.split('/').pop() || v : 'file'),
                  status: 'done',
                  originFileObj: v instanceof File ? v : undefined,
                  raw_value: v,
                };
              })
            }
            onChange={(info) => {
              const next = info.fileList.map((f: any) => f.raw_value !== undefined ? f.raw_value : (f.originFileObj || f));
              onChange(next);
            }}
            onRemove={() => false}
            itemRender={(originNode, file, fileList, actions) => {
              const displayName = file.name.length > 50 ? `${file.name.slice(0, 50)}...` : file.name;
              return (
                <div className="flex items-center justify-between gap-2 p-1 hover:bg-gray-50 rounded group mt-1 w-full min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 flex-1 min-w-0 px-2 overflow-hidden">
                    <Paperclip size={16} className="text-[#8b9dbb] shrink-0" />
                    <span className="text-sm text-gray-600 truncate block text-left" title={file.name}>
                      {displayName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const index = fileList.indexOf(file);
                      if (index !== -1) {
                        const nextValues = values.filter((_, i) => i !== index);
                        onChange(nextValues);
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 mr-2 z-10 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            }}

            showUploadList={showList ? { showRemoveIcon: false } : false}
            disabled={disabled}
            className="bg-transparent border-0"
            style={{ padding: '10px 0', border: 'none', background: 'transparent' }}
          >
            <p className="ant-upload-drag-icon flex justify-center text-[#8b9dbb] mb-2">
              <UploadCloud size={40} />
            </p>
            <p className="ant-upload-text text-sm mb-1">
              <span className="text-[#00664f] font-semibold underline mr-1">{t('imageUpload.addFile', 'Upload a file')}</span> 
              <span className="text-gray-500">{t('imageUpload.orDragAndDropFiles', 'or drag and drop files')}</span>
            </p>
            <p className="ant-upload-hint text-xs text-gray-400">
              {t('common.fileTypes', 'PNG, JPG, PDF up to 5MB')}
            </p>
          </Upload.Dragger>
        </div>
      );
    }

    return (
      <Input
        id={id}
        type={type === 'number' ? 'number' : type}
        value={value}
        onChange={(e) => handleChangeData(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        variant={unstyled ? "borderless" : "outlined"}
        className="flex-1"
      />
    );
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {withFieldset ? (
          <fieldset
            className={`border rounded-lg p-2 transition-colors overflow-hidden ${disabled ? 'opacity-60 bg-gray-50' : 'bg-white'} ${showRequiredError ? 'border-red-400' : 'border-grayBorder'} ${isFile ? 'border-dashed border-2' : ''}`}
          >
            <legend className={`px-2 font-semibold text-sm ${isFile ? 'text-[#00664f]' : 'text-blueSite'}`}>{label}</legend>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 w-full px-2">
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#00664f',
                    },
                    components: {
                      Input: {
                        activeBorderColor: 'transparent',
                        hoverBorderColor: 'transparent',
                      }
                    }
                  }}
                >
                  {renderInput()}
                  {!isFile && (
                    <Button
                      type="primary"
                      onClick={handleAddValue}
                      disabled={disabled || !value}
                    >
                      {t('common.add')}
                    </Button>
                  )}
                </ConfigProvider>
              </div>

              {hasValues && !isFile && (
                <div className="flex flex-wrap gap-2 px-2 pb-1">
                  {values.map((val, index) => (
                    <Tag
                      key={`${val}-${index}`}
                      closable
                      onClose={() => handleRemoveValue(val)}
                      closeIcon={<X size={14} className="mt-1" />}
                      className="flex items-center gap-1 bg-[#E6F0ED] text-blueSite border-blueSite rounded-full px-3 py-1"
                    >
                      {val}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          </fieldset>
        ) : (
          <div className="flex flex-col gap-1 overflow-hidden">
            {label && (
              <label htmlFor={id} className="block text-sm font-medium text-subTitleColor">
                {label}
              </label>
            )}
            <div className="flex items-center gap-2 w-full">
              {renderInput()}
              {!isFile && (
                <Button
                  type="primary"
                  onClick={handleAddValue}
                  disabled={disabled || !value}
                  className="bg-blueSite hover:bg-blueSiteHover"
                >
                  {t('common.add')}
                </Button>
              )}
            </div>
            {hasValues && !isFile && (
              <div className="flex flex-wrap gap-2 mt-2">
                {values.map((val, index) => (
                  <Tag
                    key={`${val}-${index}`}
                    closable
                    onClose={() => handleRemoveValue(val)}
                    closeIcon={<X size={14} className="mt-1" />}
                    className="flex items-center gap-1 bg-[#E6F0ED] text-blueSite border-blueSite rounded-full px-3 py-1"
                  >
                    {val}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showValidationError ? (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      ) :
       showRequiredError ? (
        <p className="text-red-500 text-xs mt-1">{fieldError || t('errorRequired')}</p>
      ) : null}
    </div>
  );
};

export default memo(MultiInputField);


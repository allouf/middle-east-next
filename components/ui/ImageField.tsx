"use client";

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, Eye, Upload, Image as ImageIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";

type ImageFieldValue = string | File | null | undefined;

interface ImageFieldProps {
  id: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  unstyled?: boolean;
  placeholder?: string;

  /** Can be File (new), string (existing url), or null */
  value?: ImageFieldValue;

  /** Same name you used before */
  image_path?: string | null | undefined;

  /** Return file or null (remove) */
  onChange?: (file: File | null) => void;

  withFieldset?: boolean;

  /** For InputField-like errors */
  validate?: boolean;
  formErrors?: Record<string, string>;
  isSubmited?: boolean;
  showErrorMessage?: boolean;
  onSubmit?: boolean;
  error?: string;

  /** File input options */
  accept?: string;
}

const ImageField: React.FC<ImageFieldProps> = ({
  id,
  label,
  required = false,
  disabled = false,
  unstyled = false,
  placeholder = "",
  value,
  image_path,
  onChange,
  withFieldset = false,

  validate = false,
  formErrors = {},
  isSubmited = false,
  showErrorMessage = false,
  onSubmit = false,
  error,

  accept = "image/*",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  // -----------------------------
  // Preview URL (safe + revoke)
  // -----------------------------
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const externalUrl = useMemo(() => {
    // priority: value string > image_path
    if (typeof value === "string" && value.trim()) return value;
    if (image_path && String(image_path).trim()) return String(image_path);
    return "";
  }, [value, image_path]);

  // When value is a File, create object URL
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    // If string url or empty, just set it
    setPreviewUrl(externalUrl || "");
  }, [value, externalUrl]);

  // -----------------------------
  // Errors (InputField-like)
  // -----------------------------
  const shouldShowErrors = isSubmited || showErrorMessage;

  const hasValidationError = validate && !!formErrors?.[id];
  const hasRequiredError = shouldShowErrors && required && !previewUrl;

  const hasError = !!error || hasValidationError || hasRequiredError;

  const getErrorMessage = () => {
    if (error) return error;
    if (onSubmit) {
      if (hasValidationError && isSubmited) return formErrors[id];
      if (hasRequiredError && isSubmited) return  t("errors.required");
      return null;
    }
    if (hasValidationError) return formErrors[id];
    if (hasRequiredError) return  t("errors.required");
    return null;
  };

  const errorMessage = getErrorMessage();

  const borderClass = useMemo(() => {
    if (!withFieldset) return "";
    if (onSubmit) return hasError && isSubmited ? "border-red-400" : "border-grayBorder";
    return hasError ? "border-red-400" : "border-grayBorder";
  }, [withFieldset, onSubmit, hasError, isSubmited]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const openPicker = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const clearFile = useCallback(() => {
    if (disabled) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange?.(null);
    setPreviewUrl(externalUrl || "");
  }, [disabled, onChange, externalUrl]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      onChange?.(file);
    },
    [onChange]
  );

  const labelText = label || placeholder || id;

  const renderError = () => {
    if (!errorMessage) return null;
    return (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1 text-xs text-red-500"
      >
        {errorMessage}
      </motion.p>
    );
  };

  const Preview = () => (
    <div className="flex items-center gap-3 min-w-0">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-white">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <ImageIcon className="h-5 w-5 text-blueSite" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-zinc-700">
        {previewUrl
          ? t("formBuilder.imageField.selected")
          : t("formBuilder.imageField.notSelected")}
      </div>

      <div className="truncate text-xs text-zinc-400">
        {disabled
          ? t("formBuilder.imageField.viewOnly")
          : t("formBuilder.imageField.clickToUpload")}
      </div>
      </div>
    </div>
  );

  const Actions = () => (
    <div className="flex items-center gap-2">
      {previewUrl && (
        <>
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50"
            aria-label="View"
          >
            <Eye className="h-4 w-4 text-blueSite" />
          </a>

          <a
            href={previewUrl}
            download
            className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50"
            aria-label="Download"
          >
            <Download className="h-4 w-4 text-blueSite" />
          </a>
        </>
      )}

      {!disabled && (
        <>
          {previewUrl && (
            <button
              type="button"
              onClick={clearFile}
              className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50"
              aria-label="Remove"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
          )}

          <button
            type="button"
            onClick={openPicker}
            className="grid h-9 w-9 place-items-center rounded-lg bg-blueSite text-white hover:opacity-90 disabled:opacity-60"
            disabled={disabled}
            aria-label="Upload"
          >
            <Upload className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );

  const hiddenInput = (
    <input
      ref={fileInputRef}
      id={id}
      name={id}
      type="file"
      accept={accept}
      className="hidden"
      onChange={handleFileChange}
      disabled={disabled}
      required={required}
    />
  );

  // -----------------------------
  // Fieldset (InputField-like)
  // -----------------------------
  if (withFieldset) {
    return (
      <div className="flex w-full flex-col">
        <fieldset
          className={`
            py-2 px-4 border rounded-lg transition-colors min-w-0
            ${borderClass}
            ${disabled ? "opacity-60 bg-gray-50" : "bg-white"}
          `}
        >
          {labelText && (
            <legend className="px-2 text-blueSite font-semibold text-sm">
              {labelText}
              {required && <span className="text-red-500 ms-1">*</span>}
            </legend>
          )}

          <div className="flex items-center justify-between gap-3">
            <Preview />
            <Actions />
          </div>

          {hiddenInput}
        </fieldset>

        <AnimatePresence>{renderError()}</AnimatePresence>
      </div>
    );
  }

  // -----------------------------
  // Non-fieldset layout
  // -----------------------------
  return (
    <div className="flex w-full flex-col">
      {labelText && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-textGrayColor">
          {labelText}
          {required && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}

      <div
        className={`
          flex items-center justify-between gap-3 rounded-lg border px-4 py-2
          ${hasError ? "border-red-400" : "border-grayBorder"}
          ${disabled ? "opacity-60 bg-gray-50" : "bg-white"}
          ${unstyled ? "border-transparent px-0" : ""}
        `}
      >
        <Preview />
        <Actions />
      </div>

      {hiddenInput}
      <AnimatePresence>{renderError()}</AnimatePresence>
    </div>
  );
};

export default memo(ImageField);
'use client';

import React, { useCallback, useState, ChangeEvent } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  defaultConditions,
  getSchemaByType,
} from "@/lib/schemas/formSchemas";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { MdEmail, MdPhone } from "react-icons/md";
import type { ChangeInput } from "@/lib/Hooks/useFormData";

// ==================== TYPES ====================

type ContactType = 'email' | 'phone';

interface ValidationConditions {
  contact?: {
    min?: number;
    message?: string;
  };
  text?: {
    min?: number;
    message?: string;
  };
}

interface ContactFieldProps {
  /** Unique identifier for the field */
  id: string;
  /** Label text for the field */
  label?: string;
  /** Field type - defaults to 'contact' */
  type?: 'contact' | 'email' | 'phone';
  /** Whether the field is required */
  required?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Current field value */
  value?: string;
  /** Change handler - compatible with useFormData */
  onChange: (e: ChangeInput) => void;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Use unstyled input */
  unstyled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Enable validation */
  validate?: boolean;
  /** Error handler callback */
  handleAddError?: (id: string, error: string) => void;
  /** Form errors object */
  formErrors?: Record<string, string>;
  /** Is this a login form (affects label text) */
  isLogIn?: boolean;
  /** Validation conditions */
  conditions?: ValidationConditions;
  /** Use fieldset wrapper */
  withFieldset?: boolean;
  /** Default contact type */
  defaultContactType?: ContactType;
  /** Show errors only after form submission attempt */
  isSubmitted?: boolean;
  /** Show error messages (alias for isSubmitted) */
  showErrorMessage?: boolean;
}

// ==================== COMPONENT ====================

const ContactField: React.FC<ContactFieldProps> = ({
  id,
  label,
  type = "contact",
  required = false,
  className = "",
  value = "",
  onChange,
  disabled = false,
  unstyled = false,
  placeholder = "",
  validate = false,
  handleAddError,
  formErrors = {},
  isLogIn = false,
  conditions = {},
  withFieldset = true,
  defaultContactType = "email",
  isSubmitted = false,
  showErrorMessage = false,
}) => {
  // Combine both props - show errors if either is true
  const shouldShowErrors = isSubmitted || showErrorMessage;
  const { t } = useTranslation();
  const [contactType, setContactType] = useState<ContactType>(defaultContactType);

  const baseStyles = unstyled
    ? "bg-transparent focus:outline-none w-full text-textColor"
    : "w-full px-3 py-2 border-0 border-b-2 border-dashed border-grayBorder focus:outline-none focus:ring-0 focus:border-blueSite bg-transparent text-textColor";

  const mergedConditions = { ...defaultConditions, ...conditions };
  const activeConds = mergedConditions.contact || mergedConditions.text || { min: 1 };

  // Validation
  const runValidation = useCallback(
    (fieldValue: string) => {
      if (!handleAddError) return;

      // Check required first
      if (required && !fieldValue) {
        handleAddError(id, t("errors.required"));
        return;
      }

      // Skip schema validation if not enabled or value is empty (and not required)
      if (!validate || !fieldValue) {
        handleAddError(id, "");
        return;
      }

      try {
        const schema = getSchemaByType(contactType, activeConds);
        schema.parse(fieldValue);
        handleAddError(id, "");
      } catch (err: unknown) {
        if (err) {
          try {
            const parsed = JSON.parse(String(err));
            handleAddError(id, parsed[0]?.message || t("errors.invalidValue"));
          } catch {
            handleAddError(id, t("errors.invalidValue"));
          }
        }
      }
    },
    [activeConds, validate, required, id, handleAddError, contactType, t]
  );

  // Handle input changes
  const handleChangeData = useCallback((e: string | ChangeEvent<HTMLInputElement>) => {
    if (contactType === "phone") {
      // Phone input returns string directly
      const phoneValue = typeof e === 'string' ? e : '';
      const syntheticEvent = { target: { value: phoneValue } };
      onChange(syntheticEvent);
      runValidation(phoneValue);
    } else {
      // Email input returns event
      const event = e as ChangeEvent<HTMLInputElement>;
      const val = event.target.value;
      onChange(event);
      runValidation(val);
    }
  }, [contactType, onChange, runValidation]);

  // Toggle contact type
  const toggleContactType = useCallback(() => {
    if (disabled) return;
    setContactType((prev) => (prev === "email" ? "phone" : "email"));
    // Clear the value when switching
    onChange({ target: { value: "" } });
    if (handleAddError) {
      handleAddError(id, "");
    }
  }, [disabled, onChange, handleAddError, id]);

  // Get label text
  const getLabelText = () => {
    if (label) return label;
    return contactType === "email"
      ? t("labels.email")
      : t("labels.phone");
  };

  // Get placeholder text
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return contactType === "email"
      ? t("placeholders.email")
      : t("placeholders.phone");
  };

  // Show validation errors immediately, but required errors only after submission
  const hasValidationError = validate && !!formErrors[id];
  const hasRequiredError = shouldShowErrors && required && !value;
  const hasError = hasValidationError || hasRequiredError;

  // For border styling - only show error border when error is visible
  const showErrorBorder = hasValidationError || hasRequiredError;

  // Input content
  const renderInput = () => (
    <AnimatePresence mode="wait">
      {contactType === "phone" ? (
        <motion.div
          key="phone-input"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full"
        >
          <PhoneInput
            value={value?.replace("+", "") || ""}
            onChange={(phone) => handleChangeData(phone)}
            country="sy"
            containerClass="!border-0 !shadow-none !outline-none"
            inputClass="!w-full !py-1 !rounded-none !border-0 !pl-12 !bg-transparent !text-textColor"
            buttonClass="!border-0 !border-r !border-grayBorder !bg-transparent"
            disabled={disabled}
            containerStyle={{ direction: "ltr" }}
            inputStyle={{
              fontSize: '16px',
              height: '36px',
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="email-input"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full"
        >
          <input
            id={id}
            name={id}
            type="email"
            value={value}
            required={required}
            onChange={handleChangeData}
            placeholder={getPlaceholder()}
            className={`${baseStyles} ${className}`}
            disabled={disabled}
            autoComplete="email"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Toggle switch
  const renderToggle = () => (
    <div className="flex items-center gap-3 mt-2">
      <button
        type="button"
        onClick={toggleContactType}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
          ${contactType === "phone" ? "bg-blueSite" : "bg-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        aria-label={t("buttons.toggleContactType")}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200
            ${contactType === "phone" ? "translate-x-5" : "translate-x-0.5"}
          `}
        />
      </button>

      <div className="flex items-center gap-2 text-sm text-textGrayColor">
        <span className={`flex items-center gap-1 ${contactType === "email" ? "text-blueSite font-medium" : ""}`}>
          <MdEmail className="text-base" />
          {t("labels.email")}
        </span>
        <span className="text-gray-400">/</span>
        <span className={`flex items-center gap-1 ${contactType === "phone" ? "text-blueSite font-medium" : ""}`}>
          <MdPhone className="text-base" />
          {t("labels.phone")}
        </span>
      </div>
    </div>
  );

  // Get error message
  const getErrorMessage = (): string | null => {
    if (hasValidationError) {
      return formErrors[id];
    }
    if (hasRequiredError) {
      return t("errors.required");
    }
    return null;
  };

  // Error message
  const renderError = () => {
    const errorMessage = getErrorMessage();
    if (!errorMessage) return null;

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

  // With fieldset wrapper
  if (withFieldset) {
    return (
      <div className="w-full">
        <fieldset
          className={`
            min-h-[70px] py-2 px-4 border rounded-lg transition-colors
            ${showErrorBorder ? "border-red-400" : "border-grayBorder"}
            ${disabled ? "opacity-60 bg-gray-50" : "bg-white"}
          `}
        >
          <legend className="px-2 text-blueSite font-semibold text-sm">
            {getLabelText()}
            {/* {required && <span className="text-red-500 ms-1">*</span>} */}
          </legend>
          {renderInput()}
        </fieldset>
        {renderToggle()}
        {renderError()}
      </div>
    );
  }

  // Without fieldset
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-textColor mb-1">
          {getLabelText()}
          {required && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}
      {renderInput()}
      {renderToggle()}
      {renderError()}
    </div>
  );
};

export default ContactField;

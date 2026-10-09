"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import useFormData from "@/lib/Hooks/useFormData";

// Quote form state interface
export interface QuoteFormState {
  proposed_budget: string;
  estimated_delivery_date: string;
  cover_letter_or_message: string;
}

// Quote form errors interface
export interface QuoteFormErrors {
  proposed_budget?: string;
  estimated_delivery_date?: string;
  cover_letter_or_message?: string;
  [key: string]: string | undefined;
}

interface UseQuoteFormArgs {
  initial?: Partial<QuoteFormState>;
  required?: {
    proposed_budget?: boolean;
    estimated_delivery_date?: boolean;
    cover_letter_or_message?: boolean;
  };
}

export function useQuoteForm(args: UseQuoteFormArgs = {}) {
  const initialState: QuoteFormState = useMemo(
    () => ({
      proposed_budget: args.initial?.proposed_budget ?? "",
      estimated_delivery_date: args.initial?.estimated_delivery_date ?? "",
      cover_letter_or_message: args.initial?.cover_letter_or_message ?? "",
    }),
    [args.initial]
  );

  const { formData, setFormData, handleChange, resetForm: resetFormData, isValid } =
    useFormData<QuoteFormState>(initialState);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<QuoteFormErrors>({});

  // Update form data when initial data changes
  useEffect(() => {
    if (args.initial && Object.keys(args.initial).length > 0) {
      const transformedData: QuoteFormState = {
        proposed_budget: args.initial?.proposed_budget ?? "",
        estimated_delivery_date: args.initial?.estimated_delivery_date ?? "",
        cover_letter_or_message: args.initial?.cover_letter_or_message ?? "",
      };
      setFormData(transformedData);
    }
  }, [args.initial, setFormData]);

  // Validate form whenever formData changes
  useEffect(() => {
    validate();
  }, [formData]);

  const clearError = useCallback((key: keyof QuoteFormErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }, [errors]);

  const createFieldSetter = useCallback(<K extends keyof QuoteFormState>(
    field: K
  ) => {
    return (value: QuoteFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as keyof QuoteFormErrors);
    };
  }, [setFormData, clearError]);

  const createFieldSetterWithValidation = useCallback(<K extends keyof QuoteFormState>(
    field: K,
    validateImmediately = false
  ) => {
    return (value: QuoteFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as keyof QuoteFormErrors);
      
      if (validateImmediately && isSubmitted) {
        validate();
      }
    };
  }, [setFormData, clearError, isSubmitted]);

  const fieldSetters = useMemo(() => ({
    setProposedBudget: createFieldSetterWithValidation("proposed_budget", true),
    setEstimatedDeliveryDate: createFieldSetterWithValidation("estimated_delivery_date", true),
    setCoverLetterOrMessage: createFieldSetterWithValidation("cover_letter_or_message", true),
  }), [createFieldSetterWithValidation]);

  const validate = useCallback((): boolean => {
    const newErrors: QuoteFormErrors = {};
    const req = { 
      proposed_budget: true, 
      estimated_delivery_date: true, 
      cover_letter_or_message: true,
      ...args.required 
    };

    // Proposed budget validation
    if (req.proposed_budget && !formData.proposed_budget?.trim()) {
      newErrors.proposed_budget = "Proposed budget is required";
    } else if (formData.proposed_budget && (isNaN(Number(formData.proposed_budget)) || Number(formData.proposed_budget) <= 0)) {
      newErrors.proposed_budget = "Proposed budget must be a valid positive number";
    }

    // Estimated delivery date validation
    if (req.estimated_delivery_date && !formData.estimated_delivery_date?.trim()) {
      newErrors.estimated_delivery_date = "Estimated delivery date is required";
    } else if (formData.estimated_delivery_date) {
      const deliveryDate = new Date(formData.estimated_delivery_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(deliveryDate.getTime())) {
        newErrors.estimated_delivery_date = "Please enter a valid date";
      } else if (deliveryDate < today) {
        newErrors.estimated_delivery_date = "Delivery date cannot be in the past";
      }
    }

    // Cover letter validation
    if (req.cover_letter_or_message && !formData.cover_letter_or_message?.trim()) {
      newErrors.cover_letter_or_message = "Cover letter or message is required";
    } else if (formData.cover_letter_or_message && formData.cover_letter_or_message.length < 10) {
      newErrors.cover_letter_or_message = "Cover letter must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, args.required]);

  const resetForm = useCallback(() => {
    resetFormData();
    setErrors({});
    setIsSubmitted(false);
  }, [resetFormData]);

  const preparePayload = useCallback(() => {
    return {
      proposed_budget: Number(formData.proposed_budget),
      estimated_delivery_date: formData.estimated_delivery_date,
      cover_letter_or_message: formData.cover_letter_or_message,
    };
  }, [formData]);

  return {
    // Form state
    formData,
    errors, 
    isSubmitted,
    isValid,
    setIsSubmitted,
    
    // Form handlers
    handleChange,
    validate,
    resetForm,
    preparePayload,
    
    // Field setters
    ...fieldSetters,
  };
}

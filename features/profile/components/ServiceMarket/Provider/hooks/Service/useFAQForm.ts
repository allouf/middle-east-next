"use client";

import { useCallback, useEffect, useState } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import { useFaqApi } from "./useFaqApi";

export interface FAQFormState {
  question: string;
  answer: string;
  sort_order?: number;
}

export interface FAQFormErrors {
  question?: string;
  answer?: string;
  [key: string]: string | undefined;
}

interface UseFAQFormArgs {
  initial?: Partial<FAQFormState>;
  serviceId?: number;
  faqId?: number;
  onSuccess?: () => void;
}

export function useFAQForm(args: UseFAQFormArgs = {}) {
  const initialState: FAQFormState = {
    question: args.initial?.question ?? "",
    answer: args.initial?.answer ?? "",
    sort_order: args.initial?.sort_order,
  };

  const { formData, setFormData, handleChange, resetForm, isValid } =
    useFormData<FAQFormState>(initialState);

  const [errors, setErrors] = useState<FAQFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { addFaq, updateFaq, loading } = useFaqApi();

  useEffect(() => {
    validate();
  }, [formData]);

  const clearError = useCallback((key: keyof FAQFormErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }, [errors]);

  const createFieldSetter = useCallback(<K extends keyof FAQFormState>(
    field: K
  ) => {
    return (value: FAQFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as keyof FAQFormErrors);
    };
  }, [setFormData, clearError]);

  const validate = useCallback((): boolean => {
    const newErrors: FAQFormErrors = {};

    if (!formData.question?.trim()) {
      newErrors.question = "Question is required";
    }

    if (!formData.answer?.trim()) {
      newErrors.answer = "Answer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const submitForm = useCallback(async (faqId?: number) => {
    setIsSubmitted(true);

    if (!validate()) {
      return { ok: false as const, errors };
    }

    if (!args.serviceId) {
      return { ok: false as const, error: "Service ID is required" };
    }

    // Build FormData with the actual form data
    const payload = new FormData();
    payload.append('question', formData.question);
    payload.append('answer', formData.answer);
    payload.append('sort_order', formData.sort_order ? String(formData.sort_order) : '1');

    try {
      let result;
      const targetFaqId = faqId ?? args.faqId;

      if (targetFaqId) {
        // Update existing FAQ
        result = await updateFaq(targetFaqId, payload, {
          showMessage: true,
          onSuccess: () => {
            args?.onSuccess?.();
            setIsSubmitted(false);
          },
        });
      } else {
        // Add new FAQ
        result = await addFaq(args.serviceId, payload, {
          showMessage: true,
          onSuccess: () => {
            args?.onSuccess?.();
            setIsSubmitted(false);
          },
        });
      }

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to save FAQ" };
    }
  }, [formData, validate, addFaq, updateFaq, args]);

  const fieldSetters = {
    setQuestion: createFieldSetter("question"),
    setAnswer: createFieldSetter("answer"),
  };

  return {
    formData,
    errors,
    isSubmitted,
    loading,
    isValid,
    setIsSubmitted,
    handleChange,
    validate,
    resetForm,
    submitForm,
    ...fieldSetters,
  };
}

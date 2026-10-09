"use client";

import { useMemo, useState, useCallback } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import { RfqFormState, RfqFormErrors } from "../types/Rfq";

interface BuildRfqFormDataArgs {
  data: RfqFormState;
  attachmentFiles?: File[];
}

function buildRfqFormData(args: BuildRfqFormDataArgs): FormData {
  const fd = new FormData();

  // Always append string fields, even if empty (to preserve empty-but-valid values)
  fd.append("title", args.data.title);
  fd.append("category_id", args.data.category_id);
  fd.append("delivery_model", args.data.delivery_model);
  fd.append("deadline_date", args.data.deadline_date);
  fd.append("budget_min", args.data.budget_min === "" ? "" : String(args.data.budget_min));
  fd.append("budget_max", args.data.budget_max === "" ? "" : String(args.data.budget_max));
  fd.append("description", args.data.description);

  // Append attachment files
  if (args.attachmentFiles?.length) {
    args.attachmentFiles.forEach((file, index) => {
      fd.append(`attachments[${index}]`, file);
    });
  }

  return fd;
}

interface UseRfqFormArgs {
  initial?: Partial<RfqFormState>;
  required?: {
    title?: boolean;
    category_id?: boolean;
    delivery_model?: boolean;
    deadline_date?: boolean;
    budget_min?: boolean;
    budget_max?: boolean;
    description?: boolean;
    attachments?: boolean;
  };
}

export function useRfqForm(args: UseRfqFormArgs = {}) {
  const initialState: RfqFormState = useMemo(
    () => ({
      title: args.initial?.title ?? "",
      category_id: args.initial?.category_id ?? "",
      delivery_model: args.initial?.delivery_model ?? "",
      deadline_date: args.initial?.deadline_date ?? "",
      budget_min: args.initial?.budget_min ?? "",
      budget_max: args.initial?.budget_max ?? "",
      description: args.initial?.description ?? "",
      attachments: args.initial?.attachments ?? [],
    }),
    [args.initial]
  );

  const { formData, setFormData, handleChange, resetForm: resetFormData } =
    useFormData<RfqFormState>(initialState);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<RfqFormErrors>({});

  const clearError = useCallback((key: keyof RfqFormErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: "" };
    });
  }, []);

  const createFieldSetter = useCallback(<K extends keyof RfqFormState>(
    field: K
  ) => {
    return (value: RfqFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as keyof RfqFormErrors);
    };
  }, [setFormData, clearError]);

  const fieldSetters = useMemo(() => ({
    setTitle: createFieldSetter("title"),
    setCategoryId: createFieldSetter("category_id"),
    setDeliveryModel: createFieldSetter("delivery_model"),
    setDeadlineDate: createFieldSetter("deadline_date"),
    setBudgetMin: createFieldSetter("budget_min"),
    setBudgetMax: createFieldSetter("budget_max"),
    setDescription: createFieldSetter("description"),
    setAttachments: createFieldSetter("attachments"),
  }), [createFieldSetter]);

  const validate = useCallback((): boolean => {
    const newErrors: RfqFormErrors = {};
    const req = { title: true, category_id: true, description: true, ...args.required };

    const validationRules = [
      { field: "title" as const, required: req.title, message: "Title is required" },
      { field: "category_id" as const, required: req.category_id, message: "Category is required" },
      { field: "delivery_model" as const, required: req.delivery_model, message: "Delivery model is required" },
      { field: "deadline_date" as const, required: req.deadline_date, message: "Deadline is required" },
      { field: "budget_min" as const, required: req.budget_min, message: "Budget min is required" },
      { field: "budget_max" as const, required: req.budget_max, message: "Budget max is required" },
      { field: "description" as const, required: req.description, message: "Description is required" },
    ];

    validationRules.forEach(({ field, required, message }) => {
      const value = formData[field];
      if (required) {
        if (typeof value === 'string') {
          if (!value.trim()) {
            newErrors[field] = message;
          }
        } else if (typeof value === 'number') {
          if (value === 0 || isNaN(value)) {
            newErrors[field] = message;
          }
        } else {
          newErrors[field] = message;
        }
      }
    });

    if (req.attachments && (!formData.attachments?.length)) {
      newErrors.attachments = "At least one attachment is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, args.required]);

  const resetForm = useCallback(() => {
    resetFormData();
    setErrors({});
    setIsSubmitted(false);
  }, [resetFormData]);

  const preparePayload = useCallback((attachments?: File[]): FormData => {
    return buildRfqFormData({
      data: formData,
      attachmentFiles: attachments || formData.attachments,
    });
  }, [formData]);

  return {
    // Form state
    formData,
    errors,
    isSubmitted,
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

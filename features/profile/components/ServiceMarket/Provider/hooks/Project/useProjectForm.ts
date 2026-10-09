"use client";

import { useMemo, useState, useCallback } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import { ProjectFormState, ProjectFormErrors } from "../../types";
import { buildProjectFormData } from "./buildProjectFormData";

interface UseProjectFormArgs {
  initial?: Partial<ProjectFormState>;
  required?: {
    title?: boolean;
    description?: boolean;
    url?: boolean;
    sort_order?: number;
    service_offer_ids?: boolean;
    images?: boolean;
  };
}

export function useProjectForm(args: UseProjectFormArgs = {}) {
  const initialState: ProjectFormState = useMemo(
    () => ({
      title: args.initial?.title ?? "",
      description: args.initial?.description ?? "",
      url: args.initial?.url ?? "",
      sort_order: args.initial?.sort_order ?? "1",
      service_offer_ids: args.initial?.service_offer_ids ?? [],
      images: args.initial?.images ?? [],
    }),
    [args.initial]
  );

  const { formData, setFormData, handleChange, resetForm: resetFormData } =
    useFormData<ProjectFormState>(initialState);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<ProjectFormErrors>({});

  const clearError = useCallback((key: keyof ProjectFormErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: "" };
    });
  }, []);

  const createFieldSetter = useCallback(<K extends keyof ProjectFormState>(
    field: K
  ) => {
    return (value: ProjectFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as keyof ProjectFormErrors);
    };
  }, [setFormData, clearError]);

  const fieldSetters = useMemo(() => ({
    setTitle: createFieldSetter("title"),
    setDescription: createFieldSetter("description"),
    setUrl: createFieldSetter("url"),
    setSortOrder: createFieldSetter("sort_order"),
    setServiceOfferIds: createFieldSetter("service_offer_ids"),
    setImages: createFieldSetter("images"),
  }), [createFieldSetter]);

  const validate = useCallback((): boolean => {
    const newErrors: ProjectFormErrors = {};
    const req = { title: true, description: true, ...args.required };

    const validationRules = [
      { field: "title" as const, required: req.title, message: "Title is required" },
      { field: "description" as const, required: req.description, message: "Description is required" },
      { field: "url" as const, required: req.url, message: "URL is required" },
      { field: "sort_order" as const, required: req.sort_order, message: "Sort order is required" },
    ];

    validationRules.forEach(({ field, required, message }) => {
      if (required && !formData[field]?.trim()) {
        newErrors[field] = message;
      }
    });

    if (req.service_offer_ids && (!formData.service_offer_ids?.length)) {
      newErrors.service_offer_ids = "At least one service offer is required";
    }

    if (req.images && (!formData.images?.length)) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, args.required]);

  const resetForm = useCallback(() => {
    resetFormData();
    setErrors({});
    setIsSubmitted(false);
  }, [resetFormData]);

  const preparePayload = useCallback((images?: File[]): FormData => {
    return buildProjectFormData({
      data: formData,
      imageFiles: images || formData.images,
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

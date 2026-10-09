"use client";

import { useCallback, useEffect, useState } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import { useProviderServicesApi } from "./useProviderServicesApi";
import { buildServiceFormData } from "./buildServiceFormData";

export interface OverviewFormState {
  title: string;
  service_category_id: string;
  type: string;
  delivery_model: string;
  description: string;
  is_active: string;
  sort_order: string;
}

export interface OverviewFormErrors {
  title?: string;
  service_category_id?: string;
  type?: string;
  delivery_model?: string;
  description?: string;
  [key: string]: string | undefined;
}

interface UseOverviewFormArgs {
  initial?: Partial<OverviewFormState>;
  serviceId?: number;
  onSuccess?: () => void;
}

export function useOverviewForm(args: UseOverviewFormArgs = {}) {
  const initialState: OverviewFormState = {
    title: args.initial?.title ?? "",
    service_category_id: args.initial?.service_category_id?.toString() ?? "",
    type: args.initial?.type ?? "",
    delivery_model: args.initial?.delivery_model ?? "",
    description: args.initial?.description ?? "",
    is_active: args.initial?.is_active?.toString() ?? "1",
    sort_order: args.initial?.sort_order?.toString() ?? "0",
  };

  const { formData, setFormData, handleChange, resetForm, isValid } =
    useFormData<OverviewFormState>(initialState);

  const [errors, setErrors] = useState<OverviewFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { updateService, loading } = useProviderServicesApi();

  useEffect(() => {
    validate();
  }, [formData]);

  const clearError = useCallback((key: keyof OverviewFormErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }, [errors]);

  const createFieldSetter = useCallback(<K extends keyof OverviewFormState>(
    field: K
  ) => {
    return (value: OverviewFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as keyof OverviewFormErrors);
    };
  }, [setFormData, clearError]);

  const validate = useCallback((): boolean => {
    const newErrors: OverviewFormErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.service_category_id) {
      newErrors.service_category_id = "Category is required";
    }

    if (!formData.type?.trim()) {
      newErrors.type = "Type is required";
    }

    if (!formData.delivery_model?.trim()) {
      newErrors.delivery_model = "Delivery model is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const submitForm = useCallback(async () => {
    setIsSubmitted(true);
    
    if (!validate()) {
      return { ok: false as const, errors };
    }

    if (!args.serviceId) {
      return { ok: false as const, error: "Service ID is required for update" };
    }

    // Create complete ServiceFormState for buildServiceFormData
    const completeFormData = {
      ...formData,
      plans: [], // Empty arrays for other sections since this is overview only
      faqs: [],
      available_slots: [],
      cover: null,
      media: [],
    };

    const payload = buildServiceFormData({
      data: completeFormData,
    });

    try {
      const result = await updateService(args.serviceId, payload, {
        showMessage: true,
        onSuccess: () => {
          args?.onSuccess?.();
          setIsSubmitted(false);
        },
      });

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to update service" };
    }
  }, [formData, validate, updateService, args]);

  const fieldSetters = {
    setTitle: createFieldSetter("title"),
    setServiceCategoryId: createFieldSetter("service_category_id"),
    setType: createFieldSetter("type"),
    setDeliveryModel: createFieldSetter("delivery_model"),
    setDescription: createFieldSetter("description"),
    setIsActive: createFieldSetter("is_active"),
    setSortOrder: createFieldSetter("sort_order"),
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

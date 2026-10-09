"use client";

import { useCallback, useEffect, useState } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import { buildServiceFormData } from "./buildServiceFormData";
import { usePlanApi } from "./usePlanApi";

export interface PackageFormState {
  title: string;
  price: string;
  currency: string;
  delivery_time_value: string;
  delivery_time_unit: string;
  revision_window: string;
  revision_scope_rules: string;
  number_of_revisions: string;
}

export interface PackageFormErrors {
  title?: string;
  price?: string;
  currency?: string;
  delivery_time_value?: string;
  delivery_time_unit?: string;
  number_of_revisions?: string;
  [key: string]: string | undefined;
}

interface UsePackageFormArgs {
  initial?: Partial<PackageFormState>;
  serviceId?: number;
  packageId?: number;
  onSuccess?: () => void;
}

export function usePackageForm(args: UsePackageFormArgs = {}) {
  const initialState: PackageFormState = {
    title: args.initial?.title ?? "",
    price: args.initial?.price?.toString() ?? "",
    currency: args.initial?.currency ?? "USD",
    delivery_time_value: args.initial?.delivery_time_value?.toString() ?? "",
    delivery_time_unit: args.initial?.delivery_time_unit ?? "days",
    revision_window: args.initial?.revision_window ?? "",
    revision_scope_rules: args.initial?.revision_scope_rules ?? "",
    number_of_revisions: args.initial?.number_of_revisions?.toString() ?? "0",
  };

  const { formData, setFormData, handleChange, resetForm, isValid } =
    useFormData<PackageFormState>(initialState);

  const [errors, setErrors] = useState<PackageFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { addPlan , loading } = usePlanApi();

  useEffect(() => {
    validate();
  }, [formData]);

  const clearError = useCallback((key: keyof PackageFormErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }, [errors]);

  const createFieldSetter = useCallback(<K extends keyof PackageFormState>(
    field: K
  ) => {
    return (value: PackageFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as keyof PackageFormErrors);
    };
  }, [setFormData, clearError]);

  const validate = useCallback((): boolean => {
    const newErrors: PackageFormErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Package title is required";
    }

    if (!formData.price || formData.price.toString().trim() === "" || isNaN(Number(formData.price))) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.currency?.trim()) {
      newErrors.currency = "Currency is required";
    }

    if (!formData.delivery_time_value || formData.delivery_time_value.toString().trim() === "" || isNaN(Number(formData.delivery_time_value))) {
      newErrors.delivery_time_value = "Valid delivery time is required";
    }

    if (!formData.delivery_time_unit?.trim()) {
      newErrors.delivery_time_unit = "Delivery time unit is required";
    }

    if (!formData.number_of_revisions || formData.number_of_revisions.toString().trim() === "" || isNaN(Number(formData.number_of_revisions))) {
      newErrors.number_of_revisions = "Valid number of revisions is required";
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

    const completeFormData = {
      title: "",
      service_category_id: "",
      type: "",
      delivery_model: "",
      description: "",
      is_active: "1",
      sort_order: "0",
      plans: [formData], 
      faqs: [],
      available_slots: [],
      cover: null,
      media: [],
    };

    const payload = buildServiceFormData({
      data: completeFormData,
      includeBasicInfo: false, // Only send plans data, no basic info
    });

    try {
      const result = await addPlan(args.serviceId, payload, {
        showMessage: true,
        onSuccess: () => {
          args?.onSuccess?.();
          setIsSubmitted(false);
        },
      });

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to update package" };
    }
  }, [formData, validate, addPlan, args]);

  const fieldSetters = {
    setTitle: createFieldSetter("title"),
    setPrice: createFieldSetter("price"),
    setCurrency: createFieldSetter("currency"),
    setDeliveryTimeValue: createFieldSetter("delivery_time_value"),
    setDeliveryTimeUnit: createFieldSetter("delivery_time_unit"),
    setRevisionWindow: createFieldSetter("revision_window"),
    setRevisionScopeRules: createFieldSetter("revision_scope_rules"),
    setNumberOfRevisions: createFieldSetter("number_of_revisions"),
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
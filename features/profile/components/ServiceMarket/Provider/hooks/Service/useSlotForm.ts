"use client";

import { useCallback, useEffect, useState } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import { useProviderServicesApi } from "./useProviderServicesApi";

export interface SlotFormState {
  day: string;
  start_time: string;
  end_time: string;
}

export interface SlotFormErrors {
  day?: string;
  start_time?: string;
  end_time?: string;
  [key: string]: string | undefined;
}

interface UseSlotFormArgs {
  initial?: Partial<SlotFormState>;
  serviceId?: number;
  slotId?: number;
  onSuccess?: () => void;
}

export function useSlotForm(args: UseSlotFormArgs = {}) {
  const initialState: SlotFormState = {
    day: args.initial?.day ?? "",
    start_time: args.initial?.start_time ?? "",
    end_time: args.initial?.end_time ?? "",
  };

  const { formData, setFormData, handleChange, resetForm, isValid } =
    useFormData<SlotFormState>(initialState);

  const [errors, setErrors] = useState<SlotFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { updateService, loading } = useProviderServicesApi();

  useEffect(() => {
    validate();
  }, [formData]);

  const clearError = useCallback((key: keyof SlotFormErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }, [errors]);

  const createFieldSetter = useCallback(<K extends keyof SlotFormState>(
    field: K
  ) => {
    return (value: SlotFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as keyof SlotFormErrors);
    };
  }, [setFormData, clearError]);

  const validate = useCallback((): boolean => {
    const newErrors: SlotFormErrors = {};

    if (!formData.day?.trim()) {
      newErrors.day = "Day is required";
    }

    if (!formData.start_time?.trim()) {
      newErrors.start_time = "Start time is required";
    }

    if (!formData.end_time?.trim()) {
      newErrors.end_time = "End time is required";
    }

    // Validate time format and logic
    if (formData.start_time && formData.end_time) {
      const start = new Date(`2000-01-01T${formData.start_time}`);
      const end = new Date(`2000-01-01T${formData.end_time}`);

      if (start >= end) {
        newErrors.end_time = "End time must be after start time";
      }
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

    // Build FormData for slot update
    const payload = new FormData();
    payload.append("day", formData.day);
    payload.append("start_time", formData.start_time);
    payload.append("end_time", formData.end_time);

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
      return { ok: false as const, error: "Failed to update availability slot" };
    }
  }, [formData, validate, updateService, args]);

  const fieldSetters = {
    setDay: createFieldSetter("day"),
    setStartTime: createFieldSetter("start_time"),
    setEndTime: createFieldSetter("end_time"),
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

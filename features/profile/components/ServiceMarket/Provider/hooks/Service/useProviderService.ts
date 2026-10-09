"use client";

import { useCallback } from "react";
import { useServiceForm } from "./useServiceForm";
import { useProviderServicesApi } from "./useProviderServicesApi";
import { ServiceFormState } from "./useServiceForm";
import { buildServiceFormData } from "./buildServiceFormData";

interface UseProviderServiceArgs {
  initial?: Partial<ServiceFormState>;
  required?: {
    title?: boolean;
    description?: boolean;
    category?: boolean;
    subcategory?: boolean;
    images?: boolean;
    planTitle?: boolean;
    planPrice?: boolean;
    estimatedDeliveryTime?: boolean;
  };
  onSuccess?: () => void;
}

export const useProviderService = (args: UseProviderServiceArgs = {}) => {

  const formHook = useServiceForm({
    initial: args.initial,
    required: args.required,
  });
// console.log("formHook", formHook?.formData); // Fixed: accessing formData instead of initial

  const apiHook = useProviderServicesApi();

  const submitFAQ = useCallback(async (serviceId: number, faqData: { question: string; answer: string }) => {
    formHook.setIsSubmitted(true);
    
    if (!faqData.question?.trim() || !faqData.answer?.trim()) {
      return { ok: false as const, error: "Question and answer are required" };
    }

    // Create complete ServiceFormState for FAQ update
    const completeFormData: ServiceFormState = {
      title: "",
      service_category_id: "",
      type: "",
      delivery_model: "",
      description: "",
      is_active: "1",
      sort_order: "0",
      plans: [],
      faqs: [faqData],
      available_slots: [],
      cover: null,
      media: [],
    };

    const payload = buildServiceFormData({
      data: completeFormData,
      includeBasicInfo: false, // Only send FAQ data, no basic info
    });
    
    try {
      const result = await apiHook.updateService(serviceId, payload, {
        showMessage: true,
        onSuccess: () => {
          args?.onSuccess?.();
          formHook.setIsSubmitted(false);
        },
      });

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to update FAQ" };
    }
  }, [formHook, apiHook, args?.onSuccess]);

  const submitAvailability = useCallback(async (serviceId: number, availabilityData: {
    day: string;
    slots: Array<{
      start_time: string;
      end_time: string;
    }>;
  }) => {
    formHook.setIsSubmitted(true);
    
    if (!availabilityData.day?.trim() || !availabilityData.slots?.length) {
      return { ok: false as const, error: "Day and at least one time slot are required" };
    }

    // Validate time slots
    for (const slot of availabilityData.slots) {
      if (!slot.start_time?.trim() || !slot.end_time?.trim()) {
        return { ok: false as const, error: "Start and end times are required for all slots" };
      }
      
      const start = new Date(`2000-01-01T${slot.start_time}`);
      const end = new Date(`2000-01-01T${slot.end_time}`);
      
      if (start >= end) {
        return { ok: false as const, error: "End time must be after start time" };
      }
    }

    // Create complete ServiceFormState for availability update
    const completeFormData: ServiceFormState = {
      title: "",
      service_category_id: "",
      type: "",
      delivery_model: "",
      description: "",
      is_active: "1",
      sort_order: "0",
      plans: [],
      faqs: [],
      available_slots: [availabilityData],
      cover: null,
      media: [],
    };

    const payload = buildServiceFormData({
      data: completeFormData,
      includeBasicInfo: false, // Only send availability data, no basic info
    });
    
    try {
      const result = await apiHook.updateService(serviceId, payload, {
        showMessage: true,
        onSuccess: () => {
          args?.onSuccess?.();
          formHook.setIsSubmitted(false);
        },
      });

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to update availability" };
    }
  }, [formHook, apiHook, args?.onSuccess]);

  const submitOverview = useCallback(async (serviceId: number, overviewData: Partial<ServiceFormState>) => {
    formHook.setIsSubmitted(true);
    
    if (!overviewData.title?.trim() || !overviewData.service_category_id || 
        !overviewData.type?.trim() || !overviewData.delivery_model?.trim() || 
        !overviewData.description?.trim()) {
      return { ok: false as const, error: "All overview fields are required" };
    }

    // Create complete ServiceFormState for overview update
    const completeFormData = {
      ...overviewData,
      plans: [],
      faqs: [],
      available_slots: [],
      cover: null,
      media: [],
    };

    const payload = formHook.preparePayload();
    
    try {
      const result = await apiHook.updateService(serviceId, payload, {
        showMessage: true,
        onSuccess: () => {
          args?.onSuccess?.();
          formHook.setIsSubmitted(false);
        },
      });

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to update overview" };
    }
  }, [formHook, apiHook, args?.onSuccess]);

  const submitPackage = useCallback(async (serviceId: number, packageData: {
    title: string;
    price: string;
    currency: string;
    delivery_time_value: string;
    delivery_time_unit: string;
    revision_window: string;
    revision_scope_rules: string;
    number_of_revisions: string;
  }) => {
    formHook.setIsSubmitted(true);
    
    if (!packageData.title?.trim() || !packageData.price || isNaN(Number(packageData.price)) ||
        !packageData.currency?.trim() || !packageData.delivery_time_value || 
        isNaN(Number(packageData.delivery_time_value)) || !packageData.delivery_time_unit?.trim() ||
        (packageData.number_of_revisions && isNaN(Number(packageData.number_of_revisions)))) {
      return { ok: false as const, error: "All package fields are required and must be valid" };
    }

    // Create complete ServiceFormState for package update
    const completeFormData: ServiceFormState = {
      title: "",
      service_category_id: "",
      type: "",
      delivery_model: "",
      description: "",
      is_active: "1",
      sort_order: "0",
      plans: [packageData],
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
      const result = await apiHook.updateService(serviceId, payload, {
        showMessage: true,
        onSuccess: () => {
          args?.onSuccess?.();
          formHook.setIsSubmitted(false);
        },
      });

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to update package" };
    }
  }, [formHook, apiHook, args?.onSuccess]);

  const submitBasic = useCallback(async (serviceId?: number, images?: File[]) => {
    formHook.setIsSubmitted(true);
    
    if (!formHook.validate()) {
      console.log('Form validation failed:', formHook.errors);
      const firstError = Object.values(formHook.errors).find(Boolean) as string | undefined;
      return { ok: false as const, error: firstError };
    }

    const payload = formHook.preparePayload(images?.[0]); // Fixed: pass first file instead of array
    
    try {
      let result;
      if (serviceId) {
        result = await apiHook.updateService(serviceId, payload, {
          showMessage: true,
          onSuccess: () => {
            args?.onSuccess?.();
            formHook.setIsSubmitted(false);
          },
        });
      } else {
        result = await apiHook.createService(payload, {
          showMessage: true,
          onSuccess: () => {
            args?.onSuccess?.();
            formHook.resetForm();
          },
        });
      }

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const };
    }
  }, [formHook, apiHook, args?.onSuccess]);

  return {
    ...apiHook,
    ...formHook,
    submitFAQ,
    submitOverview,
    submitPackage,
    submitAvailability,
    submitBasic,
  };
};

"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import useFormData from "@/lib/Hooks/useFormData";
import { buildServiceFormData } from "./buildServiceFormData";

// Service form state interface
export interface ServiceFormState {
  // Basic Info
  title: string;
  service_category_id: string;
  type: string;
  delivery_model: string;
  description: string;
  is_active: string;
  sort_order: string;
  
  // Plans
  plans: Array<{
    title: string;
    price: string;
    currency: string;
    delivery_time_value: string;
    delivery_time_unit: string;
    revision_window: string;
    revision_scope_rules: string;
    number_of_revisions: string;
  }>;
  
  // FAQs
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  
  // Availability
  available_slots: Array<{
    day: string;
    slots: Array<{
      start_time: string;
      end_time: string;
    }>;
  }>;
  
  // Media
  cover: File | { id: number; url: string } | null;
  media: Array<{
    file: File | { id: number; url: string } | null;
    sort_order: string;
  }>;
}

// Service form errors interface
export interface ServiceFormErrors {
  title?: string;
  service_category_id?: string;
  type?: string;
  delivery_model?: string;
  description?: string;
  plans?: string;
  faqs?: string;
  available_slots?: string;
  cover?: string;
  media?: string;
  [key: string]: string | undefined;
}

interface UseServiceFormArgs {
  initial?: Partial<ServiceFormState>;
  required?: {
    title?: boolean;
    service_category_id?: boolean;
    type?: boolean;
    delivery_model?: boolean;
    description?: boolean;
    plans?: boolean;
  };
}

export function useServiceForm(args: UseServiceFormArgs = {}) {
  // Transform API data to form format if needed
  const transformPlans = useCallback((plans?: any[]) => {
    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      return [];
    }

    return plans.map(plan => ({
      title: plan.title || "",
      price: plan.price?.toString() || "",
      currency: plan.currency || "",
      delivery_time_value: plan.delivery_time_value?.toString() || "",
      delivery_time_unit: plan.delivery_time_unit || "",
      revision_window: plan.revision_window || "",
      revision_scope_rules: plan.revision_scope_rules || "",
      number_of_revisions: plan.number_of_revisions?.toString() || ""
    }));
  }, []);

  const transformFaqs = useCallback((faqs?: any[]) => {
    if (!faqs || !Array.isArray(faqs)) return [];
    return faqs.map(faq => ({
      question: faq.question || "",
      answer: faq.answer || ""
    }));
  }, []);

  const transformAvailableSlots = useCallback((slots?: any[]) => {
    if (!slots || !Array.isArray(slots)) return [];
    return slots.map(slot => ({
      day: slot.day || "",
      slots: slot.slots || []
    }));
  }, []);

  const transformMedia = useCallback((media?: any[]) => {
    if (!media || !Array.isArray(media)) {
      return [{
        file: null,
        sort_order: "0"
      }];
    }
    return media.map(item => ({
      file: (item.file instanceof File) ? item.file : { id: item.id || item.file?.id, url: item.url || item.file?.url },
      sort_order: item.sort_order?.toString() || "0"
    }));
  }, []);

  const initialState: ServiceFormState = useMemo(
    () => {
      // If we have initial data, use it directly (transformed)
      if (args.initial) {
        return {
          // Basic Info
          title: args.initial?.title ?? "",
          service_category_id: args.initial?.service_category_id?.toString() ?? "",
          type: args.initial?.type ?? "",
          delivery_model: args.initial?.delivery_model ?? "",
          description: args.initial?.description ?? "",
          is_active: args.initial?.is_active?.toString() ?? "1",
          sort_order: args.initial?.sort_order?.toString() ?? "0",
          
          // Plans
          plans: transformPlans(args.initial?.plans),
          
          // FAQs
          faqs: transformFaqs(args.initial?.faqs),
          
          // Availability
          available_slots: transformAvailableSlots(args.initial?.available_slots),
          
          // Media
          cover: args.initial?.cover ? (args.initial.cover instanceof File ? args.initial.cover : { id: args.initial.cover.id, url: args.initial.cover.url }) : null,
          media: transformMedia(args.initial?.media)
        };
      }
      
      // Default empty state for new form
      return {
        // Basic Info
        title: "",
        service_category_id: "",
        type: "",
        delivery_model: "",
        description: "",
        is_active: "1",
        sort_order: "0",
        
        // Plans
        plans: [],
        
        // FAQs
        faqs: [],
        
        // Availability
        available_slots: [],
        
        // Media
        cover: null,
        media: [{
          file: null,
          sort_order: "0"
        }]
      };
    },
    [args.initial]
  );


  const { formData, setFormData, handleChange, resetForm: resetFormData, isValid, handleArrayChange } =
    useFormData<ServiceFormState>(initialState);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<ServiceFormErrors>({});

  // Update form data when initial data changes (e.g., after API fetch)
  useEffect(() => {
    if (args.initial && Object.keys(args.initial).length > 0) {
      const transformedData: ServiceFormState = {
        title: args.initial?.title ?? "",
        service_category_id: args.initial?.service_category_id?.toString() ?? "",
        type: args.initial?.type ?? "",
        delivery_model: args.initial?.delivery_model ?? "",
        description: args.initial?.description ?? "",
        is_active: args.initial?.is_active?.toString() ?? "1",
        sort_order: args.initial?.sort_order?.toString() ?? "0",
        plans: transformPlans(args.initial?.plans),
        faqs: transformFaqs(args.initial?.faqs),
        available_slots: transformAvailableSlots(args.initial?.available_slots),
        cover: args.initial?.cover ? (args.initial.cover instanceof File ? args.initial.cover : { id: args.initial.cover.id, url: args.initial.cover.url }) : null,
        media: transformMedia(args.initial?.media)
      };
      setFormData(transformedData);
    }
  }, [args.initial, setFormData, transformPlans, transformFaqs, transformAvailableSlots, transformMedia]);

  // Validate form whenever formData changes
  useEffect(() => {
    validate();
  }, [formData]);

  const clearError = useCallback((key: keyof ServiceFormErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }, [errors]);

  const createFieldSetter = useCallback(<K extends keyof ServiceFormState>(
    field: K
  ) => {
    return (value: ServiceFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as keyof ServiceFormErrors);
    };
  }, [setFormData, clearError]);

  const createFieldSetterWithValidation = useCallback(<K extends keyof ServiceFormState>(
    field: K,
    validateImmediately = false
  ) => {
    return (value: ServiceFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field as keyof ServiceFormErrors);
      
      if (validateImmediately && isSubmitted) {
        validate();
      }
    };
  }, [setFormData, clearError,  isSubmitted]);

  const fieldSetters = useMemo(() => ({
    // Basic Info
    setTitle: createFieldSetterWithValidation("title", true),
    setServiceCategoryId: createFieldSetterWithValidation("service_category_id", true),
    setType: createFieldSetterWithValidation("type", true),
    setDeliveryModel: createFieldSetterWithValidation("delivery_model", true),
    setDescription: createFieldSetterWithValidation("description", true),
    setIsActive: createFieldSetter("is_active"),
    setSortOrder: createFieldSetter("sort_order"),
    
    // Plans
    setPlans: (value: ServiceFormState['plans']) => {
      setFormData((prev) => ({ ...prev, plans: value }));
      clearError("plans");
    },
    
    // FAQs
    setFaqs: (value: ServiceFormState['faqs']) => {
      setFormData((prev) => ({ ...prev, faqs: value }));
      clearError("faqs");
    },
    
    // Availability
    setAvailableSlots: (value: ServiceFormState['available_slots']) => {
      setFormData((prev) => ({ ...prev, available_slots: value }));
      clearError("available_slots");
    },
    
    // Media
    setCover: createFieldSetter("cover"),
    setMedia: (value: ServiceFormState['media']) => {
      setFormData((prev) => ({ ...prev, media: value }));
      clearError("media");
    },
  }), [createFieldSetter, createFieldSetterWithValidation, clearError]);

  const validate = useCallback((): boolean => {
    const newErrors: ServiceFormErrors = {};
    const req = { 
      title: true, 
      service_category_id: true, 
      type: true, 
      delivery_model: true,
      description: true,
      plans: true,
      ...args.required 
    };

    // Basic Info validations
    if (req.title && !formData.title?.trim()) {
      newErrors.title = "serviceMarket.myServices.validation.titleRequired";
    }

    if (req.service_category_id && !formData.service_category_id) {
      newErrors.service_category_id = "serviceMarket.myServices.validation.categoryRequired";
    }

    if (req.type && !formData.type?.trim()) {
      newErrors.type = "serviceMarket.myServices.validation.typeRequired";
    }

    if (req.delivery_model && !formData.delivery_model?.trim()) {
      newErrors.delivery_model = "serviceMarket.myServices.validation.deliveryModelRequired";
    }

    if (req.description && !formData.description?.trim()) {
      newErrors.description = "serviceMarket.myServices.validation.descriptionRequired";
    }

    // Plans validations
    if (req.plans && !formData.plans?.length) {
      newErrors.plans = "serviceMarket.myServices.validation.plansRequired";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, args.required]);

  const resetForm = useCallback(() => {
    resetFormData();
    setErrors({});
    setIsSubmitted(false);
  }, [resetFormData]);

  const preparePayload = useCallback((coverFile?: File, mediaFiles?: File[]): FormData => {
    return buildServiceFormData({
      data: formData,
      coverFile: coverFile || (formData.cover instanceof File ? formData.cover : undefined),
      mediaFiles: mediaFiles || formData.media?.filter((m): m is { file: File; sort_order: string } => m.file !== null && m.file instanceof File).map(m => m.file) || [],
    });
  }, [formData]);



  const updateFAQ = useCallback(
    (index: number, patch: Partial<ServiceFormState['faqs'][0]>) => {
      const next = [...formData.faqs];
      next[index] = { ...next[index], ...patch };
      setFormData((prev) => ({ ...prev, faqs: next }));

      setErrors((prev) => {
        const n = { ...prev };
        if (patch.question !== undefined) delete n[`faqs.${index}.question`];
        if (patch.answer !== undefined) delete n[`faqs.${index}.answer`];
        return n;
      });
    },
    [formData.faqs, setFormData, setErrors]
  );



        return {
    // Form state
    formData,
    errors, 
    isSubmitted,
    isValid,
    setIsSubmitted,
    
    // Form handlers
    handleChange,
    handleArrayChange,
    validate,
    resetForm,
    preparePayload,
    updateFAQ,
    
    // Field setters
    ...fieldSetters,
  };
}

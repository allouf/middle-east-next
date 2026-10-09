"use client";

import { useCallback } from "react";
import { useProjectForm } from "./useProjectForm";
import { useProviderProjectsApi } from "./useProviderProjectsApi";
import { ProjectFormState } from "../../types";

interface UseProviderProjectArgs {
  initial?: Partial<ProjectFormState>;
  required?: {
    title?: boolean;
    description?: boolean;
    url?: boolean;
    sort_order?: number;
    service_offer_ids?: boolean;
    images?: boolean;
  };
  onSuccess?: () => void;
}

export const useProviderProject = (args: UseProviderProjectArgs = {}) => {
  const formHook = useProjectForm({
    initial: args.initial,
    required: args.required,
  });

  const apiHook = useProviderProjectsApi();

  const submitForm = useCallback(async (projectId?: number, images?: File[]) => {
    formHook.setIsSubmitted(true);
    
    // Update images if provided
    if (images) {
      formHook.setImages(images);
    }
    
    if (!formHook.validate()) {
      return { ok: false as const };
    }

    const payload = formHook.preparePayload(images);
    
    try {
      let result;
      if (projectId) {
        result = await apiHook.updateProject(projectId, payload, {
          showMessage: true,
          onSuccess: () => {
            args?.onSuccess?.();
            formHook.setIsSubmitted(false);
          },
        });
      } else {
        result = await apiHook.createProject(payload, {
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
    submitForm,
  };
};

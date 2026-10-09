"use client";

import { useCallback } from "react";
import { useRfqForm } from "./useRfqForm";
import { useRfqClientApi } from "./useRfqClientApi";
import { RfqFormState } from "../types/Rfq";

interface UseRfqClientArgs {
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
  onSuccess?: () => void;
}

export const useRfqClient = (args: UseRfqClientArgs = {}) => {
  const formHook = useRfqForm({
    initial: args.initial,
    required: args.required,
  });

  const apiHook = useRfqClientApi();

  const submitForm = useCallback(async (requestId?: string, attachments?: File[]) => {
    formHook.setIsSubmitted(true);
    
    // Update attachments if provided
    if (attachments) {
      formHook.setAttachments(attachments);
    }
    
    if (!formHook.validate()) {
      return { ok: false as const };
    }

    const payload = formHook.preparePayload(attachments);
    
    try {
      let result;
      if (requestId) {
        result = await apiHook.updateRequest(requestId, payload, {
          showMessage: true,
          onSuccess: () => {
            args?.onSuccess?.();
            formHook.setIsSubmitted(false);
          },
        });
      } else {
        result = await apiHook.createRequest(payload, {
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

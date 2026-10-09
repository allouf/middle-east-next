"use client";

import { useCallback } from "react";
import { useProviderProfileForm } from "./useProviderProfileForm";
import { useProviderProfileApi } from "./useProviderProfileApi";
import { useProviderApiStore } from "../../../stores";


export const useProviderProfile = (args?: {
  initial?: any;
  required?: any;
  onSuccess?: () => void;
}) => {
  const formHook = useProviderProfileForm({
    initial: args?.initial,
    required: args?.required,
  });

  const apiHook = useProviderProfileApi();
  const resetStore = useProviderApiStore((state: any) => state.reset);

  // Combined submit method
  const submitForm = useCallback(async () => {
    formHook.isSubmitted = true;
    if (!formHook.validate()) return { ok: false as const };

    const payload = formHook.preparePayload();
    
    // Try update first
    let result = await apiHook.updateProfile(payload, {
      showMessage: true,
      onSuccess: () => {
        args?.onSuccess?.();
        formHook.isSubmitted = false;
      },
    });

    // If update failed and 482 detected, try create instead
    if (!result && useProviderApiStore.getState().shouldShowCreateForm) {
      console.log("Update failed with 482, trying create profile instead");
      resetStore();
      
      result = await apiHook.createProfile(payload, {
        showMessage: true,
        onSuccess: () => {
          args?.onSuccess?.();
          formHook.isSubmitted = false;
        },
      });
    }

    return { ok: !!result };
  }, [formHook, apiHook, args?.onSuccess, resetStore]);

  return {
    // API state and methods
    ...apiHook,
    
    // Form state and methods
    ...formHook,
    
    // Combined methods
    submitForm,
  };
};

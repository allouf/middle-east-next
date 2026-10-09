"use client";

import { useCallback, useState } from "react";
import { App } from "antd";
import { providerProfileService } from "../../services/provider-profile.service";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { ProviderProfile, RequestOptions } from "../../types/provider.types";

export const useProviderProfileApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(
    async (options?: RequestOptions<ProviderProfile>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerProfileService.getProfile({
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Profile loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch profile");
            setError(errorMessage);
            
            if (options?.showMessage) {
              messageApi.error(errorMessage);
            }
            options?.onError?.(error);
          },
        });

        return response;
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  const updateProfile = useCallback(
    async (data: FormData, options?: RequestOptions<ProviderProfile>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerProfileService.updateProfile(data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Profile updated successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to update profile");
            setError(errorMessage);
            
            if (options?.showMessage) {
              messageApi.error(errorMessage);
            }
            options?.onError?.(error);
          },
        });

        return response;
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  const createProfile = useCallback(
    async (data: FormData, options?: RequestOptions<ProviderProfile>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerProfileService.createProfile(data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Profile created successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to create profile");
            setError(errorMessage);
            
            if (options?.showMessage) {
              messageApi.error(errorMessage);
            }
            options?.onError?.(error);
          },
        });

        return response;
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  return {
    loading,
    error,
    fetchProfile,
    updateProfile,
    createProfile,
    setError,
  };
};

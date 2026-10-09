"use client";
import { useCallback, useState } from "react";
import { App } from "antd";
import { RequestOptions } from "../../types/provider.types";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { faqServicesService, FAQ } from "../../services/faq-services.service";

export const useFaqApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addFaq = useCallback(
    async (
      serviceId: number,
      data: FormData,
      options?: RequestOptions<FAQ>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await faqServicesService.addFaq(serviceId, data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "FAQ added successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to add FAQ");
            setError(errorMessage);
            setLoading(false);
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

  const updateFaq = useCallback(
    async (
      faqId: number,
      data: FormData,
      options?: RequestOptions<FAQ>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await faqServicesService.updateFaq(faqId, data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "FAQ updated successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to update FAQ");
            setError(errorMessage);
            setLoading(false);
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

  const deleteFaq = useCallback(
    async (
      faqId: number,
      options?: RequestOptions<void>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await faqServicesService.deleteFaq(faqId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "FAQ deleted successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to delete FAQ");
            setError(errorMessage);
            setLoading(false);
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
    addFaq,
    updateFaq,
    deleteFaq,
    setError,
  };
};

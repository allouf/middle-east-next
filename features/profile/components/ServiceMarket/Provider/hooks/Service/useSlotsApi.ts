"use client";
import { useCallback, useState } from "react";
import { App } from "antd";
import { RequestOptions } from "../../types/provider.types";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { slotsServicesService, AvailableSlot } from "../../services/slots-services.service";

export const useSlotsApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateSlots = useCallback(
    async (
      serviceId: number,
      data: FormData,
      options?: RequestOptions<AvailableSlot[]>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await slotsServicesService.updateSlots(serviceId, data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Available slots updated successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to update available slots");
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
    updateSlots,
    setError,
  };
};

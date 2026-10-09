"use client";

import { useCallback, useState } from "react";
import { App } from "antd";
import { serviceOffersService } from "../../services/service-offers.service";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { ServiceOffersResponse, RequestOptions } from "../../types/provider.types";

export const useServiceOffersApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceOffers = useCallback(
    async (options?: RequestOptions<ServiceOffersResponse>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await serviceOffersService.getServiceOffers({
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Service offers loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch service offers");
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
    fetchServiceOffers,
    setError,
  };
};

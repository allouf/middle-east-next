"use client";
import { useCallback, useState } from "react";
import { App } from "antd";
import { ProviderService, ServiceOffer, RequestOptions } from "../../types/provider.types";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { providerServicesService } from "../../services/provider-services.service";

export const useProviderServicesApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithLoading = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: RequestOptions<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      options?.onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServices = useCallback(
    async (options?: RequestOptions<ProviderService[]>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerServicesService.getServices({
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Services loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch services");
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

  const fetchServiceById = useCallback(
    async (
      serviceId: number,
      options?: RequestOptions<ServiceOffer>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerServicesService.getServiceById(serviceId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Service loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch service");
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

  const createService = useCallback(
    async (
      data: FormData,
      options?: RequestOptions<ProviderService>
    ) => {
      setLoading(true);
      setError(null);


      try {
        const response = await providerServicesService.createService(data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Service created successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to create service");
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

  const updateService = useCallback(
    async (
      serviceId: number,
      data: FormData,
      options?: RequestOptions<ProviderService>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerServicesService.updateService(serviceId, data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Service updated successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to update service");
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

  const deleteService = useCallback(
    async (
      serviceId: number,
      options?: RequestOptions<void>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerServicesService.deleteService(serviceId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Service deleted successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to delete service");
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

  const refetch = useCallback(
    async (options?: RequestOptions<ProviderService[]>) => {
      return fetchServices({
        ...options,
        showMessage: options?.showMessage ?? false,
      });
    },
    [fetchServices]
  );

  return {
    loading,
    error,
    fetchServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
    refetch,
    setError,
  };
};

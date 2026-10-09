"use client";
import { useCallback, useState } from "react";
import { App } from "antd";
import { RequestOptions } from "../../types/provider.types";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { planServicesService, Plan } from "../../services/plan-services.service";

export const usePlanApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addPlan = useCallback(
    async (
      serviceId: number,
      data: FormData,
      options?: RequestOptions<Plan>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await planServicesService.addPlan(serviceId, data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Plan added successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to add plan");
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

  const updatePlan = useCallback(
    async (
      planId: number,
      data: FormData,
      options?: RequestOptions<Plan>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await planServicesService.updatePlan(planId, data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Plan updated successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to update plan");
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

  const deletePlan = useCallback(
    async (
      planId: number,
      options?: RequestOptions<void>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await planServicesService.deletePlan(planId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Plan deleted successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to delete plan");
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
    addPlan,
    updatePlan,
    deletePlan,
    setError,
  };
};

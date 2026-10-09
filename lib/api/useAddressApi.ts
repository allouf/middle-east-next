"use client";

import { useCallback, useState } from "react";
import api from "./index";
import type { AxiosError } from "axios";
import { App } from "antd";

type ApiMessageResponse<T = unknown> = {
  message?: string;
  data?: T;
  [key: string]: unknown;
};

type HookError = string | null;

type ApiOptions<TResponse = unknown> = {
  onSuccess?: (data: TResponse) => void;
  onError?: (error: unknown) => void;
  showMessage?: boolean;
};

export type AddressPayload = {
  title?: string;
  address: string;
  city: string;
  country: string;
  country_code: string;
  postal_code: string;
  region: string;
  lat: number;
  lng: number;
  is_default: boolean;
};

const getErrorMessage = (err: unknown, fallback: string): string => {
  const axiosErr = err as AxiosError<any>;
  return (
    axiosErr?.response?.data?.message ||
    axiosErr?.message ||
    (typeof err === "string" ? err : fallback)
  );
};

/**
 * Custom hook for address API operations
 */
const useAddressApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HookError>(null);
  const { message: messageApi } = App.useApp();
  /**
   * Fetch all addresses
   * GET /addresses
   */
  const fetchAddresses = useCallback(async <TResponse = unknown>() => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<TResponse>("/addresses");
      return response.data;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to fetch addresses");
      setError(errorMessage);
      console.error("Fetch addresses error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add new address
   * POST /addresses/add
   */
  const addAddress = useCallback(
    async <TResponse = ApiMessageResponse>(
      data: AddressPayload,
      options: ApiOptions<TResponse> = {}
    ) => {
      setLoading(true);
      setError(null);

      const { onSuccess, onError, showMessage = true } = options;

      try {
        const response = await api.post<TResponse>("/addresses/add", data, {
          headers: { "Content-Type": "application/json" },
        });

        const resData = response.data;

        const message =
          (resData as any)?.message ||
          (resData as any)?.data?.message ||
          undefined;

        if (showMessage && message) messageApi.success(String(message), 2);
        onSuccess?.(resData);

        return resData;
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to add address");
        setError(errorMessage);

        if (showMessage) messageApi.error(errorMessage, 2);
        onError?.(err);

        console.error("Add address error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Update address
   * PUT /addresses/update/{id}
   */
  const updateAddress = useCallback(
    async <TResponse = ApiMessageResponse>(
      id: number | string,
      data: AddressPayload,
      options: ApiOptions<TResponse> = {}
    ) => {
      setLoading(true);
      setError(null);

      const { onSuccess, onError, showMessage = true } = options;

      try {
        const response = await api.put<TResponse>(`/addresses/update/${id}`, data, {
          headers: { "Content-Type": "application/json" },
        });

        const resData = response.data;
        const message =
          (resData as any)?.message ||
          (resData as any)?.data?.message ||
          undefined;

        if (showMessage && message) messageApi.success(String(message), 2);
        onSuccess?.(resData);

        return resData;
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to update address");
        setError(errorMessage);

        if (showMessage) messageApi.error(errorMessage, 2);
        onError?.(err);

        console.error("Update address error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Delete address
   * DELETE /addresses/delete/{id}
   */
  const deleteAddress = useCallback(
    async <TResponse = ApiMessageResponse>(
      id: number | string,
      options: ApiOptions<TResponse> = {}
    ) => {
      setLoading(true);
      setError(null);

      const { onSuccess, onError, showMessage = true } = options;

      try {
        const response = await api.delete<TResponse>(`/addresses/delete/${id}`);
        const resData = response.data;

        const message =
          (resData as any)?.message ||
          (resData as any)?.data?.message ||
          undefined;

        if (showMessage && message) messageApi.success(String(message), 2);
        onSuccess?.(resData);

        return resData;
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to delete address");
        setError(errorMessage);

        if (showMessage) messageApi.error(errorMessage, 2);
        onError?.(err);

        console.error("Delete address error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  };
};

export default useAddressApi;

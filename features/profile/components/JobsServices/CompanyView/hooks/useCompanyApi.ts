"use client";

import { App } from "antd";
import { AxiosError } from "axios";
import { useCallback, useRef, useState } from "react";
import { CompanyProfile } from "../types";
import api from "@/lib/api";
import { JOBS_ENDPOINTS } from "@/shared/constants/urls";

export type ApiResponse<T = unknown> = {
  status?: boolean;
  message?: string;
  data?: T;
};

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

type RequestOptions<TSuccess = unknown> = {
  showMessage?: boolean;
  onSuccess?: (data: ApiResponse<TSuccess>) => void;
  onError?: (error: AxiosError<ApiErrorResponse> | Error) => void;
};

const useCompanyApi = () => {
  const { message: messageApi } = App.useApp();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ store last options for refetch
  const lastOptionsRef = useRef<RequestOptions<CompanyProfile> | undefined>(undefined);

  const getErrorMessage = useCallback((err: unknown, fallback: string) => {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    return (
      axiosErr?.response?.data?.message ||
      axiosErr?.message ||
      fallback
    );
  }, []);

  const getMyCompanyProfile = useCallback(
    async (options?: RequestOptions<CompanyProfile>) => {
      lastOptionsRef.current = options; // ✅ save last options

      const { showMessage = false, onSuccess, onError } = options ?? {};

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<ApiResponse<CompanyProfile>>(
          JOBS_ENDPOINTS.myCompany
        );

        if (showMessage) {
          messageApi.success(response.data?.message || "Loaded successfully.");
        }

        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const errMsg = getErrorMessage(err, "Failed to fetch company profile.");
        setError(errMsg);

        if (showMessage) messageApi.error(errMsg);

        onError?.(err as AxiosError<ApiErrorResponse> | Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getErrorMessage, messageApi]
  );

  const refetch = useCallback(() => {
    return getMyCompanyProfile(lastOptionsRef.current);
  }, [getMyCompanyProfile]);

  return {
    loading,
    error,
    getMyCompanyProfile,
    refetch,
    setError,
  };
};

export default useCompanyApi;
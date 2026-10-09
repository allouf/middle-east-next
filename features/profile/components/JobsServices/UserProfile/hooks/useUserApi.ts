"use client";

import { App } from "antd";
import { AxiosError } from "axios";
import { useCallback, useRef, useState } from "react";
import { UserProfile } from "../types";
import api from "@/lib/api";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";

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

const useUserApi = () => {
  const { message: messageApi } = App.useApp();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ store last options for refetch
  const lastOptionsRef = useRef<RequestOptions<UserProfile> | undefined>(undefined);

  const getErrorMessage = useCallback((err: unknown, fallback: string) => {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    return (
      axiosErr?.response?.data?.message ||
      axiosErr?.message ||
      fallback
    );
  }, []);

  const getMyUserProfile = useCallback(
    async (options?: RequestOptions<UserProfile>) => {
      lastOptionsRef.current = options; // ✅ save last options

      const { showMessage = false, onSuccess, onError } = options ?? {};

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<ApiResponse<UserProfile>>(
          JOBS_ENDPOINTS.getMyProfileUser
        );

        if (showMessage) {
          messageApi.success(response.data?.message || "Profile loaded successfully.");
        }

        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const errMsg = getErrorMessage(err, "Failed to fetch user profile.");
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
    return getMyUserProfile(lastOptionsRef.current);
  }, [getMyUserProfile]);

  return {
    loading,
    error,
    getMyUserProfile,
    refetch,
    setError,
  };
};

export default useUserApi;

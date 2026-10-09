"use client";

import { useCallback, useState } from "react";
import { App } from "antd";
import { providerRfqService, ProviderRfqListResponse } from "../../services/provider-rfq.service";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import {
  ProviderRfqItem,
  ProviderRfqDetail,
  ProviderRfqFilters,
  ProviderRfqMeta,
  ProviderQuoteSubmission,
  ProviderQuoteUpdate,
  ProviderQuoteItem,
} from "../../types/providerRfq.types";
import { RequestOptions } from "../../types/provider.types";

export const useProviderRfqApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<Record<string, string[]> | null>(null);
  const [requests, setRequests] = useState<ProviderRfqItem[]>([]);
  const [requestDetail, setRequestDetail] = useState<ProviderRfqDetail | null>(null);
  const [meta, setMeta] = useState<ProviderRfqMeta | null>(null);
  const [quoteHistory, setQuoteHistory] = useState<ProviderQuoteItem[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const fetchDiscoverRequests = useCallback(
    async (params?: ProviderRfqFilters, options?: RequestOptions<ProviderRfqListResponse>) => {
      setLoading(true);
      setError(null);
      setValidationError(null);

      try {
        const response = await providerRfqService.getDiscoverRequests(params, {
          ...options,
          onSuccess: (data) => {
            const payload = (data as any)?.data ?? data;
            const nestedData = payload?.data;
            const normalizedRequests = Array.isArray(payload?.requests)
              ? payload.requests
              : Array.isArray(nestedData)
                ? nestedData
                : Array.isArray(payload)
                  ? payload
                  : [];

            setRequests(normalizedRequests);
            setMeta(payload?.meta || null);

            if (options?.showMessage) {
              messageApi.success(data.message || "Discover requests loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const axiosErr = error as any;
            
            // Extract validation errors if present
            if (axiosErr?.response?.data?.errors) {
              setValidationError(axiosErr.response.data.errors);
            }
            
            const errorMessage = getApiErrorMessage(error, "Failed to fetch discover requests");
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



  const submitQuote = useCallback(
    async (
      requestId: string,
      data: ProviderQuoteSubmission,
      options?: RequestOptions<ProviderQuoteItem>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerRfqService.submitQuote(requestId, data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Quote submitted successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to submit quote");
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

  const updateQuote = useCallback(
    async (
      quoteId: string,
      data: ProviderQuoteUpdate,
      options?: RequestOptions<ProviderQuoteItem>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerRfqService.updateQuote(quoteId, data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Quote updated successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to update quote");
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

  const cancelQuote = useCallback(
    async (
      quoteId: string,
      options?: RequestOptions<ProviderQuoteItem>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerRfqService.cancelQuote(quoteId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Quote withdrawn successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to withdraw quote");
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

  const fetchQuoteHistory = useCallback(
    async (
      params?: { page?: number; per_page?: number },
      options?: RequestOptions<ProviderQuoteItem[]>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await providerRfqService.getQuoteHistory(params, {
          ...options,
          onSuccess: (data) => {
            if (data.data) {
              setQuoteHistory(Array.isArray(data.data) ? data.data : []);
            }

            if (options?.showMessage) {
              messageApi.success(data.message || "Quote history loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch quote history");
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

  const fetchCategories = useCallback(
    async (options?: RequestOptions<{ id: number; name: string }[]>) => {
      try {
        const response = await providerRfqService.getCategories({
          ...options,
          onSuccess: (data) => {
            if (data.data) {
              setCategories(Array.isArray(data.data) ? data.data : []);
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            options?.onError?.(error);
          },
        });

        return response;
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        return null;
      }
    },
    []
  );

  return {
    loading,
    error,
    validationError,
    requests,
    requestDetail,
    meta,
    quoteHistory,
    categories,
    fetchDiscoverRequests,
    submitQuote,
    updateQuote,
    cancelQuote,
    fetchQuoteHistory,
    fetchCategories,
    setError,
    setValidationError,
  };
};

"use client";

import { useCallback, useState } from "react";
import { App } from "antd";
import { rfqService } from "../services/rfq.service";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { RequestItem, QuoteItem, RequestDetail, RequestStatus } from "../types/Rfq";
import { RequestOptions } from "../types/client.types";

export const useRfqClientApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [requestDetail, setRequestDetail] = useState<RequestDetail | null>(null);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  }>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    has_more: false,
  });

  const extractRequestsFromResponse = useCallback((response: any): { requests: RequestItem[]; meta: any } => {
    // Extract the requests array from the new API response structure
    let newRequests = response?.data?.custom_requests ?? response?.data?.data?.custom_requests ?? response?.data ?? [];
    
    // Double ensure we have an array
    if (!Array.isArray(newRequests)) {
      console.warn('Response data is not an array:', newRequests);
      newRequests = [];
    }

    // Extract meta information
    const responseMeta = response?.data?.meta ?? response?.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: newRequests.length,
      has_more: false,
    };

    return { requests: newRequests, meta: responseMeta };
  }, []);

  const fetchRequests = useCallback(
    async (params?: { page?: number; per_page?: number; status?: string }, options?: RequestOptions<RequestItem[]>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.getRequests(params, {
          ...options,
          onSuccess: (data) => {
            // Extract and set requests and meta from response
            const { requests: extractedRequests, meta: extractedMeta } = extractRequestsFromResponse(data);
            setRequests(extractedRequests);
            setMeta(extractedMeta);

            if (options?.showMessage) {
              messageApi.success(data.message || "Requests loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch requests");
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
    [messageApi, extractRequestsFromResponse]
  );

  const fetchRequestById = useCallback(
    async (requestId: string, options?: RequestOptions<RequestItem>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.getRequestById(requestId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Request loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch request");
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

  const showRequest = useCallback(
    async (requestId: string, options?: RequestOptions<RequestDetail>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.showRequest(requestId, {
          ...options,
          onSuccess: (data) => {
            // Set the request detail in state
            if (data.data) {
              setRequestDetail(data.data);
            }
            
            if (options?.showMessage) {
              messageApi.success(data.message || "Request details loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch request details");
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

  const createRequest = useCallback(
    async (data: FormData, options?: RequestOptions<RequestItem>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.createRequest(data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Request created successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to create request");
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

  const updateRequest = useCallback(
    async (requestId: string, data: FormData, options?: RequestOptions<RequestItem>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.updateRequest(requestId, data, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Request updated successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to update request");
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

  const deleteRequest = useCallback(
    async (requestId: string, options?: RequestOptions<void>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.deleteRequest(requestId, {
          ...options,
          onSuccess: (data) => {
            // Remove the deleted request from state
            setRequests((prev) => prev.filter((req) => String(req.id) !== requestId));
            
            if (options?.showMessage) {
              messageApi.success(data.message || "Request deleted successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to delete request");
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

  const fetchRequestQuotes = useCallback(
    async (requestId: string, options?: RequestOptions<QuoteItem[]>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.getRequestQuotes(requestId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Quotes loaded successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to fetch quotes");
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

  const closeRequest = useCallback(
    async (requestId: string, options?: RequestOptions<RequestItem>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.closeRequest(requestId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Request closed successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to close request");
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

  const cancelRequest = useCallback(
    async (requestId: string, options?: RequestOptions<RequestItem>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.cancelRequest(requestId, {
          ...options,
          onSuccess: (data) => {
            // Update the request status in local state
            setRequests((prev) =>
              prev.map((req) =>
                String(req.id) === requestId
                  ? { ...req, status: "Canceled" as RequestStatus }
                  : req
              )
            );
            
            if (options?.showMessage) {
              messageApi.success(data.message || "Request cancelled successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to cancel request");
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

  const acceptQuote = useCallback(
    async (quoteId: string, options?: RequestOptions<QuoteItem>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.acceptQuote(quoteId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Quote accepted successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to accept quote");
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

  const processPayment = useCallback(
    async (orderId: string, options?: RequestOptions<any>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rfqService.processPayment(orderId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Payment processed successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = getApiErrorMessage(error, "Failed to process payment");
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

  const refetch = useCallback(
    async (params?: { page?: number; per_page?: number; status?: string }, options?: RequestOptions<RequestItem[]>) => {
      return fetchRequests(params, {
        ...options,
        showMessage: options?.showMessage ?? false,
      });
    },
    [fetchRequests]
  );

  return {
    loading,
    error,
    requests,
    requestDetail,
    meta,
    fetchRequests,
    fetchRequestById,
    showRequest,
    createRequest,
    updateRequest,
    deleteRequest,
    fetchRequestQuotes,
    closeRequest,
    cancelRequest,
    acceptQuote,
    processPayment,
    refetch,
    setError,
  };
};

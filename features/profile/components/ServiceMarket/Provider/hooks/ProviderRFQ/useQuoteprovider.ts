"use client";

import { useCallback, useState } from "react";
import { useQuoteForm, QuoteFormState } from "./useQuoteForm";
import { useProviderRfqApi } from "./useProviderRfqApi";
import { providerRfqService } from "../../services/provider-rfq.service";
import { ProviderRfqDetail, ProviderRfqFilters, QuoteStats, ProviderQuoteItem } from "../../types/providerRfq.types";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { App } from "antd";

interface UseQuoteSubmissionArgs {
  initial?: Partial<QuoteFormState>;
  required?: {
    proposed_budget?: boolean;
    estimated_delivery_date?: boolean;
    cover_letter_or_message?: boolean;
  };
  onSuccess?: () => void;
}

export const useQuoteprovider = (args: UseQuoteSubmissionArgs = {}) => {
  const { message: messageApi } = App.useApp();
  const [requestDetail, setRequestDetail] = useState<ProviderRfqDetail | null>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [quoteStats, setQuoteStats] = useState<QuoteStats | null>(null);
  const [quoteStatsLoading, setQuoteStatsLoading] = useState<boolean>(false);
  const [quoteStatsError, setQuoteStatsError] = useState<string | null>(null);
  const [quoteHistory, setQuoteHistory] = useState<ProviderQuoteItem[]>([]);
  const [quoteHistoryLoading, setQuoteHistoryLoading] = useState<boolean>(false);
  const [quoteHistoryError, setQuoteHistoryError] = useState<string | null>(null);

  const formHook = useQuoteForm({
    initial: args.initial,
    required: args.required,
  });

  const apiHook = useProviderRfqApi();

  const submitQuote = useCallback(async (requestId: string | number) => {
    formHook.setIsSubmitted(true);
    
    if (!formHook.validate()) {
      console.log('Quote form validation failed:', formHook.errors);
      return { ok: false as const, errors: formHook.errors };
    }

    const payload = formHook.preparePayload();
    
    try {
      const result = await apiHook.submitQuote(String(requestId), payload, {
        showMessage: true,
        onSuccess: () => {
          args?.onSuccess?.();
          formHook.resetForm();
        },
      });

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to submit quote" };
    }
  }, [formHook, apiHook, args?.onSuccess]);

  const submitQuoteWithValidation = useCallback(async (
    requestId: string | number,
    quoteData: {
      proposed_budget: number;
      estimated_delivery_date: string;
      cover_letter_or_message: string;
    }
  ) => {
    formHook.setIsSubmitted(true);
    
    // Validate individual fields
    if (!quoteData.proposed_budget || quoteData.proposed_budget <= 0) {
      return { ok: false as const, error: "Proposed budget must be a positive number" };
    }
    
    if (!quoteData.estimated_delivery_date?.trim()) {
      return { ok: false as const, error: "Estimated delivery date is required" };
    }
    
    const deliveryDate = new Date(quoteData.estimated_delivery_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(deliveryDate.getTime())) {
      return { ok: false as const, error: "Please enter a valid delivery date" };
    }
    
    if (deliveryDate < today) {
      return { ok: false as const, error: "Delivery date cannot be in the past" };
    }
    
    if (!quoteData.cover_letter_or_message?.trim()) {
      return { ok: false as const, error: "Cover letter or message is required" };
    }
    
    if (quoteData.cover_letter_or_message.length < 10) {
      return { ok: false as const, error: "Cover letter must be at least 10 characters long" };
    }

    try {
      const result = await apiHook.submitQuote(String(requestId), quoteData, {
        showMessage: true,
        onSuccess: () => {
          args?.onSuccess?.();
          formHook.setIsSubmitted(false);
        },
      });

      return { ok: !!result };
    } catch (error) {
      return { ok: false as const, error: "Failed to submit quote" };
    }
  }, [formHook, apiHook, args?.onSuccess]);

  const quickSubmitQuote = useCallback(async (
    requestId: string | number,
    budget: number,
    deliveryDate: string,
    message: string
  ) => {
    return submitQuoteWithValidation(requestId, {
      proposed_budget: budget,
      estimated_delivery_date: deliveryDate,
      cover_letter_or_message: message,
    });
  }, [submitQuoteWithValidation]);

  const fetchDiscoverRequestDetails = useCallback(async (requestId: string | number) => {
    setDetailsLoading(true);
    setDetailsError(null);

    try {
      const response = await providerRfqService.getDiscoverRequestById(String(requestId), {
        onSuccess: (data) => {
   

          if (data.data) {
            setRequestDetail(data.data);
          }
        },
        onError: (error) => {
          const errorMessage = getApiErrorMessage(error, "Failed to fetch request details");
          setDetailsError(errorMessage);
          messageApi.error(errorMessage);
        }
      });

      return response;
    } catch (error) {
      const errorMessage = "An unexpected error occurred while fetching request details";
      setDetailsError(errorMessage);
      messageApi.error(errorMessage);
      return null;
    } finally {
      setDetailsLoading(false);
    }
  }, [messageApi]);

  const fetchQuoteStats = useCallback(async () => {
    setQuoteStatsLoading(true);
    setQuoteStatsError(null);

    try {
      const response = await providerRfqService.getQuoteStats({
        onSuccess: (data) => {
          if (data.data) {
            setQuoteStats(data.data);
          }
        },
        onError: (error) => {
          const errorMessage = getApiErrorMessage(error, "Failed to fetch quote statistics");
          setQuoteStatsError(errorMessage);
          messageApi.error(errorMessage);
        }
      });

      return response;
    } catch (error) {
      const errorMessage = "An unexpected error occurred while fetching quote statistics";
      setQuoteStatsError(errorMessage);
      messageApi.error(errorMessage);
      return null;
    } finally {
      setQuoteStatsLoading(false);
    }
  }, [messageApi]);

  const fetchQuoteHistory = useCallback(async () => {
    setQuoteHistoryLoading(true);
    setQuoteHistoryError(null);

    try {
      const response = await providerRfqService.getProviderQuotes({
        onSuccess: (data) => {
          if (data.data) {
            setQuoteHistory(data.data || []);
          }
        },
        onError: (error) => {
          const errorMessage = getApiErrorMessage(error, "Failed to fetch quote history");
          setQuoteHistoryError(errorMessage);
          messageApi.error(errorMessage);
        }
      });

      return response;
    } catch (error) {
      const errorMessage = "An unexpected error occurred while fetching quote history";
      setQuoteHistoryError(errorMessage);
      messageApi.error(errorMessage);
      return null;
    } finally {
      setQuoteHistoryLoading(false);
    }
  }, [messageApi]);

  return {
    ...apiHook,
    ...formHook,
    requestDetail,
    detailsLoading,
    detailsError,
    fetchDiscoverRequestDetails,
    quoteStats,
    quoteStatsLoading,
    quoteStatsError,
    fetchQuoteStats,
    quoteHistory,
    quoteHistoryLoading,
    quoteHistoryError,
    fetchQuoteHistory,
    submitQuote,
    submitQuoteWithValidation,
    quickSubmitQuote,
  };
};

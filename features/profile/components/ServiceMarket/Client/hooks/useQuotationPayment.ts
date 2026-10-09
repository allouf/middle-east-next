"use client";

import { useCallback, useState } from "react";
import { App } from "antd";
import { paymentService } from "../services/payment.service";
import {
  PaymentOrder,
  PaymentFormData,
  PaymentResponse,
  PaymentProcessingState
} from "../types/Payment";
import { RequestOptions } from "../types/client.types";

export const useQuotationPayment = (orderId: string) => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrder | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentProcessingState>({
    isProcessing: false,
    error: null,
    paymentId: null,
  });

  const fetchPaymentOrder = useCallback(
    async (options?: RequestOptions<PaymentOrder>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await paymentService.getPaymentOrder(orderId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Payment order loaded successfully.");
            }
            if (data.data) {
              setPaymentOrder(data.data);
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = error.message || "Failed to fetch payment order";
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
    [orderId, messageApi]
  );

  const processPayment = useCallback(
    async (options?: RequestOptions<PaymentResponse>) => {
      setLoading(true);
      setPaymentState(prev => ({ ...prev, isProcessing: true, error: null }));
      setError(null);

      try {
        const response = await paymentService.processPayment(orderId, "mada", {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Payment processed successfully.");
            }
            setPaymentState(prev => ({
              ...prev,
              isProcessing: false,
              paymentId: data.data?.paymentId || null
            }));
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = error.message || "Failed to process payment";
            setError(errorMessage);
            setPaymentState(prev => ({
              ...prev,
              isProcessing: false,
              error: errorMessage
            }));

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
    [orderId, messageApi]
  );

  const validatePayment = useCallback(
    async (paymentId: string, options?: RequestOptions<PaymentResponse>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await paymentService.validatePayment(paymentId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Payment validated successfully.");
            }
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = error.message || "Failed to validate payment";
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

  const cancelPayment = useCallback(
    async (paymentId: string, options?: RequestOptions<PaymentResponse>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await paymentService.cancelPayment(paymentId, {
          ...options,
          onSuccess: (data) => {
            if (options?.showMessage) {
              messageApi.success(data.message || "Payment cancelled successfully.");
            }
            setPaymentState({
              isProcessing: false,
              error: null,
              paymentId: null,
            });
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            const errorMessage = error.message || "Failed to cancel payment";
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

  const resetPaymentState = useCallback(() => {
    setPaymentState({
      isProcessing: false,
      error: null,
      paymentId: null,
    });
    setError(null);
  }, []);

  // Initialize payment order on mount
  const initializePayment = useCallback(() => {
    fetchPaymentOrder({
      onError: () => {
        // Set fallback data for now until API is ready
        setPaymentOrder({
          id: "PAY-2024-001",
          rfqId: orderId,
          servicePrice: "50.00",
          vat: "2.50",
          fees: "0.00",
          totalAmount: "52.50",
          paymentStatus: "PENDING",
          currency: "USD",
          createdAt: new Date().toISOString(),
        });
      }
    });
  }, [orderId, fetchPaymentOrder]);

  return {
    // State
    loading,
    error,
    paymentOrder,
    paymentState,

    // Actions
    fetchPaymentOrder,
    processPayment,
    validatePayment,
    cancelPayment,
    resetPaymentState,
    initializePayment,
    setError,
  };
};

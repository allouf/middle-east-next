import api from "@/lib/api";
import { SERVICE_MARKET_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ApiResponse, RequestOptions } from "../types/client.types";
import { PaymentResponse, PaymentFormData, PaymentOrder } from "../types/Payment";
import { useProviderApiStore } from "../../stores/providerApiStore";

export interface PaymentService {
  processPayment: (
    orderId: string,
    paymentMethod: string,
    options?: RequestOptions<PaymentResponse>
  ) => Promise<ApiResponse<PaymentResponse> | null>;

  getPaymentOrder: (
    orderId: string,
    options?: RequestOptions<PaymentOrder>
  ) => Promise<ApiResponse<PaymentOrder> | null>;
  
  validatePayment: (
    paymentId: string,
    options?: RequestOptions<PaymentResponse>
  ) => Promise<ApiResponse<PaymentResponse> | null>;
  
  cancelPayment: (
    paymentId: string,
    options?: RequestOptions<PaymentResponse>
  ) => Promise<ApiResponse<PaymentResponse> | null>;
}

export const paymentService: PaymentService = {
  processPayment: async (orderId, paymentMethod, options) => {
    try {
      const response = await api.post<ApiResponse<PaymentResponse>>(
        SERVICE_MARKET_ENDPOINTS.processPayment(orderId),
        { payment_method: paymentMethod },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data) {
        options?.onSuccess?.(response.data);
      }

      return response.data;
    } catch (error: any) {
      console.log("Payment API call failed:", error);

      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        options?.onError?.(error as Error);
        return null;
      }

      options?.onError?.(error as Error);
      return null;
    }
  },

  getPaymentOrder: async (orderId, options) => {
    try {
      const response = await api.get<ApiResponse<PaymentOrder>>(
        SERVICE_MARKET_ENDPOINTS.processPayment(orderId).replace('/process-payment', '')
      );
      
      if (response.data) {
        options?.onSuccess?.(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      console.log("Get payment order API call failed:", error);
      
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  validatePayment: async (paymentId, options) => {
    try {
      const response = await api.post<ApiResponse<PaymentResponse>>(
        `/api/payment/${paymentId}/validate`,
        {}
      );
      
      if (response.data) {
        options?.onSuccess?.(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      console.log("Validate payment API call failed:", error);
      
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  cancelPayment: async (paymentId, options) => {
    try {
      const response = await api.post<ApiResponse<PaymentResponse>>(
        `/api/payment/${paymentId}/cancel`,
        {}
      );
      
      if (response.data) {
        options?.onSuccess?.(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      console.log("Cancel payment API call failed:", error);
      
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },
};

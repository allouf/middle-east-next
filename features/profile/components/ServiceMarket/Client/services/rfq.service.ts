import api from "@/lib/api";
import { SERVICE_MARKET_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ApiResponse, RequestOptions } from "../types/client.types";
import { RequestItem, QuoteItem, RequestDetail } from "../types/Rfq";
import { useProviderApiStore } from "../../stores/providerApiStore";

export const rfqService = {
  /**
   * Fetch all RFQ requests for the client
   */
  async getRequests(params?: { page?: number; per_page?: number; status?: string }, options?: RequestOptions<RequestItem[]>): Promise<ApiResponse<RequestItem[]> | null> {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params?.status) queryParams.append('status', params.status);
      
      const queryString = queryParams.toString();
      const url = queryString ? `${SERVICE_MARKET_ENDPOINTS.customRequests}?${queryString}` : SERVICE_MARKET_ENDPOINTS.customRequests;
      
      const response = await api.get<ApiResponse<RequestItem[]>>(
        url
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        // Don't call success callback for 482 errors - treat as error
        options?.onError?.(error as Error);
        return null;
      }

      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Get RFQ request by ID
   */
  async getRequestById(
    requestId: string,
    options?: RequestOptions<RequestItem>
  ): Promise<ApiResponse<RequestItem> | null> {
    try {
      const response = await api.get<ApiResponse<RequestItem>>(
        `${SERVICE_MARKET_ENDPOINTS.clientRFQ}/${requestId}`
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);
      
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Show RFQ request details by ID
   */
  async showRequest(
    requestId: string,
    options?: RequestOptions<RequestDetail>
  ): Promise<ApiResponse<RequestDetail> | null> {
    try {
      const response = await api.get<ApiResponse<RequestDetail>>(
        SERVICE_MARKET_ENDPOINTS.showCustomRequest(requestId)
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);
      
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Create new RFQ request
   */
  async createRequest(
    data: FormData,
    options?: RequestOptions<RequestItem>
  ): Promise<ApiResponse<RequestItem> | null> {
    try {
      const response = await api.post<ApiResponse<RequestItem>>(
        SERVICE_MARKET_ENDPOINTS.customRequests,
        data
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        // Don't call success callback for 482 errors - treat as error
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Update RFQ request
   */
  async updateRequest(
    requestId: string,
    data: FormData,
    options?: RequestOptions<RequestItem>
  ): Promise<ApiResponse<RequestItem> | null> {
    try {
      const response = await api.post<ApiResponse<RequestItem>>(
        `${SERVICE_MARKET_ENDPOINTS.clientRFQ}/${requestId}`,
        data
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        // Don't call success callback for 482 errors - treat as error
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Delete RFQ request
   */
  async deleteRequest(
    requestId: string,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.delete<ApiResponse<void>>(
        `${SERVICE_MARKET_ENDPOINTS.clientRFQ}/${requestId}`
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        // Don't call success callback for 482 errors - treat as error
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Get quotes for a specific RFQ request
   */
  async getRequestQuotes(
    requestId: string,
    options?: RequestOptions<QuoteItem[]>
  ): Promise<ApiResponse<QuoteItem[]> | null> {
    try {
      const response = await api.get<ApiResponse<QuoteItem[]>>(
        `${SERVICE_MARKET_ENDPOINTS.clientRFQ}/${requestId}/quotes`
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);
      
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Cancel RFQ request
   */
  async cancelRequest(
    requestId: string,
    options?: RequestOptions<RequestItem>
  ): Promise<ApiResponse<RequestItem> | null> {
    try {
      const response = await api.post<ApiResponse<RequestItem>>(
        SERVICE_MARKET_ENDPOINTS.cancelRequest(requestId)
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        // Don't call success callback for 482 errors - treat as error
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Accept a quote for an RFQ request
   */
  async acceptQuote(
    quoteId: string,
    options?: RequestOptions<QuoteItem>
  ): Promise<ApiResponse<QuoteItem> | null> {
    try {
      const response = await api.post<ApiResponse<QuoteItem>>(
        SERVICE_MARKET_ENDPOINTS.acceptQuote(quoteId)
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        // Don't call success callback for 482 errors - treat as error
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Close/Cancel RFQ request
   */
  async closeRequest(
    requestId: string,
    options?: RequestOptions<RequestItem>
  ): Promise<ApiResponse<RequestItem> | null> {
    try {
      const response = await api.post<ApiResponse<RequestItem>>(
        `${SERVICE_MARKET_ENDPOINTS.clientRFQ}/${requestId}/close`
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        // Don't call success callback for 482 errors - treat as error
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Process payment for a custom request order
   */
  async processPayment(
    orderId: string,
    options?: RequestOptions<any>
  ): Promise<ApiResponse<any> | null> {
    try {
      const response = await api.post<ApiResponse<any>>(
        SERVICE_MARKET_ENDPOINTS.processPayment(orderId)
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
        // Don't call success callback for 482 errors - treat as error
        options?.onError?.(error as Error);
        return null;
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },
};

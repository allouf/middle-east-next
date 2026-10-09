import api from "@/lib/api";
import { PROVIDER_RFQ_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ApiResponse, RequestOptions } from "../types/provider.types";
import { useProviderApiStore } from "../../stores";
import {
  ProviderRfqItem,
  ProviderRfqDetail,
  ProviderRfqFilters,
  ProviderQuoteSubmission,
  ProviderQuoteUpdate,
  ProviderQuoteItem,
  ProviderRfqMeta,
  QuoteStats,
} from "../types/providerRfq.types";

export interface ProviderRfqListResponse {
  data: ProviderRfqItem[];
  meta: ProviderRfqMeta;
}

export const providerRfqService = {


  /**
   * Fetch all available RFQ requests from discover/requests endpoint
   */
  async getDiscoverRequests(
    params?: ProviderRfqFilters,
    options?: RequestOptions<ProviderRfqListResponse>
  ): Promise<ApiResponse<ProviderRfqListResponse> | null> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
      if (params?.category_id) queryParams.append("category_id", params.category_id.toString());
      if (params?.deadline_from) queryParams.append("deadline_from", params.deadline_from);
      if (params?.deadline_to) queryParams.append("deadline_to", params.deadline_to);
      if (params?.deadline_preset) queryParams.append("deadline_preset", params.deadline_preset);
      if (params?.budget_min) queryParams.append("budget_min", params.budget_min.toString());
      if (params?.budget_max) queryParams.append("budget_max", params.budget_max.toString());
      const queryString = queryParams.toString();
      const url = queryString
        ? `${PROVIDER_RFQ_ENDPOINTS.discoverRequests}?${queryString}`
        : PROVIDER_RFQ_ENDPOINTS.discoverRequests;

      const response = await api.get<ApiResponse<ProviderRfqListResponse>>(url);

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

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
   * Get discover request details by ID
   */
  async getDiscoverRequestById(
    requestId: string,
    options?: RequestOptions<ProviderRfqDetail>
  ): Promise<ApiResponse<ProviderRfqDetail> | null> {
    try {
      const response = await api.get<ApiResponse<ProviderRfqDetail>>(
        PROVIDER_RFQ_ENDPOINTS.discoverRequestDetails(requestId)
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

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
   * Get provider quote statistics
   */
  async getQuoteStats(
    options?: RequestOptions<QuoteStats>
  ): Promise<ApiResponse<QuoteStats> | null> {
    try {
      const response = await api.get<ApiResponse<QuoteStats>>(
        PROVIDER_RFQ_ENDPOINTS.quoteStats
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

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
   * Get provider quote history
   */
  async getProviderQuotes(
    options?: RequestOptions<ProviderQuoteItem[]>
  ): Promise<ApiResponse<ProviderQuoteItem[]> | null> {
    try {
      const response = await api.get<ApiResponse<ProviderQuoteItem[]>>(
        PROVIDER_RFQ_ENDPOINTS.myQuotes
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

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
   * Submit a quote for an RFQ request
   */
  async submitQuote(
    requestId: string,
    data: ProviderQuoteSubmission,
    options?: RequestOptions<ProviderQuoteItem>
  ): Promise<ApiResponse<ProviderQuoteItem> | null> {
    try {
      const response = await api.post<ApiResponse<ProviderQuoteItem>>(
        PROVIDER_RFQ_ENDPOINTS.submitQuote(requestId),
        data
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

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
   * Update an existing quote (only when status is Pending)
   */
  async updateQuote(
    quoteId: string,
    data: ProviderQuoteUpdate,
    options?: RequestOptions<ProviderQuoteItem>
  ): Promise<ApiResponse<ProviderQuoteItem> | null> {
    try {
      const response = await api.put<ApiResponse<ProviderQuoteItem>>(
        PROVIDER_RFQ_ENDPOINTS.updateQuote(quoteId),
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

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

  /**
   * Cancel/withdraw a quote
   */
  async cancelQuote(
    quoteId: string,
    options?: RequestOptions<ProviderQuoteItem>
  ): Promise<ApiResponse<ProviderQuoteItem> | null> {
    try {
      const response = await api.patch<ApiResponse<ProviderQuoteItem>>(
        PROVIDER_RFQ_ENDPOINTS.cancelQuote(quoteId),
        {},
        { headers: { "Content-Type": "application/json" } }
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

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

  /**
   * Get provider's quote history
   */
  async getQuoteHistory(
    params?: { page?: number; per_page?: number },
    options?: RequestOptions<ProviderQuoteItem[]>
  ): Promise<ApiResponse<ProviderQuoteItem[]> | null> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page) queryParams.append("per_page", params.per_page.toString());

      const queryString = queryParams.toString();
      const url = queryString
        ? `${PROVIDER_RFQ_ENDPOINTS.myQuotes}?${queryString}`
        : PROVIDER_RFQ_ENDPOINTS.myQuotes;

      const response = await api.get<ApiResponse<ProviderQuoteItem[]>>(url);

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

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
   * Get categories for filtering
   */
  async getCategories(
    options?: RequestOptions<{ id: number; name: string }[]>
  ): Promise<ApiResponse<{ id: number; name: string }[]> | null> {
    try {
      const response = await api.get<ApiResponse<{ id: number; name: string }[]>>(
        PROVIDER_RFQ_ENDPOINTS.categories
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

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

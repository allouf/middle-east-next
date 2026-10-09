import api from "@/lib/api";
import { PROVIDER_SERVICES_ORDERS } from "@/shared/constants/api-endpoints";
import { 
  ApiResponse, 
  OrderListResponse, 
  OrderDetails, 
  OrderFilters, 
  RequestOptions 
} from "../types/provider.types";
import { useProviderApiStore } from "../../stores";

export const providerOrdersService = {
  /**
   * Fetch provider orders list
   */
  async getOrders(
    filters?: OrderFilters,
    options?: RequestOptions<OrderListResponse>
  ): Promise<ApiResponse<OrderListResponse> | null> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const url = params.toString() 
        ? `${PROVIDER_SERVICES_ORDERS.getAll}?${params.toString()}`
        : PROVIDER_SERVICES_ORDERS.getAll;

      const response = await api.get<ApiResponse<OrderListResponse>>(url);

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Get order details by ID
   */
  async getOrderById(
    orderId: string | number,
    options?: RequestOptions<OrderDetails>
  ): Promise<ApiResponse<OrderDetails> | null> {
    try {
      const response = await api.get<ApiResponse<OrderDetails>>(
        PROVIDER_SERVICES_ORDERS.getDetails(orderId)
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Confirm/Start order
   */
  async confirmOrder(
    orderId: string | number,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        PROVIDER_SERVICES_ORDERS.confirm(orderId)
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Deliver order
   */
  async deliverOrder(
    orderId: string | number,
    message: string,
    attachments: File[],
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const formData = new FormData();
      formData.append('message', message);
      attachments.forEach((file) => {
        formData.append('attachments[]', file);
      });

      const response = await api.post<ApiResponse<void>>(
        PROVIDER_SERVICES_ORDERS.deliver(orderId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Cancel order
   */
  async cancelOrder(
    orderId: string | number,
    reason?: string,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        PROVIDER_SERVICES_ORDERS.cancel(orderId),
        { reason }
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Accept order (e.g. for initial request or revision)
   */
  async acceptOrder(
    orderId: string | number,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        PROVIDER_SERVICES_ORDERS.accept(orderId)
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Reject order (e.g. for initial request or revision)
   */
  async rejectOrder(
    orderId: string | number,
    reason_id: number,
    notes: string,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        PROVIDER_SERVICES_ORDERS.reject(orderId),
        { reason_id, notes }
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * For development mode only: change order status
   */
  async devChangeOrderStatus(
    orderId: string | number,
    status: string,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        `/provider-orders/change-status/${orderId}`,
        { status }
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },
  /**
   * Request order extension
   */
  async requestExtension(
    orderId: string | number,
    data: { days: number; reason_id: number; description: string },
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        PROVIDER_SERVICES_ORDERS.requestExtension(orderId),
        data
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Deliver revision
   */
  async deliverRevision(
    orderId: string | number,
    message: string,
    attachments: File[],
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const formData = new FormData();
      formData.append('message', message);
      attachments.forEach((file) => {
        formData.append('attachments[]', file);
      });

      const response = await api.post<ApiResponse<void>>(
        PROVIDER_SERVICES_ORDERS.deliver(orderId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Reject revision
   */
  async rejectRevision(
    revisionId: string | number,
    rejection_reason: string,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        PROVIDER_SERVICES_ORDERS.rejectRevision(revisionId),
        { rejection_reason }
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },
  /**
   * Accept revision
   */
  async acceptRevision(
    revisionId: string | number,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        PROVIDER_SERVICES_ORDERS.acceptRevision(revisionId)
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Get all disputes
   */
  async getDisputes(
    page: number = 1,
    perPage: number = 10,
    options?: RequestOptions<any>
  ): Promise<ApiResponse<any> | null> {
    try {
      const response = await api.get<ApiResponse<any>>(`/disputes?page=${page}&per_page=${perPage}`);

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Get dispute by ID
   */
  async getDisputeById(
    disputeId: string | number,
    options?: RequestOptions<any>
  ): Promise<ApiResponse<any> | null> {
    try {
      const response = await api.get<ApiResponse<any>>(`/disputes/${disputeId}`);

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Create a dispute for an order
   */
  async createDispute(
    orderId: string | number,
    data: { reason_id: number; description: string },
    options?: RequestOptions<any>
  ): Promise<ApiResponse<any> | null> {
    try {
      const response = await api.post<ApiResponse<any>>(
        `/disputes/orders/${orderId}`,
        data
      );

      // Check for 482 response status
      useProviderApiStore.getState().checkApiResponse(response.data);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      console.log("API call failed:", error);

      // Extract specific error message from API response if available
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      
      // Check for 482 in error response (when API fails with 482 status)
      if (error?.response?.status === 482) {
        console.log("482 detected in error response, checking error data...");
        useProviderApiStore.getState().checkApiResponse(error.response.data);
      }
      
      options?.onError?.(error as Error);
      return null;
    }
  },
};

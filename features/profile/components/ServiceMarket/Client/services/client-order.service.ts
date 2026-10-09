import api from "@/lib/api";
import { CLIENT_SERVICES_ORDERS, CLIENT_DISPUTES_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { 
  ApiResponse, 
  OrderListResponse, 
  OrderDetails, 
  OrderFilters, 
  OrderAction, 
  RequestOptions 
} from "../types/client.types";

export const clientOrderService = {
  /**
   * Create a new service order
   */
  async createOrder(
    formData: FormData,
    options?: RequestOptions<any>
  ): Promise<ApiResponse<any> | null> {
    try {
      const response = await api.post<ApiResponse<any>>(
        CLIENT_SERVICES_ORDERS.create,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Fetch client orders list
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
        ? `${CLIENT_SERVICES_ORDERS.getAll}?${params.toString()}`
        : CLIENT_SERVICES_ORDERS.getAll;

      const response = await api.get<ApiResponse<OrderListResponse>>(url);

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Get order details by ID
   */
  async getOrderById(
    orderId: string,
    options?: RequestOptions<OrderDetails>
  ): Promise<ApiResponse<OrderDetails> | null> {
    try {
      const response = await api.get<ApiResponse<OrderDetails>>(
        CLIENT_SERVICES_ORDERS.getDetails(orderId)
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Cancel order
   */
  async cancelOrder(
    orderId: string,

    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        CLIENT_SERVICES_ORDERS.cancel(orderId)
       
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Accept order delivery
   */
  async acceptOrder(
    orderId: string,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        CLIENT_SERVICES_ORDERS.accept(orderId)
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Reject order delivery
   */
  async rejectOrder(
    orderId: string,
    reason: string,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        CLIENT_SERVICES_ORDERS.reject(orderId),
        { reason }
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Request revision for order
   */
  async requestRevision(
    orderId: string,
    revisionDetails: {
      delivery_version: string | number;
      notes: string;
      request_type: string;
      attachments?: File[];
    },
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const formData = new FormData();
      formData.append('delivery_version', String(revisionDetails.delivery_version));
      formData.append('notes', revisionDetails.notes);
      formData.append('request_type', revisionDetails.request_type);
      
      if (revisionDetails.attachments && revisionDetails.attachments.length > 0) {
        revisionDetails.attachments.forEach((file) => {
          formData.append('attachments[]', file);
        });
      }

      const response = await api.post<ApiResponse<void>>(
        CLIENT_SERVICES_ORDERS.requestRevision(orderId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Submit dispute for order
   */
  async submitDispute(
    orderId: string,
    disputeDetails: {
      reason: string;
      description: string;
      attachments?: any[];
    },
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        CLIENT_SERVICES_ORDERS.submitDispute(orderId),
        disputeDetails
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Upload order attachment
   */
  async uploadAttachment(
    orderId: string,
    file: File,
    options?: RequestOptions<{ url: string; name: string }>
  ): Promise<ApiResponse<{ url: string; name: string }> | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('order_id', orderId);

      const response = await api.post<ApiResponse<{ url: string; name: string }>>(
        CLIENT_SERVICES_ORDERS.uploadAttachment(orderId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },
  /**
   * Approve order extension
   */
  async approveExtension(
    extensionId: string | number,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        CLIENT_SERVICES_ORDERS.approveExtension(extensionId)
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Reject order extension
   */
  async rejectExtension(
    extensionId: string | number,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.post<ApiResponse<void>>(
        CLIENT_SERVICES_ORDERS.rejectExtension(extensionId)
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * List my disputes
   */
  async getDisputes(
    options?: RequestOptions<any>
  ): Promise<ApiResponse<any> | null> {
    try {
      const response = await api.get<ApiResponse<any>>(
        CLIENT_DISPUTES_ENDPOINTS.getAll
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Pay a specific milestone phase. Returns the same shape as createOrder:
   * { order, checkout_url }. Caller should redirect the buyer to checkout_url.
   *
   * For milestone-template orders, payment happens per-phase rather than
   * up-front. The backend exposes POST /service-orders/{order}/phases/{phase}/pay
   * which mints a Stripe Connect Checkout session for the phase's budget.
   */
  async payPhase(
    orderId: string | number,
    phaseId: string | number,
    options?: RequestOptions<any>,
  ): Promise<ApiResponse<any> | null> {
    try {
      const response = await api.post<ApiResponse<any>>(
        CLIENT_SERVICES_ORDERS.phasePay(orderId, phaseId),
      );
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Open dispute for order
   */
  async openDispute(
    orderId: string | number,
    disputeDetails: { reason_id: number; description: string },
    options?: RequestOptions<any>
  ): Promise<ApiResponse<any> | null> {
    try {
      const response = await api.post<ApiResponse<any>>(
        CLIENT_DISPUTES_ENDPOINTS.create(orderId),
        disputeDetails
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Get dispute details
   */
  async getDisputeDetails(
    disputeId: string | number,
    options?: RequestOptions<any>
  ): Promise<ApiResponse<any> | null> {
    try {
      const response = await api.get<ApiResponse<any>>(
        CLIENT_DISPUTES_ENDPOINTS.getDetails(disputeId)
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message;
      if (apiErrorMessage) {
        error.message = apiErrorMessage;
      }
      options?.onError?.(error as Error);
      return null;
    }
  },
};

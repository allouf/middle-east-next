import api from "@/lib/api";
import { ApiResponse, RequestOptions } from "../types/provider.types";
import { useProviderApiStore } from "../../stores";

export interface FAQ {
  id?: number;
  question: string;
  answer: string;
  sort_order: number;
}

export const faqServicesService = {
  /**
   * Add FAQ to service
   */
  async addFaq(
    serviceId: number,
    data: FormData,
    options?: RequestOptions<FAQ>
  ): Promise<ApiResponse<FAQ> | null> {
    try {
      const response = await api.post<ApiResponse<FAQ>>(
        `/service-offers/${serviceId}/add-faq`,
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
   * Update FAQ
   */
  async updateFaq(
    faqId: number,
    data: FormData,
    options?: RequestOptions<FAQ>
  ): Promise<ApiResponse<FAQ> | null> {
    try {
      const response = await api.post<ApiResponse<FAQ>>(
        `/service-offers/update-faq/${faqId}`,
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
   * Delete FAQ
   */
  async deleteFaq(
    faqId: number,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.delete<ApiResponse<void>>(
        `/service-offers/delete-faq/${faqId}`
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

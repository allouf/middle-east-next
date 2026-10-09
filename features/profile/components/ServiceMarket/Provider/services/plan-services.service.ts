import api from "@/lib/api";
import { ApiResponse, RequestOptions } from "../types/provider.types";
import { useProviderApiStore } from "../../stores";

export interface Plan {
  id?: number;
  title: string;
  price: number;
  currency: string;
  delivery_time_value: number;
  delivery_time_unit: string;
  revision_window: string;
  number_of_revisions: number;
  revision_scope_rules: string;
  sort_order: number;
}

export const planServicesService = {
  /**
   * Add plan to service
   */
  async addPlan(
    serviceId: number,
    data: FormData,
    options?: RequestOptions<Plan>
  ): Promise<ApiResponse<Plan> | null> {
    try {
      const response = await api.post<ApiResponse<Plan>>(
        `/service-offers/${serviceId}/add-plan`,
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
   * Update plan
   */
  async updatePlan(
    planId: number,
    data: FormData,
    options?: RequestOptions<Plan>
  ): Promise<ApiResponse<Plan> | null> {
    try {
      const response = await api.post<ApiResponse<Plan>>(
        `/service-offers/update-plan/${planId}`,
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
   * Delete plan
   */
  async deletePlan(
    planId: number,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.delete<ApiResponse<void>>(
        `/service-offers/delete-plan/${planId}`
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

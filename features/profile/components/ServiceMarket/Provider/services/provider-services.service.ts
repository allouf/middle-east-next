import api from "@/lib/api";
import { SERVICE_MARKET_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ApiResponse, ProviderService, ServiceOffer, RequestOptions } from "../types/provider.types";
import { useProviderApiStore } from "../../stores";

export const providerServicesService = {
  /**
   * Fetch provider services
   */
  async getServices(options?: RequestOptions<ProviderService[]>): Promise<ApiResponse<ProviderService[]> | null> {
    try {
      const response = await api.get<ApiResponse<ProviderService[]>>(
        SERVICE_MARKET_ENDPOINTS.providerServices
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
   * Get service by ID
   */
  async getServiceById(
    serviceId: number,
    options?: RequestOptions<ServiceOffer>
  ): Promise<ApiResponse<ServiceOffer> | null> {
    try {
      const response = await api.get<ApiResponse<ServiceOffer>>(
        SERVICE_MARKET_ENDPOINTS.showService(serviceId)
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
   * Create new service
   */
  async createService(
    data: FormData,
    options?: RequestOptions<ProviderService>
  ): Promise<ApiResponse<ProviderService> | null> {
    try {
      const response = await api.post<ApiResponse<ProviderService>>(
        SERVICE_MARKET_ENDPOINTS.providerServices,
        data
      );

      if (response.data?.status === false) {
        const errorMessage = response.data?.message || "Failed to create service";
        options?.onError?.(new Error(errorMessage));
        return null;
      }

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Update service
   */
  async updateService(
    serviceId: number,
    data: FormData,
    options?: RequestOptions<ProviderService>
  ): Promise<ApiResponse<ProviderService> | null> {
    try {
      const response = await api.post<ApiResponse<ProviderService>>(
        `${SERVICE_MARKET_ENDPOINTS.updateProviderServices}/${serviceId}`,
        data
      );

      if (response.data?.status === false) {
        const errorMessage = response.data?.message || "Failed to update service";
        options?.onError?.(new Error(errorMessage));
        return null;
      }

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Delete service
   */
  async deleteService(
    serviceId: number,
    options?: RequestOptions<void>
  ): Promise<ApiResponse<void> | null> {
    try {
      const response = await api.delete<ApiResponse<void>>(
        `${SERVICE_MARKET_ENDPOINTS.deleteProviderServices}/${serviceId}`
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      options?.onError?.(error as Error);
      return null;
    }
  },
};

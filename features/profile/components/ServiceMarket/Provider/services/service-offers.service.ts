import api from "@/lib/api";
import { SERVICE_MARKET_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ApiResponse, ServiceOffersResponse, RequestOptions } from "../types/provider.types";
import { useProviderApiStore } from "../../stores";

export const serviceOffersService = {
  /**
   * Get service offers list
   */
  async getServiceOffers(options?: RequestOptions<ServiceOffersResponse>): Promise<ApiResponse<ServiceOffersResponse> | null> {
    try {
      const response = await api.get<ApiResponse<ServiceOffersResponse>>(
        SERVICE_MARKET_ENDPOINTS.serviceOffers
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
  }
};

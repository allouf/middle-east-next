import api from "@/lib/api";
import { SERVICE_MARKET_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ApiResponse, ProviderProfile, RequestOptions } from "../types/provider.types";
import { useProviderApiStore } from "../../stores";

export const providerProfileService = {
  /**
   * Fetch provider profile
   */
  async getProfile(options?: RequestOptions<ProviderProfile>): Promise<ApiResponse<ProviderProfile> | null> {
    try {
      const response = await api.get<ApiResponse<ProviderProfile>>(
        SERVICE_MARKET_ENDPOINTS.getProviderProfile
      );

      console.log("API call completed, checking response...");
      
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
   * Update provider profile
   */
  async updateProfile(
    data: FormData,
    options?: RequestOptions<ProviderProfile>
  ): Promise<ApiResponse<ProviderProfile> | null> {
    try {
      const response = await api.post<ApiResponse<ProviderProfile>>(
        SERVICE_MARKET_ENDPOINTS.updateProviderProfile,
        data
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Create provider profile
   */
  async createProfile(
    data: FormData,
    options?: RequestOptions<ProviderProfile>
  ): Promise<ApiResponse<ProviderProfile> | null> {
    try {
      const response = await api.post<ApiResponse<ProviderProfile>>(
        SERVICE_MARKET_ENDPOINTS.createProviderProfile,
        data
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      options?.onError?.(error as Error);
      return null;
    }
  },

  /**
   * Submit verification request
   */
  async submitVerification(
    options?: RequestOptions<ProviderProfile>
  ): Promise<ApiResponse<ProviderProfile> | null> {
    try {
      const response = await api.post<ApiResponse<ProviderProfile>>(
        SERVICE_MARKET_ENDPOINTS.submitVerification
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      options?.onError?.(error as Error);
      return null;
    }
  }
};

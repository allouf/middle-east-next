import api from "@/lib/api";
import { BOOST_CAMPAIGN_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ApiResponse, RequestOptions } from "../types/provider.types";
import { useProviderApiStore } from "../../stores";
import {
  BoostData,
  BoostCampaignFilters,
  BoostCampaignSubmission,
  BoostCampaignMeta,
  ServiceOffersResponse,
} from "../components/BoostCampaign/types/boostCampaign.types";

export interface BoostCampaignListResponse {
  data: BoostData[];
  meta: BoostCampaignMeta;
}

export interface ServiceOffersFilters {
  page?: number;
  per_page?: number;
  status?: string;
}

export const boostCampaignService = {
  /**
   * Fetch all boost campaigns
   */
  async getBoostCampaigns(
    params?: BoostCampaignFilters,
    options?: RequestOptions<BoostCampaignListResponse>
  ): Promise<ApiResponse<BoostCampaignListResponse> | null> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
      if (params?.status) queryParams.append("status", params.status);

      const queryString = queryParams.toString();
      const url = queryString
        ? `${BOOST_CAMPAIGN_ENDPOINTS.list}?${queryString}`
        : BOOST_CAMPAIGN_ENDPOINTS.list;

      const response = await api.get<ApiResponse<BoostCampaignListResponse>>(url);

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
   * Create a new boost campaign
   */
  async createBoostCampaign(
    data: BoostCampaignSubmission,
    options?: RequestOptions<BoostData>
  ): Promise<ApiResponse<BoostData> | null> {
    try {
      const response = await api.post<ApiResponse<BoostData>>(
        BOOST_CAMPAIGN_ENDPOINTS.create,
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
   * Fetch service offers for boost campaign
   */
  async getServiceOffers(
    params?: ServiceOffersFilters,
    options?: RequestOptions<ServiceOffersResponse>
  ): Promise<ApiResponse<ServiceOffersResponse> | null> {
    try {
      const queryParams = new URLSearchParams();

      const queryString = queryParams.toString();
      const url = queryString ? `/service-offers?${queryString}` : "/service-offers";

      const response = await api.get<ApiResponse<ServiceOffersResponse>>(url);

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
   * Fetch boost plans
   */
  async getBoostPlans(
    options?: RequestOptions<any>
  ): Promise<ApiResponse<any> | null> {
    try {
      const response = await api.get<ApiResponse<any>>(
        BOOST_CAMPAIGN_ENDPOINTS.boostPlans
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

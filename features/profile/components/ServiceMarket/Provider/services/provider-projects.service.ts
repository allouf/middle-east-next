import api from "@/lib/api";
import { SERVICE_MARKET_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ApiResponse, ProviderProject, RequestOptions } from "../types/provider.types";
import { useProviderApiStore } from "../../stores";

export const providerProjectsService = {
  /**
   * Fetch provider projects
   */
  async getProjects(params?: { search?: string }, options?: RequestOptions<ProviderProject[]>): Promise<ApiResponse<ProviderProject[]> | null> {
    try {
      // Build query string from params
      const queryString = params?.search ? `?search=${encodeURIComponent(params.search)}` : '';
      
      const response = await api.get<ApiResponse<ProviderProject[]>>(
        `${SERVICE_MARKET_ENDPOINTS.providerProjects}${queryString}`
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
   * Get project by ID
   */
  async getProjectById(
    projectId: number,
    options?: RequestOptions<ProviderProject>
  ): Promise<ApiResponse<ProviderProject> | null> {
    try {
      const response = await api.get<ApiResponse<ProviderProject>>(
        SERVICE_MARKET_ENDPOINTS.showProject(projectId)
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
   * Create new project
   */
  async createProject(
    data: FormData,
    options?: RequestOptions<ProviderProject>
  ): Promise<ApiResponse<ProviderProject> | null> {
    try {
      const response = await api.post<ApiResponse<ProviderProject>>(
        SERVICE_MARKET_ENDPOINTS.providerProjects,
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
   * Update project
   */
  async updateProject(
    projectId: number,
    data: FormData,
    options?: RequestOptions<ProviderProject>
  ): Promise<ApiResponse<ProviderProject> | null> {
    try {
      const response = await api.post<ApiResponse<ProviderProject>>(
        `${SERVICE_MARKET_ENDPOINTS.updateProviderProjects}/${projectId}`,
        data
      );

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      options?.onError?.(error as Error);
      return null;
    }
  },



};

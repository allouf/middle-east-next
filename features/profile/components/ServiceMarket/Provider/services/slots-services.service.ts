import api from "@/lib/api";
import { ApiResponse, RequestOptions } from "../types/provider.types";
import { useProviderApiStore } from "../../stores";

export interface AvailableSlot {
  day: string;
  start_time: string;
  end_time: string;
}

export const slotsServicesService = {
  /**
   * Update available slots for service
   */
  async updateSlots(
    serviceId: number,
    data: FormData,
    options?: RequestOptions<AvailableSlot[]>
  ): Promise<ApiResponse<AvailableSlot[]> | null> {
    try {
      const response = await api.post<ApiResponse<AvailableSlot[]>>(
        `/service-offers/${serviceId}/update-slots`,
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
};

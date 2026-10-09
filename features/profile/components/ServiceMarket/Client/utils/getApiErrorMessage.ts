import { AxiosError } from "axios";

/**
 * Extract error message from API error response
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const axiosErr = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
  
  // Try to get message from response data
  if (axiosErr?.response?.data?.message) {
    return axiosErr.response.data.message;
  }
  
  // Try to get first error from errors object
  if (axiosErr?.response?.data?.errors) {
    const errorEntries = Object.values(axiosErr.response.data.errors);
    if (errorEntries.length > 0 && errorEntries[0].length > 0) {
      return errorEntries[0][0];
    }
  }
  
  // Fallback to axios error message
  if (axiosErr?.message) {
    return axiosErr.message;
  }
  
  // Final fallback
  return fallback;
};

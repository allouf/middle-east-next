import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { ServiceCategoriesResponse, ServiceCategoryMini } from "../types/type";

export async function fetchServiceCategories(query?: string, locale = "en"): Promise<ServiceCategoryMini[]> {
  const url = `${baseURL}${SERVICES_PUBLIC_ENDPOINTS.getAllCategories}${query ? `?${query}` : ""}`;

  try {
    const headers = await getAuthHeaders(locale);
    const res = await fetch(url, {
      headers,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("Failed to fetch service categories", res.status);
      return [];
    }

    const json: ServiceCategoriesResponse = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("Failed to fetch service categories", error);
    return [];
  }
}

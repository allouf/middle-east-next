import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { ADS_ENDPOINTS, USER_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { AdCategory, CategoriesWithSubResponse } from "../types/type";

export async function fetchAllAdsCategoriesWithSub(
  query: string, 
  locale = "en"
): Promise<AdCategory[]> {
  const url = `${baseURL}${ADS_ENDPOINTS.categories_withSub}${query ? `?${query}` : ""}`;

  try {
    const headers = await getAuthHeaders(locale);
    console.log("url", url);
    const res = await fetch(url, {
      headers,
      // keep a short cache but force revalidation on navigation changes
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("Failed to fetch categories with children", res.status);
      return [];
    }

    const json: CategoriesWithSubResponse = await res.json();
    console.log("categories ", json);

    // Handle the actual API response structure
    if (json.status && Array.isArray(json.data)) {
      return json.data;
    } else {
      console.warn("Unexpected API response structure:", json);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch categories with children", error);
    return [];
  }
}

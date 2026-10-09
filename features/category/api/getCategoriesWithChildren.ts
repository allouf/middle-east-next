import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";

export async function fetchCategoriesWithChildren(query: string, locale = "en") {
  const url = `${baseURL}${USER_ENDPOINTS.Get_Parents_with_Childerns}${query ? `?${query}` : ""}`;

  try {
    const headers = await getAuthHeaders(locale);
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


    const json = await res.json();
    // console.log("categories ",json)

    // API may return data as array or nested under data.data
    return Array.isArray(json?.data) ? json.data : json?.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch categories with children", error);
    return [];
  }
}

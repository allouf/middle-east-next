import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_STORES_ENDPOINT } from "@/shared/constants/urls";
import { StoreDetailsResponse } from "../types/type";

export async function fetchCategoriesData(query: string, locale = "en", id: string): Promise<StoreDetailsResponse | null> {
  const url = `${baseURL}${USER_STORES_ENDPOINT.categories(Number(id))}${query ? `?${query}` : ""}`;

  try {
    const headers = await getAuthHeaders(locale);
    const res = await fetch(url, {
      headers,
      // keep a short cache but force revalidation on navigation changes
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("Failed to fetch categories details", res.status);
      return null;
    }

    const json: StoreDetailsResponse = await res.json();
    return json;
  } catch (error) {
    console.error("Failed to fetch categries details", error);
    return null;
  }
}

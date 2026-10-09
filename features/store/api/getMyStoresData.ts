import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { profileUrl } from "@/shared/constants/urls";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import { MyStoresResponse } from "../types/type";

export async function fetchMyStoresData(query: string, locale = "en"): Promise<MyStoresResponse | null> {
  const url = `${baseURL}${STORE_ENDPOINT.getUserStores}${query ? `?${query}` : ""}`;

  try {
    const headers = await getAuthHeaders(locale);
    (headers as Record<string, string>).Accept = "application/json";

    const res = await fetch(url, {
      headers,
      // keep a short cache but force revalidation on navigation changes
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("Failed to fetch profile data", res.status);
      return null;
    }

    const json = await res.json();
    // API may return data as array or nested under data.data
    return json;
  } catch (error) {
    console.error("Failed to fetch profile data", error);
    return null;
  }
}

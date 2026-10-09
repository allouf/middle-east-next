import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_STORES_ENDPOINT } from "@/shared/constants/urls";
import { StoreDetailsResponse } from "../types/type";

export async function fetchDiscountProducts(query: string, locale = "en", id: string){
  const url = `${baseURL}${USER_STORES_ENDPOINT.discountProducts(Number(id))}${query ? `?${query}` : ""}`;

  try {
    const headers = await getAuthHeaders(locale);
    const res = await fetch(url, {
      headers,
      // keep a short cache but force revalidation on navigation changes
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("Failed to fetch discount products", res.status);
      return null;
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Failed to fetch discount products", error);
    return null;
  }
}

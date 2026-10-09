import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { ProductDetailsData, ProductDetailsResponse } from "../types/type";

export async function fetchProductDetails(
  query: string,
  id: number,
  locale: string = "en"
): Promise<ProductDetailsData | null> {
  const url = `${baseURL}/products/details/${id}${query ? `?${query}` : ""}`;

  try {
    const headers = await getAuthHeaders(locale);
    const res = await fetch(url, { headers });

    if (!res.ok) {
      console.error("Failed to fetch product details", res.status, res.statusText);
      return null;
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("Unexpected content type while fetching product details", contentType);
      return null;
    }

    const json: ProductDetailsResponse = await res.json();
    return json.data as ProductDetailsData;
  } catch (err) {
    console.error("Error fetching product details", err);
    return null;
  }
}

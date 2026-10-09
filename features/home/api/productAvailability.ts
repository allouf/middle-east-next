import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";

const extractProductList = (payload: any): unknown[] => {
  const candidates = [
    payload?.data?.data,
    payload?.data?.products?.data,
    payload?.data?.products,
    payload?.data,
    payload?.products,
    payload,
  ];

  return candidates.find(Array.isArray) ?? [];
};

export interface ProductAvailabilityResult {
  hasProducts: boolean;
  error: boolean;
  status?: number;
}

export async function hasAvailableProducts(locale: string): Promise<ProductAvailabilityResult> {
  try {
    const headers = await getAuthHeaders(locale);
    const res = await fetch(
      `${baseURL}${USER_ENDPOINTS.Get_Products}?per_page=1`,
      {
        headers,
        cache: "no-store",
        next: { revalidate: 0 },
      },
    );

    if (!res.ok) {
      console.error("Failed to check product availability", res.status);
      return { hasProducts: false, error: true, status: res.status };
    }

    const json = await res.json();
    const metaTotal =
      json?.data?.meta?.total ??
      json?.meta?.total ??
      json?.data?.products?.meta?.total ??
      null;

    if (typeof metaTotal === "number") {
      return { hasProducts: metaTotal > 0, error: false };
    }

    const products = extractProductList(json);
    const hasProducts = Array.isArray(products) ? products.length > 0 : false;

    return {
      hasProducts,
      error: !Array.isArray(products) // If it's not an array, something is wrong with the response format
    };
  } catch (error) {
    console.error("Failed to check product availability", error);
    return { hasProducts: false, error: true };
  }
}

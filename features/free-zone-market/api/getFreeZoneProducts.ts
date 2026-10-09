import { getAuthHeaders } from "@/features/auth/server";
import { baseURL } from "@/shared/constants/data";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { Product } from "@/features/product/types/type";
import { FreeZoneSearchParams } from "../types/type";

interface ProductsResponse<T = unknown> {
  products: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const defaultMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
};

export async function fetchFreeZoneProducts(
  searchParams: FreeZoneSearchParams,
  locale = "en"
): Promise<ProductsResponse<Product>> {
  const page = Number(searchParams.page ?? 1);
  const search = searchParams.search ?? "";
  const min = Number(searchParams.min ?? 0);
  const max = Number(searchParams.max ?? 10000);
  const category = searchParams.category ?? "all";
  const rating = Number(searchParams.rating ?? 0);
  const seller = searchParams.seller;
  const sort = searchParams.sort;
  const promo = searchParams.promo?.split(",") ?? [];
  const attr = searchParams.attr?.split(",") ?? [];
  const country_code = searchParams.country_code;

  const query = new URLSearchParams({
    paginate: "true",
    page: String(page),

    // Constant: always filter for free zone products
    is_freezone: "1",

    /* Search */
    ...(search && { search }),

    /* Category */
    ...(category !== "all" && { "category_ids[]": category }),

    /* Price */
    ...(min > 0 && { min_price: String(min) }),
    ...(max < 10000 && { max_price: String(max) }),

    /* Rating */
    ...(rating > 0 && { rating: String(rating) }),

    /* Seller */
    ...(seller === "company" && { seller_type: "company" }),
    ...(seller === "person" && { seller_type: "person" }),

    /* Promotions */
    ...(promo.includes("sponsored") && { sponsored: "1" }),
    ...(promo.includes("sale") && { on_sale: "1" }),

    /* Attributes */
    ...(attr.includes("available") && { available: "1" }),
    ...(attr.includes("unavailable") && { available: "0" }),
    ...(attr.includes("best_seller") && { best_seller: "1" }),
    ...(attr.includes("new_arrival") && { new_arrival: "1" }),
    ...(attr.includes("guaranteed") && { guaranteed: "1" }),
    ...(attr.includes("free_delivery") && { free_delivery: "1" }),

    /* Sorting */
    ...(sort === "popular" && { sort_by: "popularity" }),
    ...(sort === "price_asc" && { sort_by: "price", sort_order: "asc" }),
    ...(sort === "price_desc" && { sort_by: "price", sort_order: "desc" }),
    ...(sort === "newest" && { sort_by: "created_at", sort_order: "desc" }),

    /* Country filter */
    ...(country_code && { country_code }),
  }).toString();

  const url = `${baseURL}${USER_ENDPOINTS.Get_Products}?${query}`;
  console.log("[FreeZone] fetch url:", url);

  try {
    const headers = await getAuthHeaders(locale);
    const res = await fetch(url, {
      headers,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("Failed to fetch free-zone products", res.status);
      return { products: [], meta: defaultMeta };
    }

    const json = await res.json();
    const products =
      json?.data?.data ?? json?.data?.products ?? json?.data ?? [];
    const meta = json?.data?.meta ?? json?.meta ?? defaultMeta;

    return { products, meta };
  } catch (error) {
    console.error("Failed to fetch free-zone products", error);
    return { products: [], meta: defaultMeta };
  }
}

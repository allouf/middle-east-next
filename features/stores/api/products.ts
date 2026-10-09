import api from "@/lib/api";
import { PRODUCTS_ENDPOINT } from "@/shared/constants/urls";
import {
  PaginationMeta,
  StoreProduct,
  StoreProductFilters,
  StoreProductsResponse,
} from "../types";

const defaultMeta: PaginationMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
};

/**
 * Fetch products for a specific store with optional filters
 */
export async function fetchStoreProducts(
  storeId: string,
  filters: StoreProductFilters = {} 
): Promise<StoreProductsResponse> {
  const { page = 1, search, status, categoryIds = [] ,min_price,max_price,has_discount} = filters;

  const params: Record<string, unknown> = {
    page,
    ...(search && { search }),
    ...(status && { status }),
    ...(min_price&&{min_price}),
    ...(max_price&&{max_price}),
    ...(has_discount&&{has_discount})  


  };

  if (categoryIds.length > 0) {
    params["category_ids[]"] = categoryIds;
  }

  const response = await api.get(PRODUCTS_ENDPOINT.getByStore(storeId), {
    params,
  });

  const rawData = response.data?.data ?? {};
  const products: StoreProduct[] =
    rawData.products ??
    rawData.data ??
    [];

  const meta: PaginationMeta = rawData.meta ?? defaultMeta;

  return {
    products,
    meta,
  };
}

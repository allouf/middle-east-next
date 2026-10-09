export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface StoreProduct {
  id: string | number;
  name: string;
  price: number;
  price_before_discount?: number;
  discount_value?: number;
  discount_type?: string;
  status?: string;
  total_left_in_stock?: number;
  gallery?: { file_path?: string }[];
  category?: { id?: string | number; name?: string };
  [key: string]: unknown;
}

export interface StoreProductsResponse {
  products: StoreProduct[];
  meta: PaginationMeta;
}

export interface StoreProductFilters {
  page?: number;
  search?: string;
  status?: string;
  categoryIds?: (string | number)[];
  min_price?:string;
  max_price?:string;
  has_discount?:string;
}

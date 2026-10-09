export interface Category {
    id: number | string;
    name: string;
    icon?: string | null;
    is_active: boolean;
    sort_order?: number;
    children?: Category[];
  }   

  export interface CategoryMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  }

  export interface CategoryResponse {
    categories: Category[];
    meta: CategoryMeta;
  }

  export interface CategorySearchParams {
    /* Pagination */
    page?: string; // "1"
  
    /* Global product search */
    search?: string; // "iphone"
  
    /* Category (route helper / override) */
    category?: string; // "62" | "all"
  
    /* Category sidebar search */
    category_search?: string; // "Elec"
  
    /* Price filter */
    min?: string; // "25"
    max?: string; // "100"
  
    /* Rating filter */
    rating?: string; // "4"
  
    /* Seller filter */
    seller?: "company" | "person";
  
    /* Promotions (comma-separated in URL) */
    promo?: string; // "sponsored" | "sale" | "sponsored,sale"
  
    /* Attributes (comma-separated in URL) */
    attr?: string; // "available" | "best_seller" | "available,best_seller"
  
    /* Sorting */
    sort?: "popular" | "price_asc" | "price_desc" | "newest";
  }
  
  
// Store Types based on API response

export interface Country {
  id: number;
  en_short_name: string;
  alpha_2_code: string;
  alpha_3_code: string;
}

export interface StoreUser {
  id: number;
  name: string;
  email: string;
}

export type SocialLinks = string[];

export interface StoreCategory {
  id: number;
  name: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface StoreUser {
  id: number;
  name: string;
  email: string;
}

export interface StoreSocialLinks {
  [key: string]: string | string[]; // Can be object with keys or array of strings
}

export interface Store {
  id: number;
  user_id: number;
  country: Country;
  categories: StoreCategory[];
  user: StoreUser;
  name: string;
  slug: string;
  logo: string | null;
  cover: string | null;
  description: string;
  social_links: string[] | StoreSocialLinks; // Can be array or object
  phones: string[];
  emails: string[];
  address: string | null;
  latitude: number;
  longitude: number;
  website: string;
  opening_time: string; // Format: "HH:mm"
  closing_time: string; // Format: "HH:mm"
  is_returnable: boolean;
  is_active: boolean;
  is_suspended: boolean;
  is_banned: boolean;
  is_warned: boolean;
  rating: number;
  created_at: string; // ISO date string
  role: string;
  role_display: string;
  permissions: string[];
}

export interface StoreDetailsData {
  store: Store;
  return_policy: string;
  shipping_policy: string;
}

export interface StoreDetailsResponse {
  status: boolean;
  message: string;
  data: StoreDetailsData;
}

// My Stores API Response
export interface MyStoresResponse {
  status: boolean;
  message: string;
  data: Store[];
}

// Additional types for store-related operations

export interface StoreSearchParams {
  page?: string;
  search?: string;
  category?: string;
  country?: string;
  rating?: string;
  sort?: "name" | "rating" | "created_at" | "name_desc" | "rating_desc" | "created_at_desc";
}

export interface StoreListItem {
  id: number;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface StoreListResponse {
  status: boolean;
  message: string;
  data: {
    stores: StoreListItem[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export interface StoreUpdateData {
  name?: string;
  description?: string;
  logo?: File;
  cover?: File;
  social_links?: SocialLinks;
  phones?: string[];
  emails?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  opening_time?: string;
  closing_time?: string;
  is_returnable?: boolean;
}

export interface StoreCreateData extends Omit<StoreUpdateData, 'logo' | 'cover'> {
  name: string;
  description: string;
  logo: File;
  cover: File;
}

export interface CategoriesResponse {
  status: boolean;
  message: string;
  data: Array<{
    id: number;
    name: string;
    icon: string;
    is_active: boolean;
    sort_order: number;
  }>;
}

export interface BestSellersResponse {
  status: boolean;
  message: string;
  data: Array<{
    id: number;
    store_id: number;
    category: {
      id: number;
      name: string;
      icon: string;
      is_active: boolean;
      sort_order: number;
    };
    name: string;
    slug: string;
    price: number;
    price_before_discount: number;
    discount_value: number | null;
    discount_type: string | null;
    status: string;
    number_of_buys: number;
    avg_rating: number;
    total_left_in_stock: number;
    availability_status: string;
    gallery: Array<{
      id: number;
      file_path: string;
      file_type: string;
    }>;
    is_favorited: boolean;
    favorited_at: string | null;
  }>;
}

export interface DiscountProductsResponse {
  status: boolean;
  message: string;
  data: Array<{
    id: number;
    store_id: number;
    category: {
      id: number;
      name: string;
      icon: string;
      is_active: boolean;
      sort_order: number;
    };
    name: string;
    slug: string;
    price: number;
    price_before_discount: number;
    discount_value: number | null;
    discount_type: string | null;
    status: string;
    number_of_buys: number;
    avg_rating: number;
    total_left_in_stock: number;
    availability_status: string;
    gallery: Array<{
      id: number;
      file_path: string;
      file_type: string;
    }>;
    is_favorited: boolean;
    favorited_at: string | null;
  }>;
}
export interface SuggestedProductsResponse {
  status: boolean;
  message: string;
  data: Array<{
    id: number;
    store_id: number;
    category: {
      id: number;
      name: string;
      icon: string;
      is_active: boolean;
      sort_order: number;
    };
    name: string;
    slug: string;
    price: number;
    price_before_discount: number;
    discount_value: number | null;
    discount_type: string | null;
    status: string;
    number_of_buys: number;
    avg_rating: number;
    total_left_in_stock: number;
    availability_status: string;
    gallery: Array<{
      id: number;
      file_path: string;
      file_type: string;
    }>;
    is_favorited: boolean;
    favorited_at: string | null;
  }>;
}

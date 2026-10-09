export interface Ad {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price: string;
  is_price_negotiable: boolean;
  is_free: boolean;
  condition: 'new' | 'used';
  status: 'active' | 'inactive';
  contact_method: 'chat' | 'phone' | 'both';
  phone?: string;
  show_phone: boolean;
  images: string[];
  views_count: number;
  published_at: string;
  expires_at: string;
  renewed_at?: string;
  attributes?: Record<string, any> | null;
  is_owner: boolean;
  can_renew: boolean;
  is_favorited: boolean;
  favorites_count: number;
  user: {
    id: number;
    name: string;
    photo?: string | null;
    type?: string | null;
  };
  country_code?:string|number;
  subcategory?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  country?: {
    id: number;
    en_short_name: string;
    alpha_2_code: string;
    alpha_3_code: string;
  } | null;
  region?:string;
  created_at: string;
  updated_at: string;
}

export interface AdDetailsResponse {
  status: boolean;
  message: string;
  data: Ad;
}

export interface AdDetailsApiResponse {
  status: boolean;
  message: string;
  data: Ad;
}

export interface AdSearchParams {
  page?: string;
  search?: string;
  category?: string;
  sub_category?: string;
  min?: string;
  max?: string;
  condition?: 'new' | 'used';
  rows?:string;
  promo?: string; // "free" | "negotiable" | "hot_deal"
  sort?: '' | 'popular' | 'price_asc' | 'price_desc' | 'newest' | 'views_asc' | 'views_desc'|'oldest';
}

export interface AdMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more?: boolean;
}

// API Response types for ads
export interface AdsResponse {
  status: boolean;
  message: string;
  data: {
    data: Ad[];
    meta: AdMeta;
  };
}

export interface Category {
  id: number | string;
  name: string;
  icon?: string | null;
  is_active: boolean;
  sort_order?: number;
  children?: Category[];
}

// Subcategory interface
export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Enhanced Category interface for API responses
export interface AdCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  subcategories: SubCategory[];
  created_at: string;
  updated_at: string;
}

// API Response types for categories with subcategories
export interface CategoriesWithSubResponse {
  status: boolean;
  message: string;
  data: AdCategory[];
}


export type ReasonReportType =
  | 'spam'
  | 'fake'
  | 'inappropriate'
  | 'scam'
  | 'misleading'
  | 'duplicate'
  | 'other';

type Condition = 'new' | 'used';
type ContactMethod = 'phone' | 'chat' | 'both';
export type StatusType = "all" | "draft" | "active" | "paused" | "sold" | "expired" | "archived" | "rejected";


export interface UserAd {
  id: string | number;
  title: string;
  case: "negotiable" | "free" | null;
  price: number;
  currency: string;
  condition: Condition;
  views: number;
  expiryDate: string | null;
  date: string;
  state: StatusType;

}

export interface AdStatistics {
  activeAds: { count: number; trend: number };
  pausedAds: { count: number; trend: number };
  soldAds: { count: number; trend: number };
  expiredAds: { count: number; trend: number };
}

export interface FilterState {
  case: string | null;
  condition: Condition | null;
  state: StatusType | null;
  date: string | null;
  sortBy: string;
  search: string;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

type AdvertisementAttributes = {
  brand: string;
  model: string;
  storage: string;
  color: string;
};

export type FormStateAdvertisementPayload = {
  title: string;
  advertisement_category_id: number | string;
  advertisement_subcategory_id: number | string;
  description: string;
  price: number;
  is_price_negotiable: 0 | 1;
  is_free: 0 | 1;
  condition: Condition;
  contact_method: ContactMethod;
  phone: string;
  show_phone: 0 | 1;
  country_id: number;
  region_id: number;
  images: []
  // attributes?: AdvertisementAttributes;
};


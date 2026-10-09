// ---------- Types ----------
export type IdParam = string | string[] | undefined;

export type StoreCategory = { id: number | string; name?: string };
export type StoreCountry = { id: number | string; name?: string };

export type StoreDetailsResponse = {
  data?: {
    name?: string;
    description?: string;
    logo?: string;
    cover?: string;
    country?: StoreCountry | null;
    website?: string;
    categories?: StoreCategory[];
    opening_time?: string;
    closing_time?: string;
    gallery?: unknown[];
    phones?: string[];
    social_links?: any[];
    address?: string;
    latitude?: string | number;
    longitude?: string | number;
    is_returnable?: boolean | number;
  };
};

export type FormState = {
  name: string;
  bio?: string;
  description: string;
  country_code?: string | null;
  country?: string | null;
  region?: string | null;
  postal_code?: string | null;
  city?: string | null;
  logo?: string;
  cover?: string;
  country_id?: string | number;
  website: string;
  category_ids: Array<string | number>;
  opening_time: string;
  closing_time: string;
  gallery: unknown[];
  phones: string[];
  emails: string[];
  social_links: any[];
  shipping_policy: string;
  return_policy: string;
  address: string;
  latitude: string;
  longitude: string;
  is_returnable: 0 | 1;
  is_freezone: 0 | 1;
};

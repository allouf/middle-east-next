export interface Address {
  id: number;
  user_id: number;
  title: string;
  address: string;
  city: string;
  country: string;
  country_code: string;
  postal_code: string | null;
  region: string;
  lat: number;
  lng: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressesResponse {
  status: boolean;
  message: string;
  data: Address[];
}

export interface AddressFormData {
  title: string;
  address: string;
  city: string;
  country: string;
  country_code: string;
  postal_code?: string;
  region: string;
  lat: number;
  lng: number;
  is_default?: boolean;
}

export type PresetTitleKey = "home" | "office" | "work";
export type TitleOption =
  | { value: PresetTitleKey; kind: "preset" }
  | { value: string; kind: "custom" };

// User Addresses Types

export interface AddAddressRequest {
  region_id: any;
  address: string;
  is_default: any;
  latitude: any;
  longitude: any;
  full_name?: string;
  phone?: string;
  country?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  street_address?: string;
  building?: string;
  apartment?: string;
}

export interface UpdateAddressRequest {
  region_id: any;
  address: string;
  is_default: any;
  latitude: any;
  longitude: any;
  full_name?: string;
  phone?: string;
  country?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  street_address?: string;
  building?: string;
  apartment?: string;
}

export interface DeleteAddressRequest {
  full_name: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  postal_code: string;
  street_address: string;
  building: string;
  apartment: string;
  is_default: any;
  latitude: any;
  longitude: any;
}


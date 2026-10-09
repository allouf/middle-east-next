// User Advertisements Types

export interface CreateAdvertisementRequest {
  user_id: string;
  region_id: string;
  category_id: string;
  name: string;
  latitude: string;
  longitude: string;
  description: string;
  price: string;
  social_links: {
    phone: string;
  };
  fields: {
    1: string;
    2: string;
    5: string;
    6: string;
    7: string;
  };
}

export interface UpdateAdvertisementRequest {
  user_id: string;
  region_id: string;
  category_id: string;
  name: string;
  latitude: string;
  longitude: string;
  description: string;
  price: string;
  social_links: {
    phone: string;
    youtube: string;
  };
  fields: {
    1: string;
    2: string;
    5: string;
    6: string;
    7: string;
  };
}


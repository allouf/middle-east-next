export interface Service {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price: string;
  is_price_negotiable: boolean;
  status: 'active' | 'inactive';
  contact_method: 'chat' | 'phone' | 'both';
  phone?: string;
  show_phone: boolean;
  images: string[];
  views_count: number;
  published_at: string;
  is_owner: boolean;
  is_favorited: boolean;
  user: {
    id: number;
    name: string;
    photo?: string | null;
  };
  country_code?: string | number;
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
  region?: string;
  created_at: string;
  updated_at: string;
  
  // Specific to services
  rating?: number;
  reviews_count?: number;
  provider_type?: 'individual' | 'company';
  estimated_time?: string;
  service_type?: 'hourly' | 'fixed_price' | 'project_based' | 'retainer' | 'package' | 'subscription' | 'custom_quote';
  delivery_type?: 'remote' | 'on_site' | 'hybrid' | 'in_person';
  delivery_time?:{
    value:number;
    unit:string;
  }
}

export interface ServiceSearchParams {
  per_page: string;
  rows?: string;
  sort?: '' | 'popular' | 'price_asc' | 'price_desc' | 'newest' | 'views_asc' | 'views_desc' | 'oldest' | 'lowest_price' | 'highest_price' | 'lowest_rate' | 'highest_rate';
  rating?: string;
  service_type?: 'hourly' | 'fixed_price' | 'project_based' | 'retainer' | 'package' | 'subscription' | 'custom_quote';
  delivery_type?: 'remote' | 'on_site' | 'hybrid' | 'in_person';
  category?: string;
  sub_category?: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  is_active: boolean;
  subcategories: ServiceSubCategory[];
}

export interface ServiceSubCategory {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface ServiceCategoryMini {
  id: number;
  name: string;
  slug: string;
}

export interface ServiceMedia {
  id: number;
  type: string;
  url: string;
  is_cover: boolean;
  sort_order: number;
}

export interface ServiceProviderMini {
  id: number;
  display_name: string;
  region: string;
  country_code: string;
}

export interface ServiceListItem {
  id: number;
  title: string;
  type: string;
  delivery_model: string;
  cover: string | null;
  description: string;
  price_from: number;
  service_category: ServiceCategoryMini;
  service_provider: ServiceProviderMini;
  created_at: string;
}

export interface ServiceMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ServicesResponse {
  status: boolean;
  message: string;
  data: {
    services: ServiceListItem[];
    meta: ServiceMeta;
  };
}

export interface ServiceCategoriesResponse {
  status: boolean;
  message: string;
  data: ServiceCategoryMini[];
}

export interface ServicePlan {
  id: number;
  title: string;
  price: number;
  currency: string;
  estimated_delivery_time: string | { value: number; unit: string };
  revision_window: string | { value: number; unit: string };
  number_of_revisions: number;
  revision_scope_rules: string;
}

export interface ServiceFAQ {
  id: number;
  question: string;
  answer: string;
}

export interface ServiceSlot {
  id: number;
  start_time: string;
  end_time: string;
}

export interface ServiceAvailableSlot {
  day: string;
  slots: ServiceSlot[];
}

export interface ServiceDetails {
  id: number;
  service_provider_id: number;
  service_category_id: number;
  title: string;
  type: string;
  delivery_model: string;
  cover: ServiceMedia | null;
  description: string;
  price_from: number;
  media?: ServiceMedia[];
  plans: ServicePlan[];
  faqs: ServiceFAQ[];
  available_slots: ServiceAvailableSlot[];
  service_category: ServiceCategoryMini;
  service_subcategory?: ServiceSubCategory | null;
  service_provider: ServiceProviderMini;
  created_at: string;
  updated_at: string;
}

export interface ServiceDetailsResponse {
  status: boolean;
  message: string;
  data: ServiceDetails;
}

export interface ServiceProject {
  id: number;
  service_provider_id: number;
  title: string;
  url: string;
  description: string;
  images: string[];
  sort_order: number;
  services?: { id: number; title: string }[];
  categories?: ServiceCategoryMini[];
  created_at: string;
  updated_at: string;
}

export interface ServiceProjectsResponse {
  status: boolean;
  message: string;
  data: {
    projects: ServiceProject[];
    meta: ServiceMeta;
  };
}

export interface ServiceLanguage {
  id: number;
  code: string;
  name: string;
}

export interface ServiceProviderProfile {
  id: number;
  user_id: number;
  display_name: string;
  bio: string;
  avatar: string | null;
  cover?: string | null;
  service_languages: ServiceLanguage[];
  average_rating: number;
  total_reviews: number;
  country_code: string;
  region: string;
  is_verified: boolean;
  verification_message: string;
}

export interface ServiceProviderProfileResponse {
  status: boolean;
  message: string;
  data: ServiceProviderProfile;
}

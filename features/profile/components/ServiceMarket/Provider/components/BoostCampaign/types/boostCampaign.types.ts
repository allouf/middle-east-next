export interface BoostData {
  key: string;
  phase: string;
  service: string;
  plan: string | { id: number; name: string } | null;
  duration: string;
  timeline: string;
  payment: string;
  status: "Active" | "Expired" | "Under Review";
  id?: number | string;
  service_offer_id?: number | string;
  boost_plan_id?: number | string;
  service_offer?: {
    id: number;
    title: string;
    status: string;
  };
  amount?: string;
  currency?: string;
  start_at?: string;
  end_at?: string;
}

export interface BoostCampaignFilters {
  page?: number;
  per_page?: number;
  status?: string;
}

export interface BoostCampaignMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface BoostCampaignSubmission {
  service_offer_id: number | string;
  boost_plan_id: number | string;
}

// Service Offers Types
export interface ServiceMedia {
  id: number;
  type: string;
  url: string;
  is_cover: boolean;
  sort_order: number;
}

export interface ServicePlan {
  id: number;
  title: string;
  price: number;
  currency: string;
  delivery_time_value: number;
  delivery_time_unit: string;
  delivery_time: string;
  revision_window: string;
  number_of_revisions: number;
  revision_scope_rules: string;
}

export interface ServiceFaq {
  id: number;
  question: string;
  answer: string;
}

export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
}

export interface AvailableSlot {
  day: string;
  slots: TimeSlot[];
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ServiceOffer {
  id: number;
  service_provider_id: number;
  service_category_id: number;
  title: string;
  type: string;
  delivery_model: string;
  description: string;
  cover: string | null;
  media: ServiceMedia[];
  plans: ServicePlan[];
  faqs: ServiceFaq[];
  available_slots: AvailableSlot[];
  is_active: boolean;
  status: string;
  sort_order: number;
  service_category: ServiceCategory;
  created_at: string;
  updated_at: string;
}

export interface ServiceOffersResponse {
  offers: ServiceOffer[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Provider Profile Types
export interface ProviderProfile {
  id: number;
  user_id: number;
  type: string;
  display_name: string;
  country_code?: string;
  region?: string;
  bio: string | null;
  identity_document: string | null;
  verification_notes: string | null;
  verification_status?: "none" | "pending" | "rejected" | "verified";
  languages?: ProviderLanguage[];
  logo: string | null;
  cover: string | null;
  gallery?: string[];
  team_members?: ProviderTeamMember[];
  created_at: string;
  updated_at: string;
}

export interface ProviderLanguage {
  id: number;
  code: string;
  name: string;
}

export interface ProviderTeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  image?: string;
}

// Provider Projects Types
export interface ProviderProject {
  id: number;
  service_provider_id: number;
  title: string;
  url?: string;
  description: string;
  images?: string[];
  sort_order: number;
  service_offers?: ServiceOffer[];
  created_at: string;
  updated_at: string;
}

// Provider Services Types
export interface ProviderService {
  id: number;
  title: string;
  description: string;
  price: number;
  category?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

// Provider Offers Types
export interface ServiceOffer {
  id: number;
  service_provider_id: number;
  service_category_id: number;
  title: string;
  type: string;
  delivery_model: string;
  cover: {
    id: number;
    url: string;
    type: string;
  } | null;
  description: string;
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
  sort_order?: number;
}

export interface AvailableSlot {
  day: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
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

// Provider Orders Types
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PENDING"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REVISION"
  | "REVISION_REQUESTED"
  | "REVISION_COMPLETED"
  | "REJECTED"
  | "DISPUTED";

export interface OrderHistoryItemType {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: string;
  service: {
    title: string;
    cover: string | null;
  };
  customer: {
    id: number;
    name: string;
    avatar: string | null;
    type: string;
    country?: string;
    region?: string;
  };
  order_date: string;
  delivery_time: {
    minutes: number;
    formatted: string;
  };
  total: number;
  currency: string;
  rejection_reason?: string;
  escrowStatus?: string;
}

export interface OrderAttachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "doc";
  url?: string;
}

export interface OrderDetails {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: string;
  price: number;
  currency: string;

  delivery_time: {
    minutes: number;
    formatted: string;
  };

  purchased_on: string;

  service: {
    id: number;
    title: string;
    description: string;
    cover: string | null;
    category: string;
    rating: number;
    reviews_count: number;
    type: string;
    delivery_model: string;
    estimated_delivery_days: string;
  };

  summary: {
    service_price: number;
    vat: number;
    fees: number;
    total: number;
    currency: string;
  };

  customer: {
    id: number;
    name: string;
    avatar: string | null;
    type: string;
    country: string;
    region: string;
  };

  requirements: {
    notes: string;
    attachments: OrderAttachment[];
  };

  deliveries: any[];
  rejection?: {
    reason: {
      id: number;
      name: string;
    };
    notes: string;
  } | null;
  time_remaining?: {
    total_minutes: number | null;
    formatted: string;
    is_overdue: boolean;
    started: boolean;
  };
  provider?: {
    id: number;
    name: string;
    avatar: string | null;
    type: string;
    country: string;
    region: string;
  };
  feedback?: {
    id?: number | string;
    rating: number;
    comment: string;
    created_at?: string;
  };
  extensions?: OrderExtension[];
  revision_policy?: {
    revisions_allowed: number;
    revisions_used: number;
    revisions_remaining: number;
  };
  revisions?: any[];
}

export interface OrderExtension {
  id: number;
  requested_days: number;
  reason: {
    id: number;
    name: string;
  };
  description: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  requested_at: string;
  responded_at: string | null;
}

export interface OrderListResponse {
  orders: OrderHistoryItemType[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface OrderFilters {
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface OrderAction {
  type: 'cancel' | 'accept' | 'reject' | 'complete' | 'dispute' | 'start' | 'deliver';
  reason?: string;
  attachment?: OrderAttachment;
}

// API Response Types
export type ApiResponse<T = unknown> = {
  status?: boolean;
  message?: string;
  data?: T;
};

export type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

// Request Options Types
export type RequestOptions<TSuccess = unknown> = {
  showMessage?: boolean;
  onSuccess?: (data: ApiResponse<TSuccess>) => void;
  onError?: (error: Error) => void;
};

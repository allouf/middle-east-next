export type ProviderRfqStatus = "Open" | "Applied" | "Awarded" | "Canceled" | "Expired";

export interface ProviderRfqCustomer {
  id: number;
  name: string;
  avatar: string | null;
  type: string;
  country?: string;
  region?: string;
}

export interface ProviderRfqCategory {
  id: number;
  name: string;
  slug?: string;
}

export interface ProviderRfqItem {
  id: number;
  reference_number: string;
  title: string;
  description: string;
  status: ProviderRfqStatus;
  delivery_model: string;
  deadline_date: string;
  budget_min: number;
  budget_max: number;
  category: ProviderRfqCategory;
  customer: ProviderRfqCustomer;
  quotes_count: number;
  has_applied: boolean;
  created_at: string;
}

export interface ProviderRfqTimeRemaining {
  is_expired: boolean;
  total_minutes: number;
  days: number;
  hours: number;
  minutes: number;
  formatted: string;
  deadline: string;
}

export interface ProviderRfqMyQuote {
  id: number;
  proposed_budget: number;
  estimated_delivery_date: string;
  cover_letter_or_message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProviderRfqDetail extends ProviderRfqItem {
  attachments: ProviderRfqAttachment[];
  time_remaining?: ProviderRfqTimeRemaining;
  my_quote?: ProviderRfqMyQuote | null;
}

export interface ProviderRfqAttachment {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
}

export interface ProviderRfqFilters {
  page?: number;
  per_page?: number;
  category_id?: number;
  deadline?: string;
  deadline_from?: string;
  deadline_to?: string;
  deadline_preset?: string;
  budget_min?: number;
  budget_max?: number;
  status?: string;
}

export interface ProviderRfqMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProviderQuoteSubmission {
  proposed_budget: number;
  estimated_delivery_date: string;
  cover_letter_or_message: string;
}

export interface ProviderQuoteUpdate {
  proposed_budget: number;
  cover_letter_or_message: string;
}

export interface ProviderQuoteItem {
  id: number;
  request_id: number;
  proposed_budget: number;
  estimated_delivery_date: string;
  cover_letter_or_message: string;
  status: string;
  created_at: string;
  updated_at: string;
  custom_request?: {
    id: number;
    reference_number: string;
    title: string;
    delivery_model: string;
    deadline_date: string;
    budget_min: number;
    budget_max: number;
    status: string;
    category?: {
      id: number;
      name: string;
    };
  };
  request?: ProviderRfqItem;
}

export interface QuoteStats {
  total: number;
  awarded: number;
  under_review: number;
  rejected: number;
}

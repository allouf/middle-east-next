export type RequestStatus = "Open" | "Awarded" | "Canceled" | "Expired";

export type RequestItem = {
  id: number;
  reference_number: string;
  title: string;
  status: RequestStatus;
  delivery_model: string;
  deadline_date: string;
  budget_min: number;
  budget_max: number;
  quotes_count: number;
  category: {
    id: number;
    name: string;
  };
  created_at: string;
};

export type RequestAttachment = {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
};

export type RequestDetail = {
  id: number;
  reference_number: string;
  title: string;
  description: string;
  status: RequestStatus;
  delivery_model: string;
  deadline_date: string;
  budget_min: number;
  budget_max: number;
  category: {
    id: number;
    name: string;
  };
  attachments: RequestAttachment[];
  quotes: QuoteItem[];
  created_at: string;
  updated_at: string;
};

export type QuoteProvider = {
  id: number;
  name: string;
  photo: string | null;
  country_code: string;
  provider_type: string;
  rating?: number;
};

export type QuoteItem = {
  id: number;
  proposed_budget: number;
  estimated_delivery_date: string;
  cover_letter_or_message: string;
  status: string;
  created_at: string;
  provider: QuoteProvider;
};

export type RfqFormState = {
  title: string;
  category_id: string;
  delivery_model: string;
  deadline_date: string;
  budget_min: number | "";
  budget_max: number | "";
  description: string;
  attachments: File[];
};

export type RfqFormErrors = Partial<{
  title: string;
  category_id: string;
  delivery_model: string;
  deadline_date: string;
  budget_min: string;
  budget_max: string;
  description: string;
  attachments: string;
}>;

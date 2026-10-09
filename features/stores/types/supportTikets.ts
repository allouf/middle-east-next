

export type Ticket = {
  id: string | number;
  // add more fields when you need them in TiketsRow/CollapsedProduct
  [key: string]: unknown;
};


export type TicketFormState = {
  store_id: string; // keep as string for FormData
  order_id: string; // empty string when not used
  issue_type_id: string;
  subject: string;
  message: string;
  attachments: File[];
};


export type ProductRow = {
  id: string | number;
  name: string;
  status: 'active' | 'inactive' | string;
  price?: number | string;
  discount?: number | string | null;
  quantity?: number | string | null;
  date?: string | null;
  subCategory?: string | null;
  category?: { name?: string | null } | null;
  gallery?: Array<{ file_path?: string | null }> | null;
};

export type ProductDetails = {
  id: string | number;
  name?: string;
  description?: string | null;
  price?: number | string | null;
};

export type TicketStatusFilter = 'all' | 'OPEN' | 'ANSWERED' | "RESOLVED" | "ESCALATED" | "UNDER_REVIEW" | "CLOSED";

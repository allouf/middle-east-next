export type OrderStatus =
  | "PENDING_PAYMENT"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REVISION"
  | "REVISION_REQUESTED"
  | "REVISION_COMPLETED"
  | "REJECTED"
  | "DISPUTED";

export type PaymentStatus = "escrow" | "paid";

export interface OrderHistoryItemType {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: string; // e.g., "unpaid", "paid"
  service: {
    title: string;
    cover: string | null;
  };
  provider: {
    name: string;
    avatar: string | null;
    type: string;
  };
  order_date: string;
  delivery_time: {
    minutes: number;
    total_minutes: number;
    formatted: string;
    is_overdue: boolean;
    started: boolean;
    extension_request?: {
      days: number;
      reason: string;
    }
  };
  total: number;
  currency: string;
  rejection_reason?: string;
  rejection?: {
    reason: string;
    notes?: string;
  };
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
    total_minutes: number;
    formatted: string;
    is_overdue: boolean;
    started: boolean;
    extension_request?: {
      days: number;
      reason: string;
    }
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

  provider: {
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
  status: "PENDING" | "APPROVED" | "REJECTED";
  requested_at: string;
  responded_at: string | null;
}
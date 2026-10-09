export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PENDING"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REVISION"
  | "IN_REVISION"
  | "REVISION_REQUESTED"
  | "REVISION_COMPLETED"
  | "REJECTED"
  | "DISPUTED";

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  country?: string;
  region?: string;
  type?: string;
}

export interface ExtensionRequest {
  days: number;
  reason: string;
}

export interface TimeRemaining {
  totalMinutes: number | null;
  formatted: string;
  isOverdue: boolean;
  started: boolean;
  extensionRequest?: ExtensionRequest;
}

export interface FileAttachment {
  name: string;
  type: 'pdf' | 'png' | 'doc' | 'jpg';
  url: string;
  size?: string;
}

export interface OrderDelivery {
  id: number;
  version: number;
  message: string;
  attachments: string[];
  submittedAt: string;
}

export interface OrderFeedback {
  id?: string | number;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface OrderExtension {
  id: number;
  requested_days: number;
  reason: {
    id: number;
    name: string;
  };
  description: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED"|"APPROVED";
  requested_at: string;
  responded_at: string | null;
}

export interface DetailedOrder {
  id: string;
  orderNumber: string;
  paymentStatus: string;
  status: OrderStatus;
  title: string;
  provider: Provider;
  customer: Customer;
  timeRemaining?: TimeRemaining;
  orderDate: string;
  deliveryDays: number|string;
  totalPrice: number;
  rejectionReason?: {
    reason: {
      id: number;
      name: string;
    };
    notes: string;
  };
  imageUrl?: string;
  currency?: string;

  category: string;
  rating: number;
  reviewsCount: number;
  description: string;
  serviceType: string;
  deliveryModel: string;
  
  serviceNotes?: string;
  requirementFiles?: FileAttachment[];
  
  feedback?: OrderFeedback;

  // Completed Delivery details
  deliveryMessage?: string;
  deliveryFiles?: FileAttachment[];
  deliveredAt?: string;
  deliveries?: OrderDelivery[];

  extensions?: OrderExtension[];

  // Invoice
  servicePrice: number;
  vat: number;
  fees: number;

  // Revisions
  revisionPolicy?: {
    revisionsAllowed: number;
    revisionsUsed: number;
    revisionsRemaining: number;
  };
  revisions?: OrderRevision[];
}

export interface OrderRevision {
  id: number;
  delivery_version: number;
  notes: string;
  request_type: string;
  status: string;
  rejection_reason: string | null;
  attachments: string[];
  requested_at: string;
  responded_at: string | null;
}

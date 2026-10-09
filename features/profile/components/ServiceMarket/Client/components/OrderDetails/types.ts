import { Order } from '../MyOrders/types';

export interface FileAttachment {
  name: string;
  type: 'pdf' | 'png' | 'doc' | 'jpg';
  url: string;
  size?: string;
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

export interface OrderDelivery {
  id: number;
  version: number;
  message: string;
  attachments: string[];
  submittedAt: string;
}

export interface DetailedOrder extends Order {
  category: string;
  rating: number;
  reviewsCount: number;
  description: string;
  serviceType: string;
  deliveryModel: string;
  
  serviceNotes?: string;
  requirementFiles?: FileAttachment[];
  timeRemaining?: TimeRemaining;
    
  // Completed Delivery details
  deliveryMessage?: string;
  deliveryFiles?: FileAttachment[];
  deliveredAt?: string;
  deliveries?: OrderDelivery[];

  // Invoice
  servicePrice: number;
  vat: number;
  fees: number;
  currency?: string;

  // Revisions
  revisionPolicy?: {
    revisionsAllowed: number;
    revisionsUsed: number;
    revisionsRemaining: number;
  };
  revisions?: OrderRevision[];

  extensions?: OrderExtension[];
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

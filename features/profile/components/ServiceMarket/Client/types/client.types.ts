import { OrderHistoryItemType, OrderDetails, OrderAttachment } from './order';

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

// Client Order Types
export interface ClientOrder {
  id: string;
  orderNumber: string;
  serviceTitle: string;
  providerName: string;
  status: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}

// Order List Response
export interface OrderListResponse {
  orders: OrderHistoryItemType[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Order Filters
export interface OrderFilters {
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

// Order Actions
export interface OrderAction {
  type: 'cancel' | 'accept' | 'reject' | 'complete' | 'dispute';
  reason?: string;
  attachment?: OrderAttachment;
}

// Re-export order types
export type {
  OrderHistoryItemType,
  OrderDetails,
  OrderAttachment,
  OrderStatus,
  PaymentStatus
} from './order';

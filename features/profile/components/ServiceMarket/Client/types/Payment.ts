export type PaymentMethod = "card" | "apple" | "google";

export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  method: PaymentMethod;
}

export interface PaymentOrder {
  id: string;
  rfqId: string;
  servicePrice: string;
  vat: string;
  fees: string;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  currency: string;
  createdAt: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  message: string;
  redirectUrl?: string;
}

export interface PaymentProcessingState {
  isProcessing: boolean;
  error: string | null;
  paymentId: string | null;
}

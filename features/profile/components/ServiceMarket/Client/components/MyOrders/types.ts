export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'rejected' | 'revision' | 'revision_completed' | 'disputed';

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  escrowStatus?: 'in_escrow' | 'paid';
  title: string;
  provider: Provider;
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
}

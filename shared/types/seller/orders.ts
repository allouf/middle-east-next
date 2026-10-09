// Seller Orders Types

export interface CreateOrderRequest {
  user_address_id: any;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  items: any;
  payment_method: string;
  shipping_method: string;
}


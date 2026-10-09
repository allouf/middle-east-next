// Seller Flash Sales Types

export interface CreateFlashSaleRequest {
  store_id: any;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  max_per_user: any;
  discount_type: string;
  discount_value: any;
  status: string;
  products: any;
}

export interface UpdateFlashSaleRequest {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  max_per_user: any;
  discount_type: string;
  discount_value: any;
  status: string;
  products: any;
}


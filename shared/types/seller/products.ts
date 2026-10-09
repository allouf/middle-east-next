// Seller Products Types

export interface CreateProductRequest {
  name: string;
  store_id: string;
  category_id: string;
  description: string;
  discount_value: string;
  discount_type: string;
  status: string;
  options: {
    0: string;
    1: string;
  };
  variants: {
    0: string;
    1: string;
    2: string;
    3: string;
  };
  gallery: {
    0: File | Blob;
    1: File | Blob;
  };
}

export interface UpdateProductRequest {
  name: string;
  store_id: string;
  category_id: string;
  description: string;
  price: string;
  discount_value: string;
  discount_type: string;
  status: string;
  options: {
    0: string;
    1: string;
  };
  variants: {
    0: string;
    1: string;
  };
  gallery: {
    0: File | Blob;
    1: File | Blob;
  };
}


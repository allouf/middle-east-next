// Seller Cart Types

export interface AddItemRequest {
  product_id: any;
  product_variant_id: any;
  quantity: any;
}

export interface AddPackageRequest {
  package_id: any;
  quantity: any;
}

export interface UpdateItemRequest {
  quantity: any;
}


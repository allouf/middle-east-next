// Seller Packages Types

export interface CreatePackageRequest {
  title: string;
  description: string;
  discount_percent: any;
  fixed_discount: any;
  items: any;
}

export interface UpdatePackageRequest {
  title: string;
  description: string;
  discount_percent: any;
  fixed_discount: any;
  items: any;
}

export interface DeletePackageRequest {
  title: string;
  description: string;
  discount_percent: any;
  fixed_discount: any;
  items: any;
}

export interface AddItemToPackageRequest {
  items: any;
}

export interface RemoveItemsFromPackageRequest {
  items: any;
}


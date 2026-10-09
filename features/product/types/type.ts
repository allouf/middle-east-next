export interface Product {
  id: number;
  store_id: number;
  category: {
    id: number;
    name: string;
    icon?: string;
    is_active?: boolean;
    sort_order?: number;
  };
  name: string;
  slug: string;
  price: number;
  price_before_discount: number;
  discount_value: number;
  discount_type: "percentage" | "fixed" | null;
  status: "active" | string;
  number_of_buys: number;
  avg_rating: number;
  total_left_in_stock: number;
  availability_status: "in_stock" | "low_stock" | "unavailable";
  gallery: Array<{
    id: number;
    file_path: string;
    file_type: "image" | "video";
  }>;
  is_favorited: boolean;
  favorited_at: string | null;

  // Legacy fields for backward compatibility
  title?: string;
  oldPrice?: number;
  newPrice?: number;
  rating?: number;
  reviews?: number;
  discount?: number;
  stock?: number;
  image?: string;
  badge?: string;
  originalProduct?: string;
}

interface OriginalProduct {
  id: number | string;
}

export interface ProductsResponse {
  data: {
    products: Product[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export interface ProductGallery {
  id: number;
  file_path: string;
  file_type: "image" | "video";
  sort_order?: number;
  is_active?: boolean;
}
export interface ProductCategory {
  id: number;
  name: string;
  icon?: string;
  is_active?: boolean;
  sort_order?: number;
}
export interface ProductStore {
  id: number;
  name: string;
  logo?: string;
  is_verified?: boolean;
}
export interface OptionValue {
  id: number;
  value: string;
}
export interface ProductOption {
  id: number;
  name: string;
  type: "text" | "color" | string;
  values: OptionValue[];
}
export interface VariantOptionValue {
  option_id: number;
  value: string;
}
export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
  image: string | null;
  is_active: boolean;

  option_values: VariantOptionValue[];
  options: ProductOption[];
}
export interface SelectedBundleProduct {
  id: number | string;
  selected: boolean;
}
export interface SuggestedProduct {
  id: number;
  store_id: number;

  category: ProductCategory;

  name: string;
  slug: string;

  price: number;
  price_before_discount: number;
  discount_value: number;
  discount_type: "percentage" | "fixed" | null;

  status: "active" | string;
  number_of_buys: number;
  avg_rating: number;

  total_left_in_stock: number;
  availability_status: "in_stock" | "low_stock" | "unavailable";

  gallery: ProductGallery[];

  is_favorited: boolean;
  favorited_at: string | null;
}
export interface PackageVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  image: string | null;
  is_active: boolean;
  option_values: any[]; // حالياً فارغة – يمكن توسيعها لاحقاً
}
export interface PackageProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  avg_rating: number;
  price_before_discount: number;
  image: string;
  discount_value: number;
  discount_type: "percentage" | "fixed" | null;

  options?: unknown[];
  variants?: ProductVariant[];
  reviews?: number;
}

export interface PackageItem {
  /** numeric id OR "main-<id>" */
  id: number | string;

  // package_id?: number;

  // product_id: number;
  variant_id?: number | null;

  quantity: number;

  product: PackageProduct;

  variant?: ProductVariant | null;

  // image?: string;

  total_price: number;

  /** فقط للـ main product */
  // isMainProduct?: boolean;
}

export interface ProductPackage {
  id: number;
  // product_id: number;
  store_id: number;

  title: string;
  description: string;

  discount_percent: number | null;
  fixed_discount: number | null;
  discount_type: "percent" | "fixed" | null;

  is_active: boolean;

  // price_before: number;
  // price_after: number;
  total_price: number;

  // savings: number;
  // savings_amount: number;

  // store: any | null;

  items: PackageItem[];
  product: any;

  created_at: string;
  updated_at: string;
}

export interface ProductDetails {
  id: number;
  store_id: number;
  category_id: number;

  name: string;
  slug: string;
  description?: string;
  specifications?: string | null;
  additional_features?: string | null;

  price: number;
  price_before_discount: number;
  discount_value: number;
  discount_type: "percentage" | "fixed" | null;

  number_of_buys: number;
  avg_rating: number;
  status: "active" | "draft" | string;

  gallery: ProductGallery[];
  variants: ProductVariant[];
  options: ProductOption[];

  store: ProductStore;
  category: ProductCategory;

  reviews: any[]; // يمكن تفصيلها لاحقًا
  packages?: ProductPackage[]; // يمكن تفصيلها لاحقًا

  is_favorited: boolean;
  favorited_at: string | null;

  created_at: string;
  updated_at: string;
  stock?: number;
  delivery_info?: string;
}
export interface ProductDetailsData {
  product: ProductDetails;
  suggested_products: SuggestedProduct[];
  best_sellers?: SuggestedProduct[];
}
export interface ProductDetailsResponse {
  status: boolean;
  message: string;
  data: ProductDetailsData;
}

export interface RelatedProduct {
  id: number;
  store_id: number;

  category: {
    id: number;
    name: string;
    icon?: string;
    is_active?: boolean;
    sort_order?: number;
  };

  name: string;
  slug: string;

  price: number;
  price_before_discount: number;
  discount_value: number;
  discount_type: "percentage" | "fixed" | null;

  status: "active" | "draft";
  number_of_buys: number;
  avg_rating: number;

  total_left_in_stock: number;
  availability_status: "in_stock" | "low_stock" | "unavailable";

  gallery: {
    id: number;
    file_path: string;
    file_type: string;
  }[];

  is_favorited: boolean;
  favorited_at: string | null;
}

export interface ProductCardData {
  id: number;
  name: string;
  title: string;
  image: string;
  price: number;
  newPrice: number;
  oldPrice: number;
  price_before_discount: number;
  rating: number;
  reviews: number;
  badge: string | null;
  originalProduct: RelatedProduct;
  is_favorited: boolean;
  category: string;
  stock: number;
}

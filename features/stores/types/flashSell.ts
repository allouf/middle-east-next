// Flash Sell Types

export interface FlashSellFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  max_per_user: number | null;
  discount_type: string | null;
  discount_value: number | null;
  status: "active" | "inactive" ;
  products: FlashSellProduct[];
}


export interface FlashSellProduct {
  product_id: string;
  variants: string[];
}

export interface VariantOption {
  id: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  price: number;
  stock: number;
  sku: string;
  image: string;
  option_values: VariantOption[];
}

export interface VariantDraftItem {
  label: string;
  option_values: VariantOption[];
  price: number;
  stock: number;
  sku: string;
  image: string;
  color?: string | null;
}

export interface VariantDraft {
  [productId: string]: {
    [variantId: string]: VariantDraftItem;
  };
}

export interface SelectedProduct {
  id: string;
  name: string;
}

export interface CreateFlashSellModalProps {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
  messageApi: any;
}

export interface FlashSellPayload extends FlashSellFormData {
  store_id: number;
}

export interface FlashSellCreateResponse {
  success: boolean;
  data?: FlashSellFormData;
  message?: string;
}

export interface FlashSellError {
  field?: string;
  message: string;
}

// Step component props
export interface FlashSellCreateFirstStepProps {
  formData: FlashSellFormData;
  handleChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleAddError: (field: string, message: string) => void;
  errors: Record<string, string>;
  isSubmited: boolean;
}

export interface FlashSellCreateSecondStepProps {
  step: number;
  formData: FlashSellFormData;
  handleAddError: (field: string, message: string) => void;
  errors: Record<string, string>;
  toggleVariantSelection: (productId: string, variant: ProductVariant, name: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  params: { id?: string };
  isSubmited?:boolean;
}

// Form validation types
export interface FlashSellFormErrors {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  max_per_user?: string;
  discount_type?: string;
  discount_value?: string;
  products?: string;
}

// Local storage keys
export const FLASHSELL_STORAGE_KEYS = {
  VARIANT_DRAFT: "flashsell_create_variant_draft",
  FORM_DRAFT: "flashsell_create_form_draft"
} as const;

// API Response Types
export interface ProductCategory {
  id: number;
  name: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface ProductGallery {
  id: number;
  file_path: string;
  file_type: string;
}

export interface Product {
  id: number;
  store_id: number;
  category: ProductCategory;
  name: string;
  slug: string;
  price: number;
  price_before_discount: number;
  discount_value: number;
  discount_type: string | null;
  status: string;
  number_of_buys: number;
  avg_rating: number;
  total_left_in_stock: number;
  availability_status: string;
  gallery: ProductGallery[];
  is_favorited: boolean;
  favorited_at: string | null;
}

export interface ProductVariant {
  id: string;
  price: number;
  stock: number;
  sku: string;
  image: string;
  option_values: VariantOption[];
}

export interface ProductDetails {
  id: number;
  store_id: number;
  category: ProductCategory;
  name: string;
  slug: string;
  price: number;
  price_before_discount: number;
  discount_value: number;
  discount_type: string | null;
  status: string;
  number_of_buys: number;
  avg_rating: number;
  total_left_in_stock: number;
  availability_status: string;
  gallery: ProductGallery[];
  is_favorited: boolean;
  favorited_at: string | null;
  variants: ProductVariant[];
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more: boolean;
}

export interface ProductsResponse {
  products: Product[];
  meta: PaginationMeta;
}

export interface ProductsApiResponse {
  products: Product[];
  meta: PaginationMeta;
}

export interface ProductDetailsApiResponse {
  status: boolean;
  message: string;
  data: ProductDetails;
}

// Flash Sell Details API Response Types
export interface FlashSellStore {
  id: number;
  name: string;
}

export interface FlashSellProductVariant {
  id: number;
  sku: string;
  price: number;
  image: string | null;
  option_values?: VariantOption[];
}

export interface FlashSellProductDetails {
  id: number;
  name: string;
  image: string | null;
  variants: FlashSellProductVariant[];
}

export interface FlashSellDetails {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  max_per_user: number;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  status: "active" | "inactive";
  is_active: boolean;
  store: FlashSellStore;
  products: FlashSellProductDetails[];
}

export interface FlashSellDetailsApiResponse {
  status: boolean;
  message: string;
  data: FlashSellDetails;
}

// Flash Sell List Item Type (for table rows)
export interface FlashSellListItem {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  max_per_user: number;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  status: "active" | "inactive";
  product_count: number;
  is_active: boolean;
}

// FlashSellRow Component Props
export interface FlashSellRowProps {
  sale: FlashSellListItem;
  handleEditFlashSell: (id: number) => void;
  handleDeleteFlashSell: (id: number) => void;
  handleViewFlashSell: (id: number) => void;
  isRTL?: boolean;
}
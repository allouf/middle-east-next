/**
 * Gallery item structure from API
 */
export interface GalleryItem {
  file_path: string;
  id?: number;
  alt?: string;
}

/**
 * Category structure from API
 */
export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

/**
 * Store/Company structure from API
 */
export interface Store {
  id: number;
  name: string;
  slug?: string;
  verified?: boolean;
}

/**
 * Product options (color, size, etc.)
 */
export interface ProductOptions {
  color?: string;
  size?: string;
  [key: string]: string | undefined;
}

/**
 * API response structure for wishlist items
 */
export interface ApiWishlistItem {
  id: number;
  name: string;
  title: string;
  description: string;
  price: number | string;
  price_before_discount: number | null;
  discount_value: number;
  discount_type: "percentage" | "fixed" | null;
  status: "active" | "inactive" | "out_of_stock";
  quantity: number;
  total_left_in_stock?: number;
  image: string;
  gallery: GalleryItem[];
  category: Category | null;
  store: Store | null;
  options: ProductOptions;
  favorited_at: string | null;
  created_at: string;
  avg_rating: number;
  is_favorited: boolean;
}

/**
 * Normalized wishlist item structure used in the store
 */
export interface WishlistItem {
  // Core identifiers
  id: number;
  wishlistItemId: number | null;

  // Product information
  name: string;
  title: string;
  description: string;

  // Category information
  category?: Category | null;
  categoryPath: string[];

  // Store/Company information
  company: string;
  verified: boolean;

  // Pricing
  price: number;
  price_before_discount?: number | null;
  discount_value: number;
  discount_type?: "percentage" | "fixed" | null;
  discountBadge: string | null;

  // Product details
  options: ProductOptions;
  stock: number;
  total_left_in_stock?: number;
  quantity: number;
  status: "active" | "inactive" | "out_of_stock";

  // Media
  image: string;
  gallery?: GalleryItem[];

  // Metadata
  addedDate: string;
  favorited_at?: string | null;
  rating: number;
  is_favorited: boolean;
}

/**
 * Partial wishlist item for adding new items
 * (before API response with full data)
 */
export interface PartialWishlistItem {
  id: number;
  wishlistItemId?: number | null;
  name?: string;
  title?: string;
  categoryPath?: string[];
  category?: string;
  company?: string;
  verified?: boolean;
  options?: ProductOptions;
  color?: string;
  size?: string;
  price?: number;
  newPrice?: number;
  image: string;
  badge?: string;
  discountBadge?: string;
  stock?: number;
  addedDate?: string;
  rating?: number;
  description?: string;
  quantity?: number;
}

/**
 * Wishlist store state and actions
 */
export interface WishlistStore {
  // State
  items: WishlistItem[];

  // Actions
  setWishlist: (apiItems: ApiWishlistItem[]) => void;
  addItem: (item: PartialWishlistItem) => boolean;
  updateWishlistItemId: (productId: number, wishlistItemId: number) => void;
  removeItem: (id: number) => void;
  removeItemByWishlistId: (wishlistItemId: number) => void;
  isInWishlist: (id: number) => boolean;
  getWishlistItemId: (productId: number) => number | null;
  toggleItem: (item: PartialWishlistItem) => boolean;
  clear: () => void;
  getCount: () => number;
}

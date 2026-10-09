export type Id = number | string;

export type Product = {
  id?: Id;
  name?: string;
  price?: number;
  avg_rating?: number;
  image?: string;
  quantity?: number;
  description?: string;
  discount_value?: number;
  discount_type?: "percentage" | "fixed" | string;
  store?: { id?: Id; name?: string };
  category?: { name?: string };
  gallery?: { file_path?: string }[];
};

export type Variant = {
  product?: Product;
  image?: string;
  stock?: number;
  options?: Record<string, unknown>;
};

export type Package = {
  id?: Id;
  title?: string;
  description?: string;
  discount_percent?: number;
  fixed_discount?: number;
  stock?: number;
  store?: { id?: Id; name?: string };
  items?: [
    {
      id: number;
      product_id: number;
      variant_id: number;
      quantity: number;
      product: {
        id: number;
        name: string;
        slug: string;
        price: number;
      };
      variant: {
        id: number;
        sku: string;
        price: number;
      };
    },
  ];
};

export type CartItem = {
  id: Id;
  package_id?: Id;
  quantity?: number;
  price?: number;
  subtotal?: number;
  variant?: Variant;
  product?: Product;
  package?: Package;
};

export type Cart = {
  items?: CartItem[];
  total_price?: number;
};

export type WishlistItem = {
  id: Id;
  wishlistItemId?: Id;
  name: string;
  title: string;
  categoryPath: string[];
  company: string;
  verified: boolean;
  options: Record<string, unknown>;
  price: number;
  image: string;
  discountBadge: string | null;
  stock: number;
  rating: number;
  description: string;
  quantity: number;
};

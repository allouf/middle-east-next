export interface Store {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_cart_amount: number;
  expires_at: string;
  max_usage_count: number;
  max_usage_per_user: number;
  scope: 'categories' | 'products' | 'all';
  is_expired: boolean;
  remaining_usage: number;
  store: Store;
  categories?: Category[];
  products: Product[];
}

export interface CouponsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more: boolean;
}

export interface CouponsData {
  coupons: Coupon[];
  meta: CouponsMeta;
}

export interface CouponsResponse {
  status: boolean;
  message: string;
  data: CouponsData;
}

export interface CouponResponse {
  data: Coupon;
}

export interface ShowCouponModalProps {
  open?: boolean;
  handleClose: () => void;
  couponId?: string | number | null;
  handleDeleteCoupon: (id: string | null) => void;
}
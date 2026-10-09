import { create } from "zustand";

interface CartItem {
  id: string | number;
  quantity: number;
  [key: string]: any;
}

interface Cart {
  id: string | number;
  items: CartItem[];
  total_price: number;
  [key: string]: any;
}

interface CartStore {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
  setCart: (cartData: Cart) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
  getCount: () => number;
  getSubtotal: () => number;
  getCartId: () => string | number | undefined;
  getItemsCount: () => number;
}

/**
 * Cart Store - Now integrated with API
 * Data is fetched from API and managed server-side
 * This store holds the cart state for UI rendering
 */
const useCartStore = create<CartStore>((set, get) => ({
  // Cart data from API
  cart: null, // Full cart object from API
  items: [], // Cart items array
  loading: false,
  error: null,

  // Set cart data from API response
  setCart: (cartData: Cart) => {
    set({
      cart: cartData,
      items: cartData?.items || [],
    });
  },

  // Set loading state
  setLoading: (loading: boolean) => set({ loading }),

  // Set error state
  setError: (error: string | null) => set({ error }),

  // Clear cart (logout or clear)
  clear: () => set({ cart: null, items: [], error: null }),

  // Get cart count
  getCount: (): number => {
    const state = get();
    return state.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  },

  // Get cart subtotal
  getSubtotal: (): number => {
    const state = get();
    return state.cart?.total_price || 0;
  },

  // Get cart ID
  getCartId: (): string | number | undefined => {
    return get().cart?.id;
  },

  // Get items count (number of unique items, not total quantity)
  getItemsCount: (): number => {
    return get().items.length;
  },
}));

export default useCartStore;

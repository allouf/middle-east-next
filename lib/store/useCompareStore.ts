"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompareProduct {
  id: number; // This will be the unique key (variant_id if available, else product_id)
  product_id: number;
  variant_id: number | null;
  name: string;
  price: number;
  image: string;
  category?: {
    id: number;
    name: string;
  };
  store?: {
    id: number;
    name: string;
  };
  reviews?: number;
  total_left_in_stock?: number;
  number_of_buys?: number;
  availability_status?: string;
  status?: string;
  discount_value?: number;
  discount_type?: string;
  price_before_discount?: number;
  avg_rating?: number;
  [key: string]: any;
}

interface CompareStore {
  items: CompareProduct[];
  addItem: (item: CompareProduct) => boolean;
  removeItem: (id: number) => void;
  isInCompare: (product_id: number | undefined, variant_id?: number | string | null) => boolean;
  clear: () => void;
  getCount: () => number;
  getItems: () => CompareProduct[];
}

const MAX_COMPARE_ITEMS = 4;

const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        // Check uniqueness by the unique ID (which should be variant_id if it exists, else product_id)
        const existing = get().items.find((it) => it.id === item.id);
        if (existing) {
          return false; // Already in compare
        }

        if (get().items.length >= MAX_COMPARE_ITEMS) {
          return false; // Max limit reached
        }

        // Check category constraint - all items must be from same category
        const currentItems = get().items;
        if (currentItems.length > 0) {
          const firstCategoryId = currentItems[0]?.category?.id;
          if (firstCategoryId && item.category?.id !== firstCategoryId) {
            return false; // Different category
          }
        }

        set({ items: [...get().items, item] });
        return true;
      },

      removeItem: (id) => {
        set({ items: get().items.filter((it) => it.id !== id) });
      },

      isInCompare: (product_id, variant_id) => {
        if (!product_id) return false;
        // If variant_id is provided, check for specific variant
        if (variant_id) {
          return get().items.some(
            (it) => it.product_id === product_id && it.variant_id === variant_id
          );
        }
        // Fallback: check if the product (any variant) is in compare
        return get().items.some((it) => it.product_id === product_id);
      },

      clear: () => set({ items: [] }),

      getCount: () => get().items.length,

      getItems: () => get().items,
    }),
    { name: "compare-store" }
  )
);

export default useCompareStore;

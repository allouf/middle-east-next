import { create } from "zustand";

interface AdsFilterStore {
  categoryLoading: boolean;
  subCategoryLoading: boolean;
  priceLoading: boolean;
  conditionLoading: boolean;
  promoLoading: boolean;

  selectedCategoryName: string | null;
  selectedSubCategoryName: string | null;

  setCategoryLoading: (loading: boolean) => void;
  setSubCategoryLoading: (loading: boolean) => void;
  setPriceLoading: (loading: boolean) => void;
  setConditionLoading: (loading: boolean) => void;
  setPromoLoading: (loading: boolean) => void;
  setSelectedCategoryName: (name: string | null) => void;
  setSelectedSubCategoryName: (name: string | null) => void;
}

/**
 * Ads Filter Store - Manages loading states for all ads filters
 * Used to show loading indicators while filter URLs are updating
 */
const useAdsFilterStore = create<AdsFilterStore>((set) => ({
  categoryLoading: false,
  subCategoryLoading: false,
  priceLoading: false,
  conditionLoading: false,
  promoLoading: false,
  selectedCategoryName: null,
  selectedSubCategoryName: null,

  // Set individual filter loading states
  setCategoryLoading: (loading: boolean) => set({ categoryLoading: loading }),
  setSubCategoryLoading: (loading: boolean) => set({ subCategoryLoading: loading }),
  setPriceLoading: (loading: boolean) => set({ priceLoading: loading }),
  setConditionLoading: (loading: boolean) => set({ conditionLoading: loading }),
  setPromoLoading: (loading: boolean) => set({ promoLoading: loading }),
  setSelectedCategoryName: (name: string | null) => set({ selectedCategoryName: name }),
  setSelectedSubCategoryName: (name: string | null) => set({ selectedSubCategoryName: name }),
}));

export default useAdsFilterStore;

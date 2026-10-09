import { create } from "zustand";

interface CategoryStore {
  categoryLoading: boolean;
  selectedCategoryName:string;
  setCategoryLoading: (loading: boolean) => void;
  setSelectedCategoryName: (name: string) => void;
}

/**
 * Category Store - Manages category loading state
 * Used to show loading indicator while category URL is updating
 */
const useCategoryStore = create<CategoryStore>((set) => ({
  categoryLoading: false,
  selectedCategoryName : "",

  // Set category loading state
  setCategoryLoading: (loading: boolean) => set({ categoryLoading: loading }),
  setSelectedCategoryName: (name: string) => set({ selectedCategoryName: name }),


}));

export default useCategoryStore;

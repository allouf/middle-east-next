// useSelectionStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSelectionStore = create(
  persist(
    (set) => ({
      selectedCountry: null,
      selectedCategory: null,
      selectedGovernorate: null,

      setSelectedCountry: (country) => set({ selectedCountry: country }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedGovernorate: (governorate) =>
        set({ selectedGovernorate: governorate }),

      clearSelection: () =>
        set({
          selectedCountry: null,
          selectedCategory: null,
          selectedGovernorate: null,
        }),

      clearSelectionGover: () =>
        set({
          selectedCategory: null,
          selectedGovernorate: null,
        }),
    }),
    {
      name: "selection-storage",
      partialize: (state) => ({
        selectedCountry: state.selectedCountry,
        selectedCategory: state.selectedCategory,
        selectedGovernorate: state.selectedGovernorate,
      }),
    }
  )
);

export default useSelectionStore;

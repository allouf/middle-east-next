import { create } from 'zustand';

interface ServicesFilterState {
  categoryLoading: boolean;
  subCategoryLoading: boolean;
  priceLoading: boolean;
  ratingLoading: boolean;
  serviceTypeLoading: boolean;
  deliveryTypeLoading: boolean;
  
  selectedCategoryName: string | null;
  selectedSubCategoryName: string | null;

  setCategoryLoading: (loading: boolean) => void;
  setSubCategoryLoading: (loading: boolean) => void;
  setPriceLoading: (loading: boolean) => void;
  setRatingLoading: (loading: boolean) => void;
  setServiceTypeLoading: (loading: boolean) => void;
  setDeliveryTypeLoading: (loading: boolean) => void;

  setSelectedCategoryName: (name: string | null) => void;
  setSelectedSubCategoryName: (name: string | null) => void;
}

const useServicesFilterStore = create<ServicesFilterState>((set) => ({
  categoryLoading: false,
  subCategoryLoading: false,
  priceLoading: false,
  ratingLoading: false,
  serviceTypeLoading: false,
  deliveryTypeLoading: false,

  selectedCategoryName: null,
  selectedSubCategoryName: null,

  setCategoryLoading: (loading) => set({ categoryLoading: loading }),
  setSubCategoryLoading: (loading) => set({ subCategoryLoading: loading }),
  setPriceLoading: (loading) => set({ priceLoading: loading }),
  setRatingLoading: (loading) => set({ ratingLoading: loading }),
  setServiceTypeLoading: (loading) => set({ serviceTypeLoading: loading }),
  setDeliveryTypeLoading: (loading) => set({ deliveryTypeLoading: loading }),

  setSelectedCategoryName: (name) => set({ selectedCategoryName: name }),
  setSelectedSubCategoryName: (name) => set({ selectedSubCategoryName: name }),
}));

export default useServicesFilterStore;

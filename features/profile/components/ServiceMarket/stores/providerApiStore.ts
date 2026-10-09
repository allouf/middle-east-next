import { create } from 'zustand';

interface ProviderApiState {
  shouldShowCreateForm: boolean;
  setShouldShowCreateForm: (show: boolean) => void;
  checkApiResponse: (response: any) => void;
  reset: () => void;
}

export const useProviderApiStore = create<ProviderApiState>((set) => ({
  shouldShowCreateForm: false,
  
  setShouldShowCreateForm: (show: boolean) => {
    set({ shouldShowCreateForm: show });
  },

  
  checkApiResponse: (response: any) => {
    // Check for 482 in the response status or specific error code
    if (
      response?.status === 482 || 
      response?.data?.code === "provider_profile_incomplete"||
      response?.data?.code === "provider_profile_not_found"
    ) {
      console.log("482 detected! Setting shouldShowCreateForm to true");
      set({ shouldShowCreateForm: true });
    }
  },
  
  reset: () => {
    set({ shouldShowCreateForm: false });
  }
}));

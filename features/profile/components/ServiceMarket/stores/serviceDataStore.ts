import { create } from 'zustand';
import { ServiceOffer } from '../Provider';

interface ServiceDataState {
  // Current service data
  currentService: ServiceOffer | null;
  loading: boolean;
  error: string | null;
  
  // Refetch triggers
  overviewRefetchTrigger: number;
  plansRefetchTrigger: number;
  faqRefetchTrigger: number;
  availabilityRefetchTrigger: number;
  
  // Actions
  setCurrentService: (service: ServiceOffer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Refetch triggers
  triggerOverviewRefetch: () => void;
  triggerPlansRefetch: () => void;
  triggerFaqRefetch: () => void;
  triggerAvailabilityRefetch: () => void;
  triggerAllRefetch: () => void;
  
  // Update specific parts of service
  updateServicePlans: (plans: any[]) => void;
  updateServiceFaq: (faqs: any[]) => void;
  updateServiceAvailability: (availability: any[]) => void;
  
  reset: () => void;
}

export const useServiceDataStore = create<ServiceDataState>((set, get) => ({
  // Initial state
  currentService: null,
  loading: false,
  error: null,
  overviewRefetchTrigger: 0,
  plansRefetchTrigger: 0,
  faqRefetchTrigger: 0,
  availabilityRefetchTrigger: 0,

  // Basic actions
  setCurrentService: (service) => set({ currentService: service }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Refetch triggers
  triggerOverviewRefetch: () => set((state) => ({ 
    overviewRefetchTrigger: state.overviewRefetchTrigger + 1 
  })),
  
  triggerPlansRefetch: () => set((state) => ({ 
    plansRefetchTrigger: state.plansRefetchTrigger + 1 
  })),
  
  triggerFaqRefetch: () => set((state) => ({ 
    faqRefetchTrigger: state.faqRefetchTrigger + 1 
  })),
  
  triggerAvailabilityRefetch: () => set((state) => ({ 
    availabilityRefetchTrigger: state.availabilityRefetchTrigger + 1 
  })),
  
  triggerAllRefetch: () => set((state) => ({ 
    overviewRefetchTrigger: state.overviewRefetchTrigger + 1,
    plansRefetchTrigger: state.plansRefetchTrigger + 1,
    faqRefetchTrigger: state.faqRefetchTrigger + 1,
    availabilityRefetchTrigger: state.availabilityRefetchTrigger + 1
  })),

  // Update specific parts
  updateServicePlans: (plans) => set((state) => ({
    currentService: state.currentService ? {
      ...state.currentService,
      plans
    } : null
  })),
  
  updateServiceFaq: (faqs) => set((state) => ({
    currentService: state.currentService ? {
      ...state.currentService,
      faqs
    } : null
  })),
  
  updateServiceAvailability: (availability) => set((state) => ({
    currentService: state.currentService ? {
      ...state.currentService,
      available_slots: availability
    } : null
  })),

  reset: () => set({
    currentService: null,
    loading: false,
    error: null,
    overviewRefetchTrigger: 0,
    plansRefetchTrigger: 0,
    faqRefetchTrigger: 0,
    availabilityRefetchTrigger: 0
  })
}));

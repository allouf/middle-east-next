import { create } from 'zustand';

interface FooterVisibilityState {
  isVisible: boolean;
  setFooterVisible: (visible: boolean) => void;
  hideFooter: () => void;
  showFooter: () => void;
}

export const useFooterVisibility = create<FooterVisibilityState>((set) => ({
  isVisible: true,
  setFooterVisible: (visible) => set({ isVisible: visible }),
  hideFooter: () => set({ isVisible: false }),
  showFooter: () => set({ isVisible: true }),
}));

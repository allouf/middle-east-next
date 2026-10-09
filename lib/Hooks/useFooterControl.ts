import { useFooterVisibility } from '@/lib/store/useFooterVisibility';

export const useFooterControl = () => {
  const { isVisible, setFooterVisible, hideFooter, showFooter } = useFooterVisibility();

  return {
    isFooterVisible: isVisible,
    hideFooter,
    showFooter,
    toggleFooter: () => setFooterVisible(!isVisible),
    setFooterVisible
  };
};

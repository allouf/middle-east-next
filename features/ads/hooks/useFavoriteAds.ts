'use client';

import { useCallback, useEffect } from 'react';
import { ADS_ENDPOINTS } from '@/shared/constants/api-endpoints';
import usePostData from '@/lib/api/usePostData';
import useGetData from '@/lib/api/useGetData';
import { Ad } from '@/features/ads/types/type';
import { message } from 'antd';
import useFavoriteAdsStore from '@/features/ads/store/useFavoriteAdsStore';
import { useAuth } from '@/lib/context/AuthContext';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAlert } from '@/lib/context/AlertProvider';

interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
  is_favorite: boolean;
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface FavoriteItem {
  id: number;
  advertisement: Ad;
  created_at: string;
}

interface FavoritesData {
  data: FavoriteItem[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
}

interface UseFavoriteAdsReturn {
  // Toggle favorite
  toggleFavorite: (advertisementId: number) => Promise<void>;
  toggleLoading: boolean;
  toggleError: unknown;

  // Get favorites
  favorites: Ad[] | null;
  favoritesLoading: boolean;
  favoritesError: string | null;
  refetchFavorites: () => void;

  // Store getters
  isFavorite: (adId: number) => boolean;
  isPending: (adId: number) => boolean;
}

const useFavoriteAds = (enabled: boolean = true): UseFavoriteAdsReturn => {
  // Zustand store actions and getters
  const { toggleFavorite: storeToggle, rollbackFavorite, clearPending, syncWithServer, isFavorite, isPending } = useFavoriteAdsStore();
  const {message:messageApi} = useAlert();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  // POST hook for toggling favorites
  const {
    postData,
    loading: toggleLoading,
    error: toggleError,
  } = usePostData(ADS_ENDPOINTS.toggle_favourit);

  // GET hook for fetching favorites
  // Only enable if explicitly requested AND user is authenticated
  const {
    data: favoritesData,
    loading: favoritesLoading,
    error: favoritesError,
    refetch: refetchFavorites,
  } = useGetData<ApiResponse<FavoritesData>>({
    url: enabled && isAuthenticated ? ADS_ENDPOINTS.get_favourit : undefined,
    enabled: enabled && isAuthenticated,
  });

  // Sync with Zustand store when server data loads
  useEffect(() => {
    // console.log("favorit Data",favoritesData)
    if (Array.isArray(favoritesData?.data?.data)) {
      const favoriteIds = favoritesData.data.data.map((item: FavoriteItem) => item.advertisement.id);
      syncWithServer(favoriteIds);
    }
  }, [favoritesData, syncWithServer]);

  // Toggle favorite function with optimistic updates using Zustand store
  const toggleFavorite = useCallback(async (advertisementId: number) => {
    // If not authenticated, show a warning and don't make the API call
    if (!isAuthenticated) {
      messageApi.warning(t('common.loginRequired', { defaultValue: 'Please log in to add to favorites' }));
      return;
    }

    // Immediate optimistic update in Zustand store
    storeToggle(advertisementId);

    try {
      await postData(
        { advertisement_id: advertisementId },
        {

          onSuccess: () => {
            // Clear pending state after successful server update
            clearPending(advertisementId);
            refetchFavorites()
            // messageApi.success(isFavorite(advertisementId) ? "Ad added to favorites" : "Ad removed from favorites");
          },
          onError: () => {
            // Rollback the optimistic update on error
            rollbackFavorite(advertisementId);
            //  messageApi.error("Failed to update favorites");
          },
        }
      );
    } catch (err) {
      // Rollback on any error
      rollbackFavorite(advertisementId);
      messageApi.error("Failed to update favorites");
      console.error('Error toggling favorite:', err);
    }
  }, [storeToggle, rollbackFavorite, clearPending, postData, messageApi, isFavorite, isAuthenticated]);

  // Note: isFavorite and isPending are directly from Zustand store
  // No need to redefine them here

  return {
    // Toggle operations
    toggleFavorite,
    toggleLoading,
    toggleError,

    // Get operations
    favorites: favoritesData?.data?.data?.map((item: FavoriteItem) => item.advertisement) || null,
    favoritesLoading,
    favoritesError,
    refetchFavorites,

    // Store getters (directly from Zustand)
    isFavorite,
    isPending
  };
};

export default useFavoriteAds;

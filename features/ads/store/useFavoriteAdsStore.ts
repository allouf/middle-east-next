import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteAdsState {
  // State
  localFavorites: Set<number>;
  pendingOperations: Map<number, 'add' | 'remove'>;
  
  // Actions
  addFavorite: (adId: number) => void;
  removeFavorite: (adId: number) => void;
  toggleFavorite: (adId: number) => void;
  rollbackFavorite: (adId: number) => void;
  syncWithServer: (adIds: number[]) => void;
  clearPending: (adId: number) => void;
  
  // Getters
  isFavorite: (adId: number) => boolean;
  isPending: (adId: number) => boolean;
  getPendingOperation: (adId: number) => 'add' | 'remove' | null;
}

const useFavoriteAdsStore = create<FavoriteAdsState>()(
  persist(
    (set, get) => ({
      // Initial state
      localFavorites: new Set(),
      pendingOperations: new Map(),

      // Add favorite optimistically
      addFavorite: (adId: number) => {
        set((state) => {
          const newFavorites = new Set(state.localFavorites);
          newFavorites.add(adId);
          
          const newPending = new Map(state.pendingOperations);
          newPending.set(adId, 'add');
          
          return {
            localFavorites: newFavorites,
            pendingOperations: newPending,
          };
        });
      },

      // Remove favorite optimistically
      removeFavorite: (adId: number) => {
        set((state) => {
          const newFavorites = new Set(state.localFavorites);
          newFavorites.delete(adId);
          
          const newPending = new Map(state.pendingOperations);
          newPending.set(adId, 'remove');
          
          return {
            localFavorites: newFavorites,
            pendingOperations: newPending,
          };
        });
      },

      // Toggle favorite
      toggleFavorite: (adId: number) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(adId)) {
          removeFavorite(adId);
        } else {
          addFavorite(adId);
        }
      },

      // Rollback on error - reverts the optimistic update
      rollbackFavorite: (adId: number) => {
        set((state) => {
          const newFavorites = new Set(state.localFavorites);
          const newPending = new Map(state.pendingOperations);
          
          // Check what the pending operation was
          const pendingOp = newPending.get(adId);
          
          // Revert based on what we tried to do
          if (pendingOp === 'add') {
            // We tried to add but failed, so remove it
            newFavorites.delete(adId);
          } else if (pendingOp === 'remove') {
            // We tried to remove but failed, so add it back
            newFavorites.add(adId);
          }
          
          // Clear the pending operation
          newPending.delete(adId);
          
          return {
            localFavorites: newFavorites,
            pendingOperations: newPending,
          };
        });
      },

      // Sync with server data (e.g., when fetching initial favorites)
      syncWithServer: (adIds: number[]) => {
        set((state) => {
          // Only update items that are not currently pending
          const newFavorites = new Set(state.localFavorites);
          
          adIds.forEach((id) => {
            if (!state.pendingOperations.has(id)) {
              newFavorites.add(id);
            }
          });
          
          return { localFavorites: newFavorites };
        });
      },

      // Clear pending operation after success
      clearPending: (adId: number) => {
        set((state) => {
          const newPending = new Map(state.pendingOperations);
          newPending.delete(adId);
          return { pendingOperations: newPending };
        });
      },

      // Check if an ad is favorite
      isFavorite: (adId: number) => {
        return get().localFavorites.has(adId);
      },

      // Check if an ad has a pending operation
      isPending: (adId: number) => {
        return get().pendingOperations.has(adId);
      },

      // Get the pending operation type
      getPendingOperation: (adId: number) => {
        return get().pendingOperations.get(adId) || null;
      },
    }),
    {
      name: 'favorite-ads-storage',
      // Only persist the localFavorites, not pending operations
      partialize: (state) => ({ localFavorites: Array.from(state.localFavorites) }),
      // Convert array back to Set when rehydrating
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.localFavorites = new Set(state.localFavorites);
          state.pendingOperations = new Map();
        }
      },
    }
  )
);

export default useFavoriteAdsStore;

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PartialWishlistItem,
  WishlistItem,
  WishlistStore,
} from "./types/wishlist.types";

// Wishlist item shape
// { id, wishlistItemId, name, title, categoryPath, company, verified, options:{color,size}, price, image, discountBadge, stock, addedDate, rating, description }

const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Set wishlist items from API
      setWishlist: (apiItems) => {
        if (!apiItems || !Array.isArray(apiItems)) {
          set({ items: [] });
          return;
        }

        const normalized = apiItems.map((item) => {
          // Handle the new response structure where data is array of products directly
          // console.log("item", item);
          const product = item;

          return {
            id: product.id, // Product ID
            wishlistItemId: product.id, // Use product ID for deletion (same as product ID based on API response)
            name: product.name || product.title || "",
            title: product.name || product.title || "",
            category: product.category || null, // Keep full category object
            categoryPath: product.category?.name
              ? [product.category.name]
              : ["Electronic"],
            company: product.store?.name || "Company name",
            verified: true,
            options: product.options || {},
            price: Number(product.price || 0),
            image:
              product.gallery?.[0]?.file_path ||
              product.image ||
              "/dummy/prod21.png",
            gallery: product.gallery || [],
            discountBadge:
              product.discount_value && product.discount_value > 0
                ? product.discount_type === "percentage"
                  ? `${product.discount_value}% OFF`
                  : `$${product.discount_value} OFF`
                : null,
            stock: product.total_left_in_stock,
            addedDate:
              product.favorited_at ||
              product.created_at ||
              new Date().toISOString(),
            favorited_at: product.favorited_at || null,
            rating: product.avg_rating || 5,
            description:
              product.description,
            quantity: product?.quantity || product?.total_left_in_stock,
            price_before_discount: product.price_before_discount || null,
            discount_value: product.discount_value || 0,
            discount_type: product.discount_type || null,
            status: product.status || "active",
            is_favorited: product.is_favorited || false,
          };
        });

        set({ items: normalized });
      },

      addItem: (item) => {
        const existing = get().items.find((it) => it.id === item.id)
        // console.log("item to ADD ",item)
        if (!existing) {
          const normalized: PartialWishlistItem = {
            id: item.id,
            wishlistItemId: item.wishlistItemId || null, // Will be set after API response
            name: item.name || item.title || "Unknown",
            title: item.title || item.name || "Unknown",
            categoryPath: item.categoryPath || [item.category || "Electronic"],
            company: item.company || "Company name",
            verified: Boolean(item.verified),
            options: item.options || {
              color: item.color || "Yellow",
              size: item.size || "M",
            },
            price: Number(item.newPrice || item.price || 0),
            image: item.image,
            discountBadge:
              item.badge === "SALE" ? "25% OFF" : item.discountBadge,
            stock: item.stock,
            addedDate: new Date().toISOString(),
            rating: item.rating || 5,
            description:
              item.description,
            quantity: item.quantity,
          };
          set({ items: [...get().items, normalized as WishlistItem] });
          return true; // Item added
        }
        return false; // Item already exists
      },

      // Update wishlist item ID after API response
      updateWishlistItemId: (productId, wishlistItemId) => {
        const items = get().items.map((item) =>
          item.id === productId ? { ...item, wishlistItemId } : item
        );
        set({ items });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((it) => it.id !== id) });
        // message.success("Item removed from wishlist"); 
      },

      // Remove by wishlist item ID (backend ID)
      removeItemByWishlistId: (wishlistItemId) => {
        set({
          items: get().items.filter(
            (it) => it.wishlistItemId !== wishlistItemId
          ),
        });
        // message.success("Item removed from wishlist");
      },

      isInWishlist: (id) => get().items.some((it) => it.id === id),

      // Get wishlist item ID by product ID
      getWishlistItemId: (productId) => {
        const item = get().items.find((it) => it.id === productId);
        return item?.wishlistItemId || null;
      },

      toggleItem: (item) => {
        const existing = get().items.find((it) => it.id === item.id);
        if (existing) {
          get().removeItem(item.id);
          return false; // Removed
        } else {
          get().addItem(item);
          return true; // Added
        }
      },

      clear: () => set({ items: [] }),

      getCount: () => get().items.length,
    }),
    { name: "wishlist-store" }
  )
);

export default useWishlistStore;

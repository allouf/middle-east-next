'use client';

import { useState, useCallback } from "react";
import api from "./index";
import { App } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";

/**
 * Custom hook for wishlist API operations
 * Follows the same pattern as useCartApi
 */
const useWishlistApi = () => {
  const { message: messageApi } = App.useApp();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch wishlist data from API
   * GET /wishlists
   */
  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/wishlists");

      // console.log("response", response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch wishlist";
      setError(errorMessage);
      console.error("Fetch wishlist error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add item to wishlist (toggle endpoint)
   * POST /wishlists/toggle
   * @param {Object} data - { product_id } or product_id number
   */
  const addToWishlist = useCallback(async (data: any, options: any = {}) => {
    setLoading(true);
    setError(null);
    const { onSuccess, onError, showMessage = true } = options;

    try {
      // Create FormData with product_id
      const formData = new FormData();
      const productId = typeof data === 'object' ? (data.product_id || data) : data;
      formData.append('product_id', productId);

      // console.log("formData to wishlist ",formData)

      // Axios will automatically detect FormData and set Content-Type with boundary
      // The default multipart/form-data header will be overridden with proper boundary
      const response = await api.post("/wishlists/toggle", formData);
      
      if (showMessage) {
        // Find if the response says it was added or removed (toggle)
        const isRemoved = response.data?.message?.toLowerCase().includes("remove") || 
                         response.data?.message?.toLowerCase().includes("حذف") ||
                         response.data?.status === false; // If API returns status false on toggle it might mean removed, but let's be safe.
        
        // Actually the message comes from backend usually, but we want our translations.
        // For wishlist toggle, it's better to use the message from backend if available, 
        // OR use our translated messages if we can determine the action.
        
        if (response.data?.message) {
            // If we have a backend message, we could try to mapping it or just show it.
            // But requirement is "with translation".
            // Let's assume toggle always succeeds if no error.
            if (response.data.message.toLowerCase().includes("add") || response.data.message.includes("إضافة")) {
                messageApi.success(t("wishlist.added_success"));
            } else {
                messageApi.success(t("wishlist.removed_success"));
            }
        }
      }
      
      if (onSuccess) onSuccess(response.data);
      
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to add item to wishlist";
      setError(errorMessage);
      
      if (showMessage) {
        messageApi.error(errorMessage);
      }
      
      if (onError) onError(err);
      
      console.error("Add to wishlist error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove item from wishlist (toggle endpoint)
   * POST /wishlists/toggle
   * @param {number} id - Product ID
   */
  const removeFromWishlist = useCallback(async (id: any, options: any = {}) => {
    setLoading(true);
    setError(null);
    const { onSuccess, onError, showMessage = true } = options;

    try {
      // Create FormData with product_id (same as add operation)
      const formData = new FormData();
      const productId = typeof id === 'object' ? (id.product_id || id) : id;
      formData.append('product_id', productId);

      // Use the same toggle endpoint as add operation
      const response = await api.post("/wishlists/toggle", formData);
      
      // Response when removing: { status: true, message: "Product removed from wishlist", data: null }
      if (showMessage) {
        messageApi.success(t("wishlist.removed_success"));
      }
      
      if (onSuccess) onSuccess(response.data);
      
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to remove item";
       setError(errorMessage);
      
      if (showMessage) {
        messageApi.error(t("wishlist.remove_error"));
      }
      
      if (onError) onError(err);
      
      console.error("Remove from wishlist error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  };
};

export default useWishlistApi;


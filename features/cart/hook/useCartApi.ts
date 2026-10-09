"use client";

import { useCallback, useState } from "react";
import { App } from "antd";
import type { AxiosError } from "axios";
import { t } from "i18next";
import api from "../../../lib/api/index";

/** Common API response shape (adjust to your backend) */
export type ApiResponse<T = unknown> = {
  status?: boolean;
  message?: string;
  data?: T;
};

/** Error response shape (adjust to your backend) */
type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

type RequestOptions<TSuccess = unknown> = {
  showMessage?: boolean;
  onSuccess?: (data: ApiResponse<TSuccess>) => void;
  onError?: (error: AxiosError<ApiErrorResponse> | Error) => void;
};

export type AddToCartPayload = {
  product_id: number;
  product_variant_id: number;
  quantity: number;
};

export type AddPackageToCartPayload = {
  package_id: number;
  quantity: number;
};

export type UpdateCartItemPayload = {
  quantity: number;
};

export type CartItemId = number | string;

/**
 * Custom hook for cart API operations
 */
const useCartApi = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown, fallback: string) => {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    return (
      axiosErr?.response?.data?.message ||
      (axiosErr?.message as string) ||
      fallback
    );
  };

  /**
   * GET /cart
   */
  const fetchCart = useCallback(async <TCart = unknown>() => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse<TCart>>("/cart");
      return response.data;
    } catch (err) {
      const msg = getErrorMessage(err, t("cart.messages.failedToFetchCart"));
      setError(msg);
      console.error("Fetch cart error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * POST /cart/add-item
   */
  const addToCart = useCallback(
    async <TResult = unknown>(
      data: AddToCartPayload | AddPackageToCartPayload,
      options: RequestOptions<TResult> = {},
      isPackage: boolean = false
    ) => {
      setLoading(true);
      setError(null);

      const { onSuccess, onError, showMessage = true } = options;

      try {
        const response = await api.post<ApiResponse<TResult>>(
          isPackage ? "/cart/add-package" : "/cart/add-item",
          data
        );

        if (showMessage) {
          messageApi.success(t("cart.messages.addedToCart"));
        }

        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const msg = getErrorMessage(err, t("cart.messages.failedToAddToCart"));
        setError(msg);

        // if (showMessage) messageApi.error(msg);

        onError?.(err as AxiosError<ApiErrorResponse>);
        console.error("Add to cart error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * DELETE /cart/remove-item/{id}
   */
  const removeFromCart = useCallback(
    async <TResult = unknown>(
      id: CartItemId,
      options: RequestOptions<TResult> = {}
    ) => {
      setLoading(true);
      setError(null);

      const { onSuccess, onError, showMessage = true } = options;

      try {
        const response = await api.delete<ApiResponse<TResult>>(
          `/cart/remove-item/${id}`
        );

        if (showMessage) {
          messageApi.success(response.data?.message || t("cart.messages.itemRemovedFromCart"));
        }

        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const msg = getErrorMessage(err, t("cart.messages.failedToRemoveItem"));
        setError(msg);

        if (showMessage) messageApi.error(msg);

        onError?.(err as AxiosError<ApiErrorResponse>);
        console.error("Remove from cart error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * POST /cart/update-item/{id}
   */
  const updateCartItem = useCallback(
    async <TResult = unknown>(
      id: CartItemId,
      data: UpdateCartItemPayload,
      options: RequestOptions<TResult> = {}
    ) => {
      setLoading(true);
      setError(null);

      const { onSuccess, onError, showMessage = false } = options;

      try {
        const response = await api.post<ApiResponse<TResult>>(
          `/cart/update-item/${id}`,
          data
        );

        if (showMessage) {
          messageApi.success(response.data?.message || t("cart.messages.quantityUpdated"));
        }

        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const msg = getErrorMessage(err, t("cart.messages.failedToUpdateQuantity"));
        setError(msg);

        if (showMessage) messageApi.error(msg);

        onError?.(err as AxiosError<ApiErrorResponse>);
        console.error("Update cart item error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * DELETE /cart/clear
   */
  const clearCart = useCallback(
    async <TResult = unknown>(options: RequestOptions<TResult> = {}) => {
      setLoading(true);
      setError(null);

      const { onSuccess, onError, showMessage = true } = options;

      try {
        const response = await api.delete<ApiResponse<TResult>>("/cart/clear");

        if (showMessage) {
          messageApi.success(response.data?.message || t("cart.messages.cartCleared"));
        }

        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const msg = getErrorMessage(err, t("cart.messages.failedToClearCart"));
        setError(msg);

        if (showMessage) messageApi.error(msg);

        onError?.(err as AxiosError<ApiErrorResponse>);
        console.error("Clear cart error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    contextHolderCartApi: null
  };
};

export default useCartApi;

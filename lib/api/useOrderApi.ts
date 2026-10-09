'use client';

import { useState, useCallback } from "react";

import api from "./index";
import { App } from "antd";

/**
 * Custom hook for order API operations
 */
const useOrderApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { message: messageApi } = App.useApp();

  /**
   * Create new order
   * POST /orders/create
   * @param {Object} data - Order data with address, items, payment method, etc.
   */
  const createOrder = useCallback(async (data, options = {}) => {
    setLoading(true);
    setError(null);
    const { onSuccess, onError, showMessage = true } = options;

    try {
      const response = await api.post("/orders/create", data);
      
      if (showMessage && response.data?.message) {
        messageApi.success(response.data?.message||"Order placed successfully")
        // Swal.fire({
        //   icon: "success",
        //   title: "Success",
        //   text: response.data.message,
        //   confirmButtonColor: "#3085d6",
        // });
      }
      
      if (onSuccess) onSuccess(response.data);
      
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create order";
      setError(errorMessage);
      
      if (showMessage) {
        const resData = err?.response?.data;
        
        if (resData?.errors) {
          const errorMessages = Object.entries(resData.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");

          // Swal.fire({
          //   icon: "error",
          //   title: "Validation Error",
          //   text: errorMessages,
          //   confirmButtonColor: "#d33",
          // });
          messageApi.error(errorMessages)
        } else {
          // Swal.fire({
          //   icon: "error",
          //   title: "Error",
          //   text: errorMessage,
          //   confirmButtonColor: "#d33",
          // });
          messageApi.error(errorMessage)
        }
      }
      
      if (onError) onError(err);
      
      console.error("Create order error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createOrder,
    contextHolder: null
  };
};

export default useOrderApi;


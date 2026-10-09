"use client";

import { useState } from "react";
import { App } from "antd";
import api from ".";

type RequestOptions = {
  endpoint?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  showMessage?: boolean;
  headers?: Record<string, string>;
};

const hasFile = (value: any): boolean => {
  if (!value) return false;
  if (value instanceof File || value instanceof Blob) return true;
  if (Array.isArray(value)) return value.some(hasFile);
  if (typeof value === "object") return Object.values(value).some(hasFile);
  return false;
};

const toFormData = (payload: Record<string, any>): FormData => {
  const formData = new FormData();

  const appendValue = (key: string, val: any) => {
    if (val === undefined || val === null) return;

    if (val instanceof File || val instanceof Blob) {
      formData.append(key, val);
      return;
    }

    if (Array.isArray(val)) {
      val.forEach((item, idx) => appendValue(`${key}[${idx}]`, item));
      return;
    }

    if (typeof val === "object") {
      formData.append(key, JSON.stringify(val));
      return;
    }

    formData.append(key, String(val));
  };

  Object.entries(payload || {}).forEach(([key, val]) => appendValue(key, val));
  return formData;
};

const usePatchData = (defaultEndpoint = "") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { message: messageApi } = App.useApp();

  const patchData = async (data: any, options: RequestOptions = {}) => {
    setLoading(true);
    setError(null);

    const {
      endpoint = defaultEndpoint,
      onSuccess,
      onError,
      showMessage = true,
      headers = {},
    } = options;

    const shouldUseFormData =
      data instanceof FormData || hasFile(data as Record<string, any>);

    const payload =
      data instanceof FormData
        ? data
        : shouldUseFormData
          ? toFormData(data || {})
          : data;

    const requestHeaders = {
      ...headers,
      ...(payload instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : {}),
    };

    try {
      const response = await api.patch(endpoint, payload, {
        headers: requestHeaders,
      });

      onSuccess?.(response.data);

      if (showMessage && response.data?.message) {
        messageApi.success(response.data.message);
      }

      return response.data;
    } catch (err: any) {
      setError(err);

      const resData = err?.response?.data;

      if (resData?.errors) {
        const errorMessages = Object.entries(resData.errors)
          .map(([field, messages]: any) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        messageApi.error(errorMessages);
      } else {
        messageApi.error(resData?.message || err.message || "Unknown error");
      }

      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    patchData,
    loading,
    error,
    contextHolder: null,
  };
};

export default usePatchData;

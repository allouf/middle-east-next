'use client';

import { useState } from "react";
import { playErrorSound } from "../utils/playSound";
import api from ".";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { App } from "antd";

interface DeleteDataOptions {
  endpoint?: string;
  onSuccess?: (data?: any) => void;
  onError?: (error: any) => void;
  confirm?: boolean;
  showMessage?: boolean;
}

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

interface UseDeleteDataReturn {
  deleteData: (id?: string | number, options?: DeleteDataOptions) => Promise<any>;
  loading: boolean;
  error: any;
}

const useDeleteData = (defaultEndpoint = ""): UseDeleteDataReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const { message: messageApi } = App.useApp();
  const { t } = useTranslation();

  const deleteData = async (id?: string | number, options: DeleteDataOptions = {}) => {
    setLoading(true);
    setError(null);

    const {
      endpoint = defaultEndpoint,
      onSuccess,
      onError,
      confirm = false, // (محفوظ للتوافق)
      showMessage = true, // ✅ NEW PARAM
    } = options;

    try {
      // 🟢 Send delete request
      const deleteUrl = id ? `${endpoint}/${id}` : endpoint;
      const response = await api.delete(deleteUrl);

      if (showMessage) {
        messageApi.success(
          t("common.deletedSuccess", { defaultValue: "Deleted successfully." })
        );
      }

      onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      setError(err);
      playErrorSound();

      const resData: ErrorResponse | undefined = err?.response?.data;

      let errorMsg = t("common.deleteError", {
        defaultValue: "Something went wrong while deleting.",
      });

      if (resData?.message) {
        errorMsg = resData.message;
      } else if (resData?.errors) {
        errorMsg = Object.entries(resData.errors)
          .map(([field, msgs]: [string, string[]]) => `${field}: ${msgs.join(", ")}`)
          .join("\n");
      }

      if (showMessage) {
        messageApi.error(errorMsg);
      }

      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteData,
    loading,
    error,
  };
};

export default useDeleteData;

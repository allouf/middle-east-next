'use client';

import { useState, useEffect, useCallback } from "react";
import api from "./index";

interface UseGetDataOptions {
  page?: number;
  url?: string;
  successMessage?: string | null;
  search?: string;
  paginate?: boolean;
  extraParams?: Record<string, any>;
  enabled?: boolean;
  per_page?: number;
}

interface UseGetDataReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useGetData = <T = any>({
  page = 1,
  url,
  successMessage = null,
  search = "",
  paginate = false,
  extraParams = {},
  enabled = true,
  per_page = 10,
}: UseGetDataOptions): UseGetDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled && !!url); // Only load if enabled & url exists
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {

    if (!enabled || !url) {      // <-- STOP when disabled
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const params = {
      ...(paginate && { paginate: true, per_page, page }),
      ...(search && { "contains[name]": search }),
      ...extraParams,

    };

    api
      .get(url, { params })
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Unknown error";
        console.log(err);
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [enabled, url, page, search, successMessage, paginate, JSON.stringify(extraParams)]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};

export default useGetData;

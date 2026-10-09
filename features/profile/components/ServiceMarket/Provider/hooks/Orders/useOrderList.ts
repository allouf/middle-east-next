"use client";
import { useState, useEffect, useCallback } from 'react';
import { providerOrdersService } from '../../services/provider-orders.service';
import { 
  OrderListResponse, 
  OrderFilters, 
  OrderHistoryItemType,
  RequestOptions 
} from '../../types/provider.types';

interface UseOrderListOptions {
  autoFetch?: boolean;
  initialFilters?: OrderFilters;
}

interface UseOrderListReturn {
  orders: OrderHistoryItemType[];
  loading: boolean;
  error: string | null;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  filters: OrderFilters;
  updateFilters: (newFilters: Partial<OrderFilters>) => void;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasNextPage: boolean;
}

export const useOrderList = (
  options: UseOrderListOptions = {}
): UseOrderListReturn => {
  const { autoFetch = true, initialFilters = {} } = options;

  const [orders, setOrders] = useState<OrderHistoryItemType[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseOrderListReturn['meta']>(null);
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);

  const fetchOrders = useCallback(async (
    requestFilters: OrderFilters = filters,
    append = false
  ) => {
    setLoading(true);
    setError(null);

    try {
      const requestOptions: RequestOptions<OrderListResponse> = {
        onSuccess: (response) => {
          const data = response.data;
          
          if (Array.isArray(data)) {
            if (append) {
              setOrders(prev => [...prev, ...data]);
            } else {
              setOrders(data);
            }
            setMeta(null);
          } else if (data && typeof data === 'object') {
            const ordersList = (data as any).orders || [];
            if (append) {
              setOrders(prev => [...prev, ...ordersList]);
            } else {
              setOrders(ordersList);
            }
            setMeta((data as any).meta || null);
          } else {
            if (!append) {
              setOrders([]);
              setMeta(null);
            }
          }
        },
        onError: (error) => {
          setError(error.message);
          console.error('Failed to fetch orders:', error);
        }
      };

      await providerOrdersService.getOrders(requestFilters, requestOptions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Reset to first page if filters changed (except for pagination)
    if (!newFilters.page) {
      updatedFilters.page = 1;
      setOrders([]);
    }
  }, [filters]);

  const refetch = useCallback(() => {
    return fetchOrders({ ...filters, page: 1 }, false);
  }, [fetchOrders, filters]);

  const hasNextPage = Boolean(
    meta && meta.current_page < meta.last_page
  );

  const loadMore = useCallback(async () => {
    if (!hasNextPage) return;
    
    const nextPage = meta!.current_page + 1;
    const newFilters = { ...filters, page: nextPage };
    setFilters(newFilters);
    
    await fetchOrders(newFilters, true);
  }, [meta, hasNextPage, filters, fetchOrders]);

  useEffect(() => {
    if (autoFetch) {
      fetchOrders(filters, false);
    }
  }, [autoFetch]);

  useEffect(() => {
    // Only re-fetch if filters actually changed and autoFetch is on
    // Note: We use JSON.stringify for a simple deep comparison of filter values
    if (autoFetch) {
       fetchOrders(filters, false);
    }
  }, [filters, autoFetch, fetchOrders]);

  return {
    orders,
    loading,
    error,
    meta,
    filters,
    updateFilters,
    refetch,
    loadMore,
    hasNextPage
  };
};

import { useEffect, useState } from "react";
import useInfiniteScroll from "./useInfiniteScroll";
import useGetSiteData from "./../api/useGetSiteData";

type ItemWithId = {
  id: string | number;
  [key: string]: unknown;
};

type UseInfiniteDataArgs<T extends ItemWithId> = {
  getUrl?: string;
  targetKey: string;
  initialPage?: number;
  perPage?: number;
};

type UseGetSiteDataReturn<T> = {
  data?: {
    data?: unknown;
    meta?: unknown;
    [key: string]: unknown;
  };
  loading: boolean;
  error: unknown;
  refetch: (page?: number) => Promise<void> | void;
  setItems?: (items: T[]) => void;
};

const useInfiniteData = <T extends ItemWithId = ItemWithId>({
  getUrl,
  targetKey,
  initialPage = 1,
  perPage = 10,
}: UseInfiniteDataArgs<T>) => {
  const [page, setPage] = useState<number>(initialPage);
  const [items, setItems] = useState<T[]>([]);

  const { data: resData, loading, error, refetch } =
    useGetSiteData({
      url: targetKey ?? getUrl,
      paginate: true,
    }) as UseGetSiteDataReturn<T>;

  useEffect(() => {
    if (page >= 1) {
      void refetch(page);
    }
  }, [page, refetch]);

  const { isFetching, observerRef } = useInfiniteScroll<T>({
    resData,
    items,
    setItems,
    refetch,
    targetKey,
    page,
    setPage,
  });

  return { items, loading, error, isFetching, observerRef };
};

export default useInfiniteData;



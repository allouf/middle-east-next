import { useEffect, useRef, useState, useMemo, Dispatch, SetStateAction, RefObject } from "react";

interface UseInfiniteScrollProps<T> {
  resData: {
    data?: {
      meta?: {
        last_page?: number;
      };
      [key: string]: unknown;
    };
  } | null;
  refetch: (page: number) => void;
  targetKey: string;
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  isFetching: boolean;
  observerRef: RefObject<HTMLDivElement | null>;
}

const useInfiniteScroll = <T extends { id: string | number }>({
  resData,
  refetch,
  targetKey,
  items,
  setItems,
  page,
  setPage,
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> => {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const lastProcessedPageRef = useRef(0);

  const data = useMemo(() => resData?.data || {}, [resData]);

  const meta = useMemo(() => data?.meta, [data]);
  const lastPage = useMemo(() => meta?.last_page, [meta]);

  // ✅ Use the provided targetKey instead of guessing
  const currentItems = useMemo(() => {
    const items = data?.[targetKey];
    return Array.isArray(items) ? (items as T[]) : [];
  }, [data, targetKey]);

  useEffect(() => {
    // Only process if we have items and this is a new page
    if (currentItems.length > 0 && page > lastProcessedPageRef.current) {
      setItems((prev) => {
        // Check if there's overlap
        const hasDuplicate = currentItems.some((curr) =>
          prev.some((prevItem) => prevItem.id === curr.id)
        );

        // If there are duplicates, don't append
        if (hasDuplicate) {
          console.log("Duplicate items detected, skipping append.");
          return prev;
        }

        // Otherwise, append new items
        return [...prev, ...currentItems];
      });

      lastProcessedPageRef.current = page;
      setIsFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItems.length, page]);

  useEffect(() => {
    if (!observerRef.current || !lastPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          lastPage &&
          page < lastPage &&
          !isFetching
        ) {
          setPage((prev) => prev + 1);
          setIsFetching(true);
        }
      },
      { threshold: 1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [lastPage, page, isFetching, setPage]);

  return {
    items,
    isFetching,
    observerRef,
  };
};

export default useInfiniteScroll;









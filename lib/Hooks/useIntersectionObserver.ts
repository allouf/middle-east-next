import { useEffect, useState, useRef, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

type UseIntersectionObserverReturn = [RefObject<HTMLDivElement | null>, boolean];

/**
 * Custom hook to detect when an element enters the viewport
 * @param options - Intersection Observer options
 * @param options.threshold - Threshold for intersection (0-1)
 * @param options.rootMargin - Root margin for intersection observer
 * @returns [ref, isIntersecting] - Ref to attach to element and intersection state
 */
const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "100px", // Start loading 100px before element is visible
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible = entry.isIntersecting;

        setIsIntersecting(isVisible);

        // Once it has intersected, keep it true (don't disable after scrolling past)
        if (isVisible) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin]);

  return [elementRef, hasIntersected || isIntersecting];
};

export default useIntersectionObserver;









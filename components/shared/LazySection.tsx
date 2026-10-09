import React from "react";
import useIntersectionObserver from "../../lib/Hooks/useIntersectionObserver";

/**
 * LazySection component that wraps sections and enables data fetching only when scrolled into view
 * @param {React.ReactNode} children - Child components to render (should accept enabled prop)
 * @param {boolean} loadImmediately - If true, load immediately without waiting for scroll
 */
const LazySection = ({ 
  children, 
  loadImmediately = false
}) => {
  const [sectionRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px", // Start loading 50px before section is visible
  });

  // If loadImmediately is true, always consider it visible
  const shouldLoad = loadImmediately || isVisible;

  // Clone children and pass shouldLoad as enabled prop
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Pass enabled prop to control data fetching, preserving existing props
      return React.cloneElement(child, { 
        enabled: shouldLoad,
      });
    }
    return child;
  });

  return (
    <div ref={sectionRef} className="w-full">
      {childrenWithProps}
    </div>
  );
};

export default LazySection;


"use client";

import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useLayoutEffect, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Single run page fade/slide that avoids the double-play you see with
 * exit/enter sequences and React Strict Mode re-mounts.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    // Skip the very first render to avoid the StrictMode double-mount flash.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (prefersReducedMotion) {
      return;
    }

    // Hard-set the starting point then animate to visible.
    controls.set({ opacity: 0, y: 14 });
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: "easeOut" },
    });
  }, [pathname, controls, prefersReducedMotion]);

  return (
    <motion.div
      // Keep a stable node; only animate when pathname changes.
      animate={controls}
      initial={false}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}

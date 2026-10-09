"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

interface StoreTabTransitionProps {
  activeKey: string;
  children: ReactNode;
}

/**
 * Simple mount-only fade/slide keyed by tab.
 * No exit animation, so the outgoing tab won't replay before the new one animates.
 */
export default function StoreTabTransition({
  activeKey,
  children,
}: StoreTabTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const firstRender = useRef(true);

  // After first render, mark so subsequent keyed mounts will animate.
  useEffect(() => {
    firstRender.current = false;
  }, []);

  const initial = firstRender.current || prefersReducedMotion
    ? false
    : { opacity: 0, y: 12 };

  const animate = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } };

  return (
    <motion.div key={activeKey} initial={initial} animate={animate} className="min-h-full">
      {children}
    </motion.div>
  );
}

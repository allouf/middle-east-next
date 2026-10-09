"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface ProfileTabTransitionProps {
  activeKey: string;
  children: ReactNode;
}

const variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

export default function ProfileTabTransition({
  activeKey,
  children,
}: ProfileTabTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

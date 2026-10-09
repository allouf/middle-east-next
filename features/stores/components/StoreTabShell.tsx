"use client";

import { ReactNode } from "react";
import StoreTabTransition from "./StoreTabTransition";

interface StoreTabShellProps {
  activeKey: string;
  children: ReactNode;
}

/**
 * Transition wrapper for store management tabs.
 * Skeletons should be provided by the tab content or Suspense fallbacks
 * to avoid double-loading states.
 */
export default function StoreTabShell({
  activeKey,
  children,
}: StoreTabShellProps) {
  return (
    <StoreTabTransition activeKey={activeKey}>
      {children}
    </StoreTabTransition>
  );
}

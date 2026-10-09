"use client";

import { ReactNode } from "react";
import ProfileTabTransition from "./ProfileTabTransition";

interface ProfileTabShellProps {
  activeKey: string;
  children: ReactNode;
}

/**
 * Lightweight wrapper that only handles the fade/slide transition.
 * Skeletons are provided by Suspense fallbacks to avoid double-loading states.
 */
export default function ProfileTabShell({
  activeKey,
  children,
}: ProfileTabShellProps) {
  return (
    <ProfileTabTransition activeKey={activeKey}>
      {children}
    </ProfileTabTransition>
  );
}

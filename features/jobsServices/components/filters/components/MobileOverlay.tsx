"use client";
import React from "react";

export default function MobileOverlay({
  show,
  isMobile,
  onClose,
}: {
  show: boolean;
  isMobile: boolean;
  onClose: () => void;
}) {
  if (!show || !isMobile) return null;
  return <div className="fixed inset-0 z-[20] bg-black/50" onClick={onClose} />;
}

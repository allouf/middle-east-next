"use client";
import React from "react";

export default function SidebarHeader({
  title,
  isMobile,
  onClose,
}: {
  title: string;
  isMobile: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="py-2 px-6 lg:rounded-md"
      style={{ background: "linear-gradient(90deg, #00664F 0%, rgba(0, 102, 79, 0.6) 100%)" }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-bold tracking-tight">{title}</h2>
        {isMobile ? (
          <button onClick={onClose} className="text-white hover:text-gray-200" aria-label="Close">
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}

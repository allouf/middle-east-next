"use client";

import React from "react";
import { Menu } from "lucide-react";

export default function SidebarToggle({
  isMobile,
  isRtl,
  onClick,
}: {
  isMobile: boolean;
  isRtl: boolean;
  onClick: () => void;
}) {
  if (!isMobile) return null;

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`absolute -top-6 ${isRtl ? "right-4" : "left-4"} z-30 p-3 rounded-lg shadow-lg text-white`}
        style={{
          background: "linear-gradient(90deg, #00664F 0%, rgba(0, 102, 79, 0.6) 100%)",
        }}
      >
        <Menu size={22} />
      </button>
    </div>
  );
}

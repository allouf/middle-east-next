"use client";

import React from "react";


export function QuickActionCard({
  title,
  icon: Icon,
  onClick,
}: {
  title: string;
  icon: React.ElementType;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group flex min-h-[120px] w-full flex-col items-center justify-center
        rounded-[20px] border border-grayBorder bg-[#00664F0D]
        px-6 py-6 text-center transition-all duration-200
        hover:-translate-y-0.5 hover:border-[#b9d7ce] hover:bg-white
      "
    >
      <div
        className="
          mb-5 flex h-[64px] w-[64px] items-center justify-center
          rounded-[18px]  transition-all duration-200
          group-hover:scale-105
        "
      >
        <Icon className="h-8 w-8 text-[#0B6B57]" strokeWidth={2.1} />
      </div>

      <h3 className="font-somar-semibold text-[22px] leading-none text-textColor">
        {title}
      </h3>
    </button>
  );
}

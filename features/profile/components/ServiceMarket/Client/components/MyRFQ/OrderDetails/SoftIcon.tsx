import React from "react";

interface SoftIconProps {
  children: React.ReactNode;
  className?: string;
}

export default function SoftIcon({ children, className = "" }: SoftIconProps) {
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6F1] text-[#0B6B57] ${className}`}
    >
      {children}
    </span>
  );
}

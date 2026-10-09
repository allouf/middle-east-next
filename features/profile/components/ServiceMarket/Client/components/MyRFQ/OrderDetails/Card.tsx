import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-[22px] border border-[#E5ECE8] bg-white ${className}`}>
      {children}
    </div>
  );
}

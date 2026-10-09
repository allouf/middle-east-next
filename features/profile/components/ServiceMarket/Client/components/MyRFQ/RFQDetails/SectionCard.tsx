import React from "react";

type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

const SectionCard = ({ children, className = "" }: SectionCardProps) => {
  return (
    <div className={`rounded-2xl border border-[#FAFAFA] bg-[#FAFAFA] ${className}`}>
      {children}
    </div>
  );
};

export default SectionCard;
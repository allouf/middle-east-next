import React from "react";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[#0B6B57]">{icon}</span>
      <span className="text-[#667085]">{label}</span>
      <span className="font-semibold text-[#344054]">{value}</span>
    </div>
  );
}

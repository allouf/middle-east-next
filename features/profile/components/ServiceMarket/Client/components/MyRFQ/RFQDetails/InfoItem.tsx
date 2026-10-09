import React from "react";

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-blueSite">{icon}</span>
      <span className="text-[#475569]">{label}:</span>
      <span className="font-semibold uppercase text-[#475569]">{value}</span>
    </div>
  );
};

export default InfoItem;
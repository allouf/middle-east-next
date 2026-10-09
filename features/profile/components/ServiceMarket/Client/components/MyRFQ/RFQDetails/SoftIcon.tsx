import React from "react";

type SoftIconProps = {
  children: React.ReactNode;
  color?: string;
  bg?: string;
};

const SoftIcon = ({
  children,
  color = "text-[#0B6B57]",
  bg = "bg-[#EAF6F1]",
}: SoftIconProps) => {
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}
    >
      {children}
    </span>
  );
};

export default SoftIcon;
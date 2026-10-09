import React from "react";

interface TableActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function TableActionButton({
  children,
  onClick,
}: TableActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#0B6B57] transition hover:bg-[#F3F7F6]"
    >
      {children}
    </button>
  );
}

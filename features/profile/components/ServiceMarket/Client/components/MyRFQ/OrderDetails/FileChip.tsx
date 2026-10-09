import React from "react";

interface FileChipProps {
  name: string;
  type: "pdf" | "img";
}

export default function FileChip({ name, type }: FileChipProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-[#E5EBE8] bg-[#FAFBFB] px-3 py-2">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-white ${
          type === "pdf" ? "bg-[#F04438]" : "bg-[#3B82F6]"
        }`}
      >
        {type === "pdf" ? "PDF" : "IMG"}
      </span>
      <span className="text-xs text-[#667085]">{name}</span>
    </div>
  );
}

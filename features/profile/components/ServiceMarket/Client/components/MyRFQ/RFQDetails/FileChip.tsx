import React from "react";
import { FileText, Image as ImageIcon } from "lucide-react";

type FileChipProps = {
  name: string;
};

const FileChip = ({ name }: FileChipProps) => {
  const isPdf = name.toLowerCase().endsWith(".pdf");

  return (
    <div className="inline-flex h-12 items-center gap-2 rounded-md border border-grayBorder bg-[#FAFAFA] px-3">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center ${
          isPdf ? "text-[#F04438]" : "text-[#3B82F6]"
        }`}
      >
        {isPdf ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
      </span>

      <span className="text-[14px] font-medium text-textGrayColor">{name}</span>
    </div>
  );
};

export default FileChip;
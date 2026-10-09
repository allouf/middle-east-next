import { FileImage, FileText, Download } from "lucide-react";

interface Props {
  name: string;
  type: "pdf" | "image" | "doc";
  onDownload?: () => void;
}

export default function OrderFileChip({ name, type, onDownload }: Props) {
  const Icon = type === "image" ? FileImage : FileText;

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-grayBorder bg-white px-3 py-2 text-sm text-textGrayColor">
      <Icon className={`h-4 w-4 ${type === "pdf" ? "text-red-500" : "text-blue-500"}`} />
      <span className="max-w-[140px] truncate">{name}</span>
      <button
        type="button"
        onClick={onDownload}
        className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-blueSite transition hover:bg-gray-100"
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}
import Image from "next/image";
import { FileText, Download } from "lucide-react";
import OrderFileChip from "./OrderFileChip";
import { OrderAttachment } from "../../../types/order";


interface Props {
  briefDate: string;
  attachments: OrderAttachment[];
  customerName: string;
  customerAvatar: string;
  customerMessage: string;
}

export default function OrderRequirementsCard({
  briefDate,
  attachments,
  customerName,
  customerAvatar,
  customerMessage,
}: Props) {
  return (
    <div className="rounded-[22px] border border-grayBorder bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF6EF]">
            <FileText className="h-5 w-5 text-blueSite" />
          </span>
          <h3 className="text-[22px] font-bold text-textColor">Order Brief & Requirements</h3>
        </div>

        <span className="pt-2 text-sm text-textGrayColor">{briefDate}</span>
      </div>

      <div className="mb-5 rounded-2xl border border-grayBorder p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h4 className="text-lg font-semibold text-[#0D7A55]">Attached Files</h4>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-blueSite text-blueSite transition hover:bg-blueSite hover:text-white"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {attachments.map((file) => (
            <OrderFileChip
              key={file.id}
              name={file.name}
              type={file.type}
              onDownload={() => console.log("download", file.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-4 rounded-2xl bg-[#FCFCFC] p-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200">
          <Image src={customerAvatar} alt={customerName} fill className="object-cover" />
        </div>

        <div>
          <h5 className="text-xl font-bold text-textColor">{customerName}</h5>
          <p className="mt-2 max-w-4xl text-base leading-7 text-textGrayColor">
            {customerMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
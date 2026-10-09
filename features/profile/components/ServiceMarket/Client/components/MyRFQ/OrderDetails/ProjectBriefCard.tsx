import React from "react";
import { FolderOpen, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "./Card";
import SoftIcon from "./SoftIcon";
import FileChip from "./FileChip";

interface ProjectBriefCardProps {
  lastUpdated: string;
  attachedFiles: Array<{ name: string; type: "pdf" | "img" }>;
  briefAuthor: string;
  briefContent: string;
}

export default function ProjectBriefCard({
  lastUpdated,
  attachedFiles,
  briefAuthor,
  briefContent,
}: ProjectBriefCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <SoftIcon>
            <FolderOpen className="h-5 w-5" />
          </SoftIcon>

          <h3 className="text-[20px] font-bold text-[#1F2937]">
            {t('serviceMarket.rfq.orderDetails.projectBriefTitle')}
          </h3>
        </div>

        <span className="text-xs text-[#98A2B3]">
          {t('serviceMarket.rfq.orderDetails.updated', { date: lastUpdated })}
        </span>
      </div>

      <div className="rounded-2xl border border-[#E5EBE8] p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h4 className="text-sm font-semibold text-[#0B6B57]">
            {t('serviceMarket.rfq.orderDetails.attachedFiles')}
          </h4>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#0B6B57] text-[#0B6B57] transition hover:bg-[#F1F8F5]"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          {attachedFiles.map((file, index) => (
            <FileChip key={index} name={file.name} type={file.type} />
          ))}
        </div>

        <div className="rounded-2xl bg-[#F8FAF9] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F2937] text-xs font-bold text-white">
              {briefAuthor.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>

            <div>
              <h5 className="font-bold text-[#1F2937]">{briefAuthor}</h5>
              <p className="mt-1 text-sm leading-6 text-[#667085]">
                {briefContent}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

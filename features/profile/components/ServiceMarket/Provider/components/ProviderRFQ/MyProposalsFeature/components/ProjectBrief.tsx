"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FileText, Download } from "lucide-react";

interface ProjectBriefProps {
  description: string;
  customerName: string;
  attachments?: Array<{
    id: number;
    file_name: string;
    file_url: string;
    file_type: string;
  }>;
}

export default function ProjectBrief({ 
  description, 
  customerName, 
  attachments = [] 
}: ProjectBriefProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAFAFA] p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9]">
            <FileText className="h-6 w-6 text-[#0B6B57]" />
          </div>

          <h3 className="text-xl font-bold text-[#1F2937]">
            {t("serviceMarket.providerRfq.projectBrief.title", "Project Brief & Requirements")}
          </h3>
        </div>

        <span className="text-xs text-[#98A2B3]">{t("serviceMarket.providerRfq.projectBrief.updatedRecently", "Updated recently")}</span>
      </div>

      {/* Attached Files */}
      {attachments.length > 0 && (
        <div className="rounded-[10px] border border-grayBorder bg-bgWhite p-2 mb-4">
          <div className="mb-2 flex items-start justify-between gap-4">
            <div className="relative -top-6 inline-flex bg-bgWhite pr-3">
              <h4 className="text-base font-bold leading-none text-blueSite">
                {t("serviceMarket.providerRfq.projectBrief.attachedFiles", "Attached Files")}
              </h4>
            </div>
          </div>
          <div className="mb-2 flex items-start justify-between gap-4">
            <div className="-mt-2 flex flex-wrap gap-3">
              {attachments.map((file) => (
                <a
                  key={file.id}
                  href={file.file_url}
                  download={file.file_name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{file.file_name}</span>
                  <Download className="h-4 w-4 text-gray-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customer Message */}
      <div className="mt-4 rounded-2xl bg-[#F8FAF9] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F2937] text-xs font-bold text-white">
            {customerName.charAt(0)}
          </div>

          <div>
            <h5 className="font-bold text-[#1F2937]">{customerName}</h5>
            <p className="mt-1 text-sm leading-6 text-[#667085]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

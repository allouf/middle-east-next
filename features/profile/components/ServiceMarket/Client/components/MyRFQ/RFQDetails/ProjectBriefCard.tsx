import React from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RequestDetail } from "../../../types/Rfq";
import SoftIcon from "./SoftIcon";
import FileChip from "./FileChip";
import SectionCard from "./SectionCard";

interface ProjectBriefCardProps {
  requestDetail?: RequestDetail | null;
}

const ProjectBriefCard = ({ requestDetail }: ProjectBriefCardProps) => {
  const { t } = useTranslation();

  const handleDownloadAll = () => {
    if (!requestDetail?.attachments || requestDetail.attachments.length === 0) return;

    requestDetail.attachments.forEach((attachment) => {
      const link = document.createElement('a');
      link.href = attachment.file_url;
      link.download = attachment.file_name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <SectionCard className="p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <SoftIcon>
            <Image src="/file.svg" alt="File" width={20} height={20} />
          </SoftIcon>

          <h3 className="text-[20px] font-bold text-[#1F2937]">
            {t('serviceMarket.rfq.details.projectBrief.title')}
          </h3>
        </div>

        <span className="text-xs text-[#98A2B3]">{t('serviceMarket.rfq.details.projectBrief.updated')} {requestDetail?.updated_at || ''}</span>
      </div>

      {requestDetail?.attachments && requestDetail.attachments.length > 0 && (
        <div className="rounded-[14px] border border-grayBorder bg-bgWhite p-2">
          <div className="mb-2 flex items-start justify-between gap-4">
            <div className="relative -top-6 inline-flex bg-bgWhite pr-3">
              <h4 className="text-[16px] font-bold leading-none text-blueSite">
                {t("serviceMarket.rfq.details.projectBrief.attachedFiles")}
              </h4>
            </div>

          </div>
          <div className="mb-2 flex items-start justify-between gap-4" >
            <div className="-mt-2 flex flex-wrap gap-3">
              {requestDetail.attachments.map((attachment) => (
                <FileChip key={attachment.id} name={attachment.file_name} />
              ))}
            </div>
            <button
              type="button"
              onClick={handleDownloadAll}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blueSite text-blueSite transition hover:bg-lightGreen  hover:text-white"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-[#F8FAF9] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 px-2 w-10 items-center justify-center rounded-full bg-[#1F2937] text-xs font-bold text-white">
            BM
          </div>

          <div>
            <h5 className="font-bold text-[#1F2937]">Client</h5>
            <p className="mt-1 text-sm leading-6 text-[#667085]">
              {requestDetail?.description || t('serviceMarket.rfq.details.projectBrief.noDescription')}
            </p>
          </div>
        </div>
      </div>

    </SectionCard>
  );
};

export default ProjectBriefCard;
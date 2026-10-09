"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Briefcase, Calendar, Building, FileText, Clock, Award } from "lucide-react";
import { Modal, Button, Tag } from "antd";
import type { WorkExperience } from "./experience";

interface WorkExperienceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: WorkExperience | null;
  onEdit?: (record: WorkExperience) => void;
}

function formatDate(date?: string | null) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const FieldCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="group relative rounded-xl sm:rounded-2xl border border-grayBorder/50 bg-white p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
      
      <div className="relative flex items-start gap-3 sm:gap-4">
        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blueSite flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
          {icon}
        </div>
        <div className="min-w-0 w-full">
          <p className="text-xs sm:text-sm text-textGrayColor font-medium tracking-wide">{title}</p>
          <div className="mt-1 sm:mt-2 text-subTitleColor font-semibold break-words text-sm sm:text-base leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};

const WorkExperienceDetailsModal: React.FC<WorkExperienceDetailsModalProps> = ({
  isOpen,
  onClose,
  record,
  onEdit,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const start = useMemo(() => formatDate(record?.start_date), [record?.start_date]);
  const end = useMemo(() => {
    if (!record) return null;
    if (record.is_current) return t("jobs.userProfile.workExperience.present", { defaultValue: "Present" });
    return formatDate(record.end_date) ?? t("common.na", { defaultValue: "N/A" });
  }, [record, t]);

  const { durationText, colors } = useMemo(() => {
    if (!record) return { durationText: "", colors: { text: "text-gray-500" } };
    
    const startDate = new Date(record.start_date);
    const endDate = record.is_current ? new Date() : (record.end_date ? new Date(record.end_date) : new Date());
    const totalMonths = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    let colorScheme;
    if (totalMonths < 6) {
      colorScheme = {
        text: 'text-[#56E8A7]',
        accent: 'bg-[#00664F33]',
        bg: 'bg-[#56E8A70F]'
      };
    } else if (totalMonths < 12) {
      colorScheme = {
        text: 'text-[#FB8A2E]',
        accent: 'bg-[#FB8A2E33]',
        bg: 'bg-[#FB8A2E0F]'
      };
    } else if (totalMonths < 36) {
      colorScheme = {
        text: 'text-[#6A45BE]',
        accent: 'bg-[#6A45BE33]',
        bg: 'bg-[#6A45BE0F]'
      };
    } else {
      colorScheme = {
        text: 'text-[#C62F94]',
        accent: 'bg-[#C62F9433]',
        bg: 'bg-[#C62F940F]'
      };
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const parts = [];
    if (years) parts.push(`${years} ${t('jobs.userProfile.workExperience.years')}`);
    if (months) parts.push(`${months} ${t('jobs.userProfile.workExperience.months')}`);
    
    return { 
      durationText: parts.length > 0 ? parts.join(', ') : t('jobs.userProfile.workExperience.lessThanMonth'), 
      colors: colorScheme 
    };
  }, [record, t]);

  if (!record) return null;

  const showReadMore = (record.description?.length ?? 0) > 220;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={{ xs: '95vw', sm: '90vw', md: '85vw', lg: 920 }}
      className="work-experience-details-modal"
      styles={{
        body: { padding: 0, maxHeight: '90vh', overflowY: 'auto' },
        mask: { backdropFilter: 'blur(8px)' },
      }}
    >
      <div className="overflow-hidden rounded-3xl bg-white">
        {/* Header */}
        <div className="relative px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-7 border-b border-grayBorder/30 bg-white">
          
          <div className="relative flex items-start gap-3 sm:gap-4 md:gap-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl sm:rounded-3xl bg-blueSite text-white flex items-center justify-center shadow-xl animate-pulse">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-subTitleColor break-words">
                  {record.job_title}
                </h2>

                {record.is_current ? (
                  <Tag className="m-0 rounded-full px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 text-xs font-semibold border-0 bg-blueSite/20 text-blueSite shadow-sm">
                    {t("common.current", { defaultValue: "Current" })}
                  </Tag>
                ) : null}
              </div>

              <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg text-textGrayColor break-words font-medium">
                {record.company_name}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-7 bg-blueLight/5">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Left */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <FieldCard
                icon={<Building className="w-5 h-5 sm:w-6 sm:h-6" />}
                title={t("jobs.userProfile.workExperience.companyName", { defaultValue: "Company Name" })}
              >
                {record.company_name}
              </FieldCard>

              <FieldCard
                icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6" />}
                title={t("jobs.userProfile.workExperience.duration", { defaultValue: "Duration" })}
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base">
                  <span className="font-semibold text-subTitleColor bg-blueLight/30 px-2 sm:px-3 py-1 rounded-full text-sm">{start ?? "-"}</span>
                  <span className="text-textGrayColor font-medium">→</span>
                  <span className="font-semibold text-subTitleColor bg-blueLight/30 px-2 sm:px-3 py-1 rounded-full text-sm">{end ?? "-"}</span>
                </div>
              </FieldCard>

              <FieldCard
                icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />}
                title={t("jobs.userProfile.workExperience.durationLabel", { defaultValue: "Total Duration" })}
              >
                <span className={`${colors.text} font-semibold text-sm sm:text-base`}>
                  {durationText}
                </span>
              </FieldCard>
            </div>

            {/* Right */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <FieldCard
                icon={<Award className="w-5 h-5 sm:w-6 sm:h-6" />}
                title={t("jobs.userProfile.workExperience.fieldOfWork", { defaultValue: "Field of Work" })}
              >
                <span className={`${colors.text} ${colors.bg} px-3 py-1 rounded-full font-medium text-sm`}>
                  {record.industry}
                </span>
              </FieldCard>

              {record.description ? (
                <div className="group relative rounded-2xl border border-grayBorder/50 bg-white p-4 sm:p-5 md:p-6 lg:p-7 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                  
                  <div className="relative flex items-start gap-3 sm:gap-4">
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blueSite flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="min-w-0 w-full">
                      <p className="text-sm text-textGrayColor font-medium tracking-wide">
                        {t("jobs.userProfile.workExperience.jobDescription", { defaultValue: "Job Description" })}
                      </p>

                      <div className="mt-2 sm:mt-3 text-subTitleColor">
                        <p className={`whitespace-pre-wrap leading-relaxed text-sm sm:text-base ${expanded ? "" : "line-clamp-3 sm:line-clamp-4"}`}>
                          {record.description}
                        </p>

                        {showReadMore ? (
                          <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            className="mt-3 sm:mt-4 text-sm font-semibold text-blueSite hover:text-blueSiteHover transition-all duration-300 hover:scale-105 inline-flex items-center gap-1"
                          >
                            {expanded ? (
                              <>
                                {t("common.showLess", { defaultValue: "Show less" })}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </>
                            ) : (
                              <>
                                {t("common.readMore", { defaultValue: "Read more" })}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </>
                            )}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-grayBorder/50 bg-grayLight/30 p-6 sm:p-8 text-textGrayColor text-center">
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-grayBorder/50" />
                  {t("common.noDescription", { defaultValue: "No description provided." })}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {onEdit ? (
              <Button
                type="primary"
                className="h-11 sm:h-12 md:h-13 w-full sm:w-auto sm:flex-1 bg-blueSite border-0 hover:!bg-blueSiteHover font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                onClick={() => {
                  onClose();
                  onEdit(record);
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t("common.edit", { defaultValue: "Edit" })}
                </span>
              </Button>
            ) : null}

            <Button
              className="h-11 sm:h-12 md:h-13 w-full sm:w-auto sm:flex-1 rounded-xl sm:rounded-2xl border-grayBorder/50 bg-white text-subTitleColor hover:!bg-grayLight hover:!border-blueSite/30 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
              onClick={onClose}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t("common.close", { defaultValue: "Close" })}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WorkExperienceDetailsModal;

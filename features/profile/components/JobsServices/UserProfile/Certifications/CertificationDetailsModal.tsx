"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Award, Calendar, Building, ExternalLink, Edit, Clock } from "lucide-react";
import { Modal, Button, Tag } from "antd";
import type { CertificationRecord } from "./certification";

interface CertificationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: CertificationRecord | null;
  onEdit?: (record: CertificationRecord) => void;
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

const CertificationDetailsModal: React.FC<CertificationDetailsModalProps> = ({
  isOpen,
  onClose,
  record,
  onEdit,
}) => {
  const { t } = useTranslation();

  const issueDate = useMemo(() => formatDate(record?.issue_date), [record?.issue_date]);
  const expirationDate = useMemo(() => formatDate(record?.expiration_date), [record?.expiration_date]);

  if (!record) return null;

  const isExpired = record.expiration_date ? new Date(record.expiration_date) < new Date() : false;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={{ xs: '95vw', sm: '90vw', md: '85vw', lg: 920 }}
      className="certification-details-modal"
      styles={{
        body: { padding: 0, maxHeight: '90vh', overflowY: 'auto' },
        mask: { backdropFilter: 'blur(8px)' },
      }}
    >
      <div className="overflow-hidden rounded-3xl bg-white ">
        {/* Header */}
        <div className="relative px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-7 border-b border-grayBorder/30 bg-white">
          
          <div className="relative flex items-start gap-3 sm:gap-4 md:gap-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl sm:rounded-3xl bg-blueSite text-white flex items-center justify-center shadow-xl animate-pulse">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-subTitleColor break-words">
                  {record.name}
                </h2>

                {isExpired ? (
                  <Tag className="m-0 rounded-full px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 text-xs font-semibold border-0 bg-red-100 text-red-600 shadow-sm">
                    {t("jobs.userProfile.certifications.expired", { defaultValue: "Expired" })}
                  </Tag>
                ) : record.expiration_date ? (
                  <Tag className="m-0 rounded-full px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 text-xs font-semibold border-0 bg-green-100 text-green-600 shadow-sm">
                    {t("jobs.userProfile.certifications.valid", { defaultValue: "Valid" })}
                  </Tag>
                ) : (
                  <Tag className="m-0 rounded-full px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 text-xs font-semibold border-0 bg-blueSite/20 text-blueSite shadow-sm">
                    {t("jobs.userProfile.certifications.noExpiration", { defaultValue: "No Expiration" })}
                  </Tag>
                )}
              </div>

              <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg text-textGrayColor break-words font-medium">
                {record.issuer}
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
                title={t("jobs.userProfile.certifications.issuer", { defaultValue: "Issuer" })}
              >
                {record.issuer}
              </FieldCard>

              <FieldCard
                icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6" />}
                title={t("jobs.userProfile.certifications.issueDate", { defaultValue: "Issue Date" })}
              >
                <span className="font-semibold text-subTitleColor bg-blueLight/30 px-2 sm:px-3 py-1 rounded-full text-sm">
                  {issueDate || "-"}
                </span>
              </FieldCard>

              {record.expiration_date ? (
                <FieldCard
                  icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />}
                  title={t("jobs.userProfile.certifications.expirationDate", { defaultValue: "Expiration Date" })}
                >
                  <span className={`font-semibold px-2 sm:px-3 py-1 rounded-full text-sm ${
                    isExpired 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {expirationDate}
                  </span>
                </FieldCard>
              ) : null}
            </div>

            {/* Right */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              {record.credential_url ? (
                <div className="group relative rounded-2xl border border-grayBorder/50 bg-white p-4 sm:p-5 md:p-6 lg:p-7 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                  
                  <div className="relative flex items-start gap-3 sm:gap-4">
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blueSite flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                      <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="min-w-0 w-full">
                      <p className="text-sm text-textGrayColor font-medium tracking-wide">
                        {t("jobs.userProfile.certifications.credential", { defaultValue: "Credential URL" })}
                      </p>

                      <div className="mt-3">
                        <a
                          href={record.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blueSite text-white rounded-xl hover:bg-blueSiteHover transition-all duration-300 hover:scale-[1.02] text-sm font-medium shadow-lg hover:shadow-xl"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t("jobs.userProfile.certifications.viewCredential", { defaultValue: "View Credential" })}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-grayBorder/50 bg-grayLight/30 p-6 sm:p-8 text-textGrayColor text-center">
                  <ExternalLink className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-grayBorder/50" />
                  {t("jobs.userProfile.certifications.noCredential", { defaultValue: "No credential URL provided." })}
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
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
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

export default CertificationDetailsModal;

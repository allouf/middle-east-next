"use client";

import React from "react";
import { Button, Card } from "antd";
import {
  DollarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { generateSlug } from "@/lib/utils/helper";
import { useTranslation } from "@/lib/i18n/useTranslation";
import SafeHtml from "@/components/shared/SafeHtml";

export type JobType = "Full time" | "Part time" | "Contract" | "Remote" | string;

export type JobCardItem = {
  id: string | number;
  title: string;
  location: string; // "Berlin, Germany Remote"
  type: JobType; // "Contract"
  salary: string; // "40-45k"
  posted: string; // "3 days ago"
  excerpt?: string;
};

type Props = {
  totalJobs: number; // 132
  jobs: JobCardItem[];
  companyName?: string;

  onViewAll?: () => void;
  onViewDetails?: (job: JobCardItem) => void;

  /** pagination footer like "1 - 10 of 460" */
  rangeText?: string;
  onPrev?: () => void;
  onNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
};

export default function CompanyOpportunitiesGrid({
  totalJobs,
  jobs,
  companyName,
  onViewAll,
  onViewDetails,
  rangeText = "1 - 10 of 460",
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: Props) {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';
  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm sm:text-base font-semibold text-zinc-800">
          {t("jobs.opportunities.title")} ({totalJobs} {totalJobs === 1 ? t("jobs.jobCard.newPost") : t("jobs.jobs")})
        </div>

        {companyName && (
          <Link
            href={`/jobs?scope=jobs&company_name=${encodeURIComponent(companyName)}`}
            className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-800 px-6 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            {t('jobs.opportunities.viewAll')}
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="rounded-xl border  border-zinc-200 shadow-none hover:shadow-sm transition"
            bodyStyle={{ padding: 16 }}
          >
            {/* Title row */}

            <Link
              href={`/jobs/${generateSlug(job.title)}/${job.id}`}
              className="flex  text-start items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-zinc-900 truncate">
                  {job.title}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                  <EnvironmentOutlined className="text-emerald-700" />
                  <span className="truncate">{job.location}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onViewDetails?.(job)}
                className="shrink-0 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                {t('jobs.opportunities.viewDetails')}
                {!isRTL ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
              </button>
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <ClockCircleOutlined className="text-emerald-700" />
                {job.type}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <DollarOutlined className="text-emerald-700" />
                {job.salary}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <ClockCircleOutlined className="text-emerald-700" />
                {job.posted}
              </span>
            </div>
            <div className="my-3 h-px w-full bg-zinc-100" />
            <SafeHtml className="text-xs text-zinc-500 leading-5 line-clamp-2"
              html={typeof job.excerpt === 'string' ? job.excerpt : ''}
              config="STRICT" />

          </Card>
        ))}
      </div>

      {/* Footer Pagination */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-emerald-700">{rangeText}</div>
        {jobs.length > 4 && (
          <div className="flex items-center gap-2 text-blueSite">
            <NavButton
              icon={<ArrowLeft />}
              disabled={!disablePrev}
              onClick={onPrev}
              isRTL={isRTL}
            />
            <NavButton
              icon={<ArrowRight />}
              disabled={!disableNext}
              onClick={onNext}
              isRTL={isRTL}
            />
          </div>
        )}
      </div>
    </section>
  );
}


function NavButton({
  icon,
  disabled,
  onClick,
  isRTL = false,
}: {
  icon: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  isRTL?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-8 w-8 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
    >
      {icon}
    </button>
  );
}
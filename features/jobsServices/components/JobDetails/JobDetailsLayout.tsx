

'use client';

import React from "react";
import {
  CalendarDays,
  Clock3,
  Layers,
  MapPinned,
  Briefcase,
  Wallet,
} from "lucide-react";
import ShareActions from "./ShareActions";
import { useParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import BottomProgressBadge from "./BottomProgressBadge";
import { generateSlug } from "@/lib/utils/helper";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { FiBriefcase, FiCalendar, FiClock, FiDollarSign, FiLayers, FiMonitor } from "react-icons/fi";
import SafeHtml from "@/components/shared/SafeHtml";

type OverviewItem = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

type Props = {
  title: string;
  company?: string;
  badge?: string;
  employerId: string | number;
  salary?: string;
  salaryHint?: string | null;
  icon?: string;
  location: string;
  profileCompletion?: number;
  description: string;
  requirements: string[];
  isCompanyRole?: boolean;
  overview: OverviewItem[];

  onApply?: () => void;
};

export default function JobDetailsLayout({
  title,
  company,
  badge = "Economic",
  employerId,
  salary,
  salaryHint = "Yearly salary",
  icon,
  location,
  profileCompletion,
  isCompanyRole = false,
  description,
  requirements,
  overview,
  onApply,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { role } = useAuth();
  const params = useParams();
  const { slug, id } = params;
  return (
    <div className="bg-white container max-w-7xl mx-auto relative">
      <div className="mx-auto w-full px-4 sm:px-6 py-4 sm:py-6">
        {/* ======= Top Header ======= */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-full bg-blueSite flex items-center justify-center flex-shrink-0">
              {icon ? (
                <img
                  src={icon}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl sm:text-4xl font-black leading-none">
                  {title?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Title / company / badge */}
            <div className="pt-1 min-w-0 flex-1">
              <div className="text-base sm:text-lg font-semibold text-gray-900 break-words">{title}</div>

              <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-gray-500">

                {company &&
                  <Link
                    href={`/jobs/company-view/${generateSlug(company)}/${employerId}`}
                    className="truncate">{company}
                  </Link>
                }
                <span className="rounded bg-emerald-700 px-2 py-[2px] text-[11px] font-semibold text-white w-fit">
                  {badge}
                </span>
              </div>
            </div>
          </div>

          {/* Apply button */}
          {(role === "consumer" || isCompanyRole) &&
            <button
              type="button"
              onClick={isCompanyRole ? undefined : onApply}
              className="inline-flex h-10 items-center gap-2 rounded bg-emerald-700 px-4 sm:px-5 text-sm font-semibold text-white hover:bg-emerald-800 w-full sm:w-auto justify-center"
            >
              {isRTL ? (
                <>
                  {isCompanyRole ? t("jobs.details.viewDetails") : t("jobs.details.applyNow")}
                  <span className="text-base">←</span>
                </>
              ) : (
                <>
                  {isCompanyRole ? t("jobs.details.viewDetails") : t("jobs.details.applyNow")}
                  <span className="text-base">→</span>
                </>
              )}
            </button>
          }
        </div>

        {/* ======= Main Layout ======= */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* ===== Left Content ===== */}
          <main>
            <h3 className="text-lg sm:text-xl font-semibold text-emerald-700">{t("jobs.details.jobDescription")}
            </h3>

            <SafeHtml
              className="mt-4 space-y-4 text-base sm:text-lg leading-6 text-gray-600"
              html={typeof description === 'string' ? description : ''}
              config="MODERATE"
            />

            {/* <h3 className="mt-8 text-lg sm:text-xl font-semibold text-emerald-700">
              {t("jobs.details.requirements")}

            </h3> */}

            {/* <ul className="mt-4 space-y-2 text-base sm:text-lg leading-6 text-gray-600">
              {requirements.map((r, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-[9px] h-[3px] w-[3px] rounded-full bg-gray-500 shrink-0" />
                  <span className="break-words">{r}</span>
                </li>
              ))}
            </ul> */}
          </main>

          {/* ===== Right Sidebar ===== */}
          <aside className="space-y-6">
            {/* Salary / Location card */}
            <div className="rounded border border-gray-200 bg-white">
              <div className={salary ? "grid grid-cols-2" : ""}>
                {salary && 
                
                 <div className="p-4 sm:p-5 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <Wallet className="h-5 w-5" />
                  </div>

                  <div className="text-[10px] sm:text-[11px] font-semibold text-gray-500">
                    {t("jobs.details.salary")}
                  </div>
                  <div className="mt-2 text-xs sm:text-sm font-semibold text-emerald-700 break-words">
                    {salary}
                  </div>
                  {/* <div className="mt-1 text-[10px] sm:text-[11px] text-gray-400">{salaryHint}</div> */}
                </div>
                }
               

                <div className="border-l border-gray-200 p-4 sm:p-5 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <MapPinned className="h-5 w-5" />
                  </div>

                  <div className="text-[10px] sm:text-[11px] font-semibold text-gray-500">
                    {t("jobs.details.jobLocation")}
                  </div>
                  <div className="mt-2 text-[11px] sm:text-[12px] font-semibold text-gray-700 break-words">
                    {location}
                  </div>
                </div>
              </div>
            </div>

            {/* Overview card */}
            <div className="rounded border border-gray-200 bg-white">
              <div className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-800">
                {t("jobs.details.jobOverview")}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 sm:gap-y-6 border-t border-gray-200 px-4 sm:px-5 py-4 sm:py-5">
                {overview.slice(0, 6).map((it, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="mb-2 text-emerald-700">{it.icon}</div>
                    <div className="text-[9px] sm:text-[10px] font-semibold text-gray-400">
                      {it.label}
                    </div>
                    <div className="mt-1 text-[10px] sm:text-[11px] font-semibold text-gray-700 break-words">
                      {it.value}
                    </div>
                  </div>
                ))}
              </div>
              {slug && (
                <div className="border-t border-gray-200 px-4 sm:px-5 py-3 sm:py-4">
                  <ShareActions jobSlug={`${generateSlug(Array.isArray(slug) ? slug[0] : slug)}/${id}`} />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
      {!isCompanyRole && role === "consumer" && Number(profileCompletion) >= 0 && (
        <BottomProgressBadge value={Number(profileCompletion)} />
      )}
    </div>
  );
}


export const overviewIcons = {
  posted: <FiCalendar className="h-5 w-5 text-blueSite" />,
  expire: <FiClock className="h-5 w-5 text-blueSite" />,
  level: <FiLayers className="h-5 w-5 text-blueSite" />,
  exp: <FiDollarSign className="h-5 w-5 text-blueSite" />,   // salary / experience
  type: <FiBriefcase className="h-5 w-5 text-blueSite" />,   // employment type
  mode: <FiMonitor className="h-5 w-5 text-blueSite" />,     // work mode
};
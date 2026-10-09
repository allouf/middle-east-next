import React, { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Briefcase,
  Monitor,
} from "lucide-react";
import Link from "next/link";

import { Job } from "../types/jobs.types";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getCountryNameByCode } from "@/shared/utils/locationApi";

import {
  formatEmploymentType,
  formatExperience,
  formatSalary,
  formatWorkMode,
} from "../helper";
import { generateSlug } from "@/lib/utils/helper";
import { useAuth } from "@/lib/context/AuthContext";
import SafeHtml from "@/components/shared/SafeHtml";

export default function JobCard({
  job,
  onApply,
}: {
  job: Job;
  onApply: () => void;
}) {
  const { t } = useTranslation();
  const { role } = useAuth();
  const [countryName, setCountryName] = useState<string>(job.country_code || '');
  useEffect(() => {
    const fetchCountryName = async () => {
      if (job.country_code) {
        const name = await getCountryNameByCode(job.country_code);
        setCountryName(name);
      }
    };

    fetchCountryName();
  }, [job.country_code]);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3 sm:gap-4">
          <CompanyLogo
            logoUrl={job.employer.image || undefined}
            companyName={job.employer.company_name}
          />

          <div className="min-w-0 flex-1">
            {/* {job?.employer.company_name &&  */}
            <Link
              href={`/jobs/company-view/${generateSlug(job.employer.company_name)}/${job.employer.id}`}
              className="text-base sm:text-lg lg:text-xl text-gray-500">
              {job?.employer.company_name}
            </Link>
            {/* } */}


            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-emerald-800">
                {job.title}
              </h3>

              {job.expires_in_days <= 7 ? (
                <Badge label={t("jobs.jobCard.newPost")} />
              ) : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-600">
              <Meta
                icon={<MapPin className="h-4 w-4" />}
                label={`${job.region}, ${countryName}`}
              />

              <Meta
                icon={<Briefcase className="h-4 w-4" />}
                label={formatEmploymentType(t, job.employment_type)}
              />
              {!job.hide_salary && <Meta
                icon={<DollarSign className="h-4 w-4" />}
                label={formatSalary(job)}
              />}

              <Meta
                icon={<Clock className="h-4 w-4" />}
                label={`${job.expires_in_days} ${t("jobs.details.overview.days")} ${t(
                  "common.left"
                )}`}
              />

              <Meta
                icon={<Monitor className="h-4 w-4" />}
                label={formatWorkMode(t, job.work_mode)}
              />
            </div>
          </div>
        </div>

        <div className="hidden sm:block sm:pt-1 min-w-[150px]">

          <Link
            href={`/jobs/${generateSlug(job.title)}/${job.id}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-emerald-700 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-800 sm:w-auto"
          >
            {role === "company" ? (
              t("jobs.jobCard.viewDetails")
            ) : (
              t("jobs.jobCard.applyJob")
            )}
          </Link>
        </div>
      </div>
      <SafeHtml
        className="mt-4 space-y-4 text-base sm:text-lg leading-6 text-gray-600"
        html={typeof job.description === 'string' ? job.description : ''}
        config="STRICT"
      />
      
      <div className="sm:hidden mt-4">
        <Link
          href={`/jobs/${generateSlug(job.title)}/${job.id}`}
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          {role === "company" ? (
            t("jobs.jobCard.viewDetails")
          ) : (
            t("jobs.jobCard.applyJob")
          )}
        </Link>
      </div>
    </article>
  );
}

function CompanyLogo({
  logoUrl,
  companyName,
}: {
  logoUrl?: string;
  companyName?: string;
}) {
  return (
    <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-full bg-emerald-50 ring-1 ring-emerald-100">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={companyName || "Logo"}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-emerald-700">
          <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      )}
    </div>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 sm:gap-1.5">
      <span className="text-emerald-700">{icon}</span>
      <span className="text-xs sm:text-sm">{label}</span>
    </span>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
      {label}
    </span>
  );
}

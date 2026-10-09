"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CompanyProfile } from "../types/company.types";
import { generateSlug } from "@/lib/utils/helper";
import NoCompaniesFound from "./NoCompaniesFound";
import { useJobsFiltersUrl } from "../hooks/useJobsFiltersUrl";
import Pagination from "./Pagination";
import { JobsMeta } from "../types/jobs.types";


export default function CompaniesListPage({
  companies,
  meta,
}: {
  companies: CompanyProfile[];
  meta?: JobsMeta;
}) {
  const { t, locale } = useTranslation();
  const isRTL = locale === "ar";
  const { actions } = useJobsFiltersUrl({});

  if (!companies?.length) {
    return <NoCompaniesFound resetFilter={actions.resetAll} />;
  }

  return (
    <section className="mx-auto w-full max-w-7xl">
      {/* Header like screenshot */}
      <div className={`mb-4 flex  gap-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
        <span className="text-2xl font-extrabold text-emerald-700">
          {companies.length}
        </span>
        <span className="text-2xl font-extrabold text-zinc-900">
          {t("jobs.company.title")}
        </span>
      </div>

      {/* List */}
      <div className="space-y-4">
        {companies.map((company) => {
          const greenTitle =
            (company.description && company.description.trim()) || company.company_name;

          return (
            <div
              key={company.id}
              className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition hover:shadow-sm"
            >
              <div className={`flex items-center gap-4 `}>
                {/* Avatar */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-100">
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.company_name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center">
                      <span className="text-sm font-bold text-zinc-500">
                        {company.company_name?.slice(0, 2)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-zinc-500">
                    {company.company_name}
                  </div>
                  <div className="truncate text-lg font-semibold text-emerald-700">
                    {greenTitle}
                  </div>
                </div>

                {/* Button right */}
                <Link
                  href={`/jobs/company-view/${generateSlug(company.company_name)}/${company.user_id}`}
                  className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  {isRTL ? (
                    <>

                      {t("jobs.company.viewDetails")}
                      <ArrowLeft className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {t("jobs.company.viewDetails")}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {meta && (
        <Pagination
          meta={meta}
          onPageChange={(page) => actions.setPage(page)}
          onPerPageChange={(per_page) => actions.setPerPage(per_page)}
        />
      )}
    </section>
  );
}
"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { JobsMeta } from "../types/jobs.types";

type Props = {
  meta: JobsMeta;
  onPageChange: (page: number) => void;
  rowsPerPageOptions?: number[];
  onPerPageChange?: (perPage: number) => void;
};

export default function Pagination({
  meta,
  onPageChange,
  rowsPerPageOptions = [10, 20, 50],
  onPerPageChange,
}: Props) {
  const { t, locale } = useTranslation();
  const isRTL = locale === "ar";

  const currentPage = meta.current_page ?? 1;
  const lastPage = meta.last_page ?? 1;
  const total = meta.total ?? 0;

  // common API meta fields (Laravel style). If not present, fallback.
  const perPage = (meta as any).per_page ?? rowsPerPageOptions[0];
  const from = (meta as any).from ?? (total ? (currentPage - 1) * perPage + 1 : 0);
  const to = (meta as any).to ?? Math.min(currentPage * perPage, total);

  const canPrev = currentPage > 1;
  const canNext = currentPage < lastPage;


  const goPrev = () => canPrev && onPageChange(currentPage - 1);
  const goNext = () => canNext && onPageChange(currentPage + 1);

  return (
    <div className="mt-6 flex w-full items-center justify-between gap-4">
      {/* Left: range text */}
      <div className="text-sm font-medium text-blueSite">
        {from} - {to} <span className="text-emerald-700/80">{t("jobs.pagination.of")}</span> {total}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 p-1">
          <span className="text-sm font-semibold text-blueSite">
            {t("jobs.pagination.rowsPerPage")}
          </span>

          <select
            value={perPage}
            onChange={(e) => onPerPageChange?.(Number(e.target.value))}
            className="h-8 rounded-md bg-blueSite px-2 text-sm font-semibold text-white outline-none"
            aria-label={t("jobs.pagination.rowsPerPage")}
          >
            {rowsPerPageOptions.map((n) => (
              <option key={n} value={n} className="text-zinc-900">
                {n}
              </option>
            ))}
          </select>
        </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={isRTL ? goNext : goPrev}
              disabled={isRTL ? !canNext : !canPrev}
              className={[
                "grid h-8 w-8 place-items-center rounded-md",
                "bg-blueSite text-white transition hover:bg-blueSite",
                (isRTL ? !canNext : !canPrev) ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
              aria-label={t("jobs.pagination.previousPage")}
            >
              {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={isRTL ? goPrev : goNext}
              disabled={isRTL ? !canPrev : !canNext}
              className={[
                "grid h-8 w-8 place-items-center rounded-md",
                "bg-blueSite text-white transition hover:bg-blueSite",
                (isRTL ? !canPrev : !canNext) ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
              aria-label={t("jobs.pagination.nextPage")}
            >
              {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        {/* Arrows */}

      </div>
    </div>
  );
}
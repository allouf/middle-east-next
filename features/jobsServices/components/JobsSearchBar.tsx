"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Search, X } from "lucide-react";

type TabKey = "jobs" | "companies";

export default function JobsSearchBar({
  keyword,
  setKeyword,
  onFind,
  onClear,
  activeTab,
  onTabChange,
}: {
  keyword: string;
  setKeyword: (v: string) => void;
  onFind: () => void;
  onClear: () => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}) {
  const { t, locale } = useTranslation();
  const isRtl = locale === "ar";
  const isJobs = activeTab === "jobs";

  return (
    <div className="mx-auto mt-2 md:mt-0 w-full max-w-7xl overflow-hidden rounded-md border border-zinc-200 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row">
        {/* Left: Search input */}
        <div className="flex flex-1 items-center gap-3 px-4 py-3">
          <Search className="h-8 w-8 text-blueSite" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onFind();
              }
            }}
            placeholder={
              t("jobs.searchPlaceholder") ||
              "Search by: Job tittle, Position, Keyword..."
            }
            className="h-10 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          {keyword && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full p-1 text-blueSite hover:text-blueSiteHover hover:bg-zinc-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 md:h-6 md:w-6" />
            </button>
          )}
        </div>

        {/* Middle: Tabs */}
        <div className="relative flex h-16 w-full rounded-md items-stretch  bg-[#00664F1A] sm:h-auto sm:w-[260px]">
          {/* Moving indicator (top & bottom) */}
          <div
            className={[
              "pointer-events-none absolute inset-y-0 w-1/2",
              "transition-transform duration-300 ease-out",
              isJobs
                ? "translate-x-0"
                : isRtl
                  ? "-translate-x-full"
                  : "translate-x-full",
            ].join(" ")}
          >
            <div className="absolute top-0 left-6 right-6 h-1 rounded-full bg-blueSite" />
            <div className="absolute bottom-0 left-6 right-6 h-1 rounded-full bg-blueSite" />
          </div>

          <TabButton active={isJobs} onClick={() => onTabChange("jobs")}>
            {t("jobs.tabs.jobs") || "Jobs"}
          </TabButton>

          <TabButton
            active={!isJobs}
            onClick={() => onTabChange("companies")}
          >
            {t("jobs.tabs.companies") || "Companies"}
          </TabButton>
        </div>

        {/* Right: Action button */}
        <div className="flex items-center justify-end px-1 py-2 sm:px-3 min-h-16">
          <button
            type="button"
            onClick={onFind}
            className="h-full w-full rounded-md bg-blueSite px-0 md:px-5  py-4 text-sm font-semibold text-white hover:bg-blueSiteHover sm:w-auto"
          >
            {isJobs
              ? (t("jobs.findJob") || "Find Job")
              : (t("jobs.findCompany") || "Find Company")
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative z-10 flex-1 px-6 text-lg font-semibold",
        "flex items-center justify-center",
        "transition-colors duration-200",
        active ? "text-blueSiteHover" : "text-zinc-500 hover:text-zinc-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
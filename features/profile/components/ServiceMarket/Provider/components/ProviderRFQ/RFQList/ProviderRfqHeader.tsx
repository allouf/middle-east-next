"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProviderRfqHeader() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const createUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    return `/dashboard?${params.toString()}`;
  };

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-[#0B6B57]" />
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
            {t("serviceMarket.providerRfq.title", "Discover New Leads Suits")}
          </h1>
        </div>
        <h2 className="mt-1 text-lg font-semibold text-gray-800 md:text-xl">
          {t("serviceMarket.providerRfq.subtitle", "Your Interest & Skills.")}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {t(
            "serviceMarket.providerRfq.description",
            "Access high-quality opportunities tailored to your business profile and expertise."
          )}
        </p>
      </div>

      <Link
        href={createUrl({ view: "my_proposals" })}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0B6B57] px-5 text-sm font-semibold text-white transition hover:bg-[#095544]"
      >
        <Clock className="h-4 w-4" />
        {t("serviceMarket.providerRfq.questsHistory", "Quests History")}
      </Link>
    </div>
  );
}

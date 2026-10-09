"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

interface ProposalsListEmptyProps {
  onResetFilters?: () => void;
}

export default function ProposalsListEmpty({ onResetFilters }: ProposalsListEmptyProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-6 h-48 w-48">
        <Image
          src="/empty.svg"
          alt={t("serviceMarket.providerRfq.myProposals.noProposals", "No proposals found")}
          fill
          className="object-contain"
          priority
        />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        {t("serviceMarket.providerRfq.myProposals.noProposalsTitle", "No Proposals Found")}
      </h3>
      <p className="mb-6 max-w-md text-center text-sm text-gray-500">
        {t(
          "serviceMarket.providerRfq.myProposals.noProposalsDescription",
          "There are no proposals matching your criteria. Try adjusting your filters or check back later for new opportunities."
        )}
      </p>
      {onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#0B6B57] px-6 text-sm font-semibold text-white transition hover:bg-[#095544]"
        >
          {t("serviceMarket.providerRfq.myProposals.resetFilters", "Reset Filters")}
        </button>
      )}
    </div>
  );
}

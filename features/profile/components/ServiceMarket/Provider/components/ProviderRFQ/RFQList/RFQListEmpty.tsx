"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

interface RFQListEmptyProps {
  onResetFilters?: () => void;
}

export default function RFQListEmpty({ onResetFilters }: RFQListEmptyProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-6 h-48 w-48">
        <Image
          src="/empty.svg"
          alt={t("serviceMarket.providerRfq.noRequests", "No requests found")}
          fill
          className="object-contain"
          priority
        />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        {t("serviceMarket.providerRfq.noRequestsTitle", "No Requests Found")}
      </h3>
      <p className="mb-6 max-w-md text-center text-sm text-gray-500">
        {t(
          "serviceMarket.providerRfq.noRequestsDescription",
          "There are no requests matching your criteria. Try adjusting your filters or check back later for new opportunities."
        )}
      </p>
      {onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#0B6B57] px-6 text-sm font-semibold text-white transition hover:bg-[#095544]"
        >
          {t("serviceMarket.providerRfq.resetFilters", "Reset Filters")}
        </button>
      )}
    </div>
  );
}

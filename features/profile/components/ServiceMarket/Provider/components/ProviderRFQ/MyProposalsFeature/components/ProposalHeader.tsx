"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function ProposalHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <div className="h-6 w-1 rounded-full bg-[#0B6B57]" />
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          {t("serviceMarket.providerRfq.myProposals.title", "My Proposals")}
        </h1>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {t(
          "serviceMarket.providerRfq.myProposals.description",
          "Manage and Track your active service quotes"
        )}
      </p>
    </div>
  );
}

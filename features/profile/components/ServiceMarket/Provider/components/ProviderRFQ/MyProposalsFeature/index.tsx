"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import ProposalsList from "./ProposalsList";
import ProposalDetails from "./ProposalDetails";
import { useQuoteprovider } from "../../../hooks/ProviderRFQ/useQuoteprovider";

export default function MyProposalsFeature() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();
  const { isRTL } = useLocaleDirection();

  const { fetchQuoteStats, fetchQuoteHistory } = useQuoteprovider();

  const view = searchParams.get("view") || "my_proposals";
  const proposalId = searchParams.get("proposalId");

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
    <div className="min-h-screen mt-4 p-4 md:p-6">
      {/* Back Button */}
      <Link
        href={createUrl(proposalId ? { proposalId: null } : { view: "rfq_list" })}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
      >
        {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
        {t("common.back", "Back")}
      </Link>

      {proposalId ? (
        <ProposalDetails
          proposalId={proposalId}
          onQuoteSuccess={() => {
            fetchQuoteStats();
            fetchQuoteHistory();
            router.push(createUrl({ proposalId: null }));
          }}
        />
      ) : (
        <ProposalsList
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          createUrl={createUrl}
        />
      )}
    </div>
  );
}

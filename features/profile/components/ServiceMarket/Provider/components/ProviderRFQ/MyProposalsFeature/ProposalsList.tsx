"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ProposalsListProps, ProposalStatus } from "./types";
import { useQuoteprovider } from "../../../hooks/ProviderRFQ/useQuoteprovider";
import ProposalHeader from "./components/ProposalHeader";
import ProposalFilter from "./components/ProposalFilter";
import ProposalStats from "./components/ProposalStats";
import ProposalCard from "./components/ProposalCard";
import ProposalsListSkeleton from "./components/ProposalsListSkeleton";
import ProposalsListEmpty from "./components/ProposalsListEmpty";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";

const statusFilterMap: Record<string, ProposalStatus[]> = {
  all: ["In Review", "Awarded", "Rejected", "Under Review", "Pending", "Accepted"],
  in_review: ["In Review", "Under Review", "Pending"],
  awarded: ["Awarded", "Accepted"],
  rejected: ["Rejected"],
};

export default function ProposalsList({
  statusFilter,
  onStatusChange,
  createUrl,
}: ProposalsListProps) {
  const { t } = useTranslation();
  
  const {
    quoteStats,
    quoteStatsLoading,
    quoteHistory,
    quoteHistoryLoading,
    quoteHistoryError,
    fetchQuoteStats,
    fetchQuoteHistory,
  } = useQuoteprovider();

  // Fetch data on component mount
  useEffect(() => {
    fetchQuoteStats();
    fetchQuoteHistory();
  }, [fetchQuoteStats, fetchQuoteHistory]);

  // Transform quote history to match proposal structure
  const proposals = quoteHistory.map((quote) => ({
    id: quote.id,
    reference_number: quote.custom_request?.reference_number || `#RFQ-${quote.id}`,
    custom_request_id: quote.custom_request?.id,
    title: quote.custom_request?.title || "Untitled Request",
    budget: quote.proposed_budget,
    budget_min: quote.custom_request?.budget_min,
    budget_max: quote.custom_request?.budget_max,
    status: quote.status as ProposalStatus,
    submitted_date: new Date(quote.created_at).toLocaleDateString(),
    estimated_delivery_date: quote.estimated_delivery_date,
    delivery_model: quote.custom_request?.delivery_model,
    category: quote.custom_request?.category?.name || "General",
    category_id: quote.custom_request?.category?.id,
    customer: {
      name: "Customer",
      company: "Company",
      avatar: "",
      description: "",
    },
    deadline_date: quote.custom_request?.deadline_date || "N/A",
    location: quote.custom_request?.delivery_model,
  }));

  // Show loading state
  if (quoteStatsLoading || quoteHistoryLoading) {
    return <ProposalsListSkeleton />;
  }

  // Show error state
  if (quoteHistoryError) {
    return (
      <ErrorWithRetry
        onRetry={() => {
          fetchQuoteStats();
          fetchQuoteHistory();
        }}
      />
    );
  }

  const filteredProposals = proposals.filter((proposal) =>
    statusFilterMap[statusFilter || "all"].includes(proposal.status)
  );

  // Show empty state
  if (filteredProposals.length === 0) {
    return (
      <>
        {/* Header */}
        <ProposalHeader />

        {/* Filter */}
        <ProposalFilter value={statusFilter || "all"} onChange={onStatusChange} />

        {/* Stats Cards */}
        <ProposalStats stats={quoteStats} />

        {/* Empty State */}
        <ProposalsListEmpty
          onResetFilters={() => onStatusChange?.("all")}
        />
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <ProposalHeader />

      {/* Filter */}
      <ProposalFilter value={statusFilter || "all"} onChange={onStatusChange} />

      {/* Stats Cards */}
      <ProposalStats stats={quoteStats} />

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            createUrl={createUrl}
          />
        ))}
      </div>
    </>
  );
}
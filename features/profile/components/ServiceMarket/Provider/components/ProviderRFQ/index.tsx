"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProviderRfqFilters } from "../../types/providerRfq.types";
import { useQuoteprovider } from "../../hooks/ProviderRFQ/useQuoteprovider";
import MyProposalsFeature from "./MyProposalsFeature";
import RFQList from "./RFQList";
import ProviderRfqHeader from "./RFQList/ProviderRfqHeader";
import ProposalDetails from "./MyProposalsFeature/ProposalDetails";


export default function ProviderRFQ() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<ProviderRfqFilters>({
    page: 1,
    per_page: 15,
  });

  const {
    loading,
    error,
    requests,
    validationError,
    meta,
    categories,
    fetchDiscoverRequests,
    fetchCategories,
  } = useQuoteprovider();

  const view = searchParams.get("view") || "rfq_list";
  const proposalId = searchParams.get("proposalId");
  const totalRequests = meta?.total || 0;

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Refetch when filters change
  useEffect(() => {
    fetchDiscoverRequests(filters);
  }, [filters, fetchDiscoverRequests]);
  const handleFilterChange = (newFilters: Partial<ProviderRfqFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    const resetFilters = { page: 1, per_page: 15 };
    setFilters(resetFilters);
    fetchDiscoverRequests(resetFilters);
  };

  const handleRetry = () => {
    fetchDiscoverRequests(filters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRowsPerPageChange = (per_page: number) => {
    setFilters((prev) => ({ ...prev, per_page, page: 1 }));
  };

  const handleQuote = (requestId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "proposal_details");
    params.set("proposalId", requestId);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleCloseProposalDetails = () => {
    fetchDiscoverRequests(filters);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    params.delete("proposalId");
    router.push(`/dashboard?${params.toString()}`);
  };

  if (view === "my_proposals") {
    return <MyProposalsFeature />;
  }

  if (view === "proposal_details" && proposalId) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    params.delete("proposalId");
    const backUrl = `/dashboard?${params.toString()}`;
    return <ProposalDetails proposalId={proposalId} backUrl={backUrl} onQuoteSuccess={handleCloseProposalDetails} />;
  }

  return (
    <div className="min-h-screen  p-4 md:p-8">
      {/* Header - only show when not loading */}
      {!loading && <ProviderRfqHeader />}

      <RFQList
        requests={requests}
        filters={filters}
        totalRequests={totalRequests}
        loading={loading}
        error={error}
        validationError={validationError}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onRetry={handleRetry}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onQuote={handleQuote}
        categories={categories}
      />
    </div>
  );
}

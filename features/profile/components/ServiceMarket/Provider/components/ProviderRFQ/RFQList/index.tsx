"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import RFQCard from "./RFQCard";
import RFQFilter from "./RFQFilter";
import RFQListSkeleton from "./RFQListSkeleton";
import RFQListEmpty from "./RFQListEmpty";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import Pagination from "./Pagination";
import { ProviderRfqFilters, ProviderRfqItem } from "../../../types/providerRfq.types";

interface RFQListProps {
  requests: ProviderRfqItem[];
  filters: ProviderRfqFilters;
  totalRequests: number;
  loading?: boolean;
  error?: string | null;
  validationError?: Record<string, string[]> | null;
  onFilterChange: (filters: Partial<ProviderRfqFilters>) => void;
  onResetFilters?: () => void;
  onRetry?: () => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onQuote?: (requestId: string) => void;
  categories?: { id: number; name: string }[];
}

export default function RFQList({
  requests,
  filters,
  totalRequests,
  loading,
  error,
  validationError,
  onFilterChange,
  onResetFilters,
  onRetry,
  onPageChange,
  onRowsPerPageChange,
  onQuote,
  categories,
}: RFQListProps) {
  const { t } = useTranslation();

  // Show skeleton when loading
  if (loading) {
    return <RFQListSkeleton />;
  }

  // Show error state
  if (error) {
    return <ErrorWithRetry onRetry={onRetry} />;
  }

  // Show empty state when no requests
  if (requests.length === 0) {
    return (
      <>
        {/* Request Count */}
        <div className="mb-6">
          <span className="text-2xl font-bold text-[#0B6B57]">{totalRequests}</span>
          <span className="ml-2 text-lg text-[#0B6B57]">
            {t("serviceMarket.providerRfq.request", "Request")}
          </span>
        </div>

        <RFQListEmpty onResetFilters={onResetFilters} />
      </>
    );
  }

  return (
    <>
      {/* Request Count */}
      <div className="mb-6">
        <span className="text-2xl font-bold text-[#0B6B57]">{totalRequests}</span>
        <span className="ml-2 text-lg text-[#0B6B57]">
          {t("serviceMarket.providerRfq.request", "Request")}
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
        {/* RFQ List */}
        <div className="space-y-4">
          {requests.map((request) => (
            <RFQCard key={request.id} request={request} onQuote={onQuote} />
          ))}
          {/* Pagination */}
          {totalRequests > 0 && onPageChange && onRowsPerPageChange && (
            <Pagination
              currentPage={filters.page || 1}
              totalPages={Math.ceil(totalRequests / (filters.per_page || 15))}
              total={totalRequests}
              rowsPerPage={filters.per_page || 15}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
            />
          )}
        </div>

        {/* Filter Sidebar */}
        <RFQFilter
          filters={filters}
          onFilterChange={onFilterChange}
          validationError={validationError}
          categories={categories}
        />
      </div>


    </>
  );
}

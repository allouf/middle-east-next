"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import RequestHeader from "./RequestHeader";
import RequestTable from "./RequestTable";
import CreateCustomRequestForm from "../CreateForm";
import RFQDetailsView from "../RFQDetails";
import QuotationPaymentPage from "../QuotationPayment";
import { useRfqClientApi } from "../../../hooks/useRfqClientApi";
import { RequestStatus } from "../../../types/Rfq";
import OrderDetailsPage from "../OrderDetails";

const statusClasses: Record<RequestStatus, string> = {
  Open: "bg-[#F4ECFF] text-[#8B3DFF]",
  Awarded: "bg-[#E8F8EC] text-[#1FA750]",
  Canceled: "bg-[#EEF2F6] text-[#708198]",
  Expired: "bg-[#FFF0F0] text-[#F04438]",
};

export default function CustomRequestsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<"All" | RequestStatus>("All");

  // URL-based state
  const action = searchParams.get('action');
  const requestId = searchParams.get('id');
  
  // Derived state from URL
  const showCreateForm = action === 'create' || action === 'edit';
  const selectedRequestId = (action === 'view' || action === 'payment') ? requestId : null;
  const isEditMode = action === 'edit';
  const showPayment = action === 'payment';

  const {
    requests,
    loading,
    error,
    deleteRequest,
    refetch,
    fetchRequests,
    showRequest,
    requestDetail,
    meta,
  } = useRfqClientApi();

  // Fetch requests on mount and when pagination/filter changes
  useEffect(() => {
    const params: any = { page, per_page: pageSize };
    if (statusFilter !== "All") {
      params.status = statusFilter;
    }
    fetchRequests(params);
  }, [page, pageSize, statusFilter, fetchRequests]);

  // Fetch request details when in edit mode
  useEffect(() => {
    if (isEditMode && requestId) {
      showRequest(requestId);
    }
  }, [isEditMode, requestId, showRequest]);

  // Fetch request details when showing payment
  useEffect(() => {
    if (showPayment && requestId) {
      showRequest(requestId);
    }
  }, [showPayment, requestId, showRequest]);

  const updateUrl = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    router.push(`?${newParams.toString()}`);
  };

  const handleViewRequest = (requestId: string) => {
    updateUrl({ action: 'view', id: requestId });
  };

  const handleCloseDetails = () => {
    updateUrl({ action: null, id: null });
    refetch();
  };

  const handleEditRequest = (requestId: string) => {
    updateUrl({ action: 'edit', id: requestId });
  };

  const handleEditFromDetails = () => {
    updateUrl({ action: 'edit', id: requestId });
  };

  const handleCreateNewRFQ = () => {
    updateUrl({ action: 'create', id: null });
  };

  const handleCloseCreateForm = () => {
    updateUrl({ action: null, id: null });
    refetch();
  };

  const handleAcceptQuote = () => {
    updateUrl({ action: 'payment', id: requestId });
  };

  const handleClosePayment = () => {
    updateUrl({ action: 'view', id: requestId });
  };

  const handlePaymentComplete = () => {
    updateUrl({ action: null, id: null });
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (value: "All" | RequestStatus) => {
    setStatusFilter(value);
    setPage(1);
    refetch();
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setPageSize(newRowsPerPage);
    setPage(1);
  };

  return (
    <>
      {showCreateForm ? (
        <CreateCustomRequestForm 
          onClose={handleCloseCreateForm} 
          isEditMode={isEditMode}
          requestId={isEditMode ? requestId : undefined}
        />
      ) : showPayment ? (
        <QuotationPaymentPage rfqId={selectedRequestId || ""} onClose={handleClosePayment} onComplete={handlePaymentComplete} />
      ) : selectedRequestId ? (
        <RFQDetailsView
          onClose={handleCloseDetails}
          requestId={selectedRequestId}
          onEdit={handleEditFromDetails}
          onAcceptQuote={handleAcceptQuote}
        />
      ) : (
        <section className="w-full rounded-[28px] bg-white p-5">
          <RequestHeader onCreateNewRFQ={handleCreateNewRFQ} />
          <div className="p-5">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={handleCreateNewRFQ}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blueSite px-5 text-sm font-semibold text-white transition hover:opacity-90 md:h-13 md:px-5 md:text-[15px] xl:h-14 xl:px-6"
              >
                <Plus size={18} />
                {t('serviceMarket.rfq.header.createNew')}
              </button>
            </div>
          <RequestTable
            requests={requests}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            currentPage={page}
            totalPages={meta.last_page}
            total={meta.total}
            rowsPerPage={pageSize}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onViewRequest={handleViewRequest}
            onEditRequest={handleEditRequest}
            loading={loading}
          />
          </div>
        </section>
      )}
    </>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuoteprovider } from "../../../hooks/ProviderRFQ/useQuoteprovider";
import { useProviderRfqApi } from "../../../hooks/ProviderRFQ/useProviderRfqApi";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import Button from "@/components/ui/Button";
import CustomConfirmModal from "@/components/shered/CustomConfirmModal";
import {
  RequestHeader,
  RequestSummary,
  TimeRemaining,
  ProjectBrief,
  QuoteSubmission,
  MyQuoteCard,
} from "./components";
import ProposalDetailsSkeleton from "./ProposalDetailsSkeleton";

interface ProposalDetailsProps {
  proposalId: string;
  onClose?: () => void;
  backUrl?: string;
  onQuoteSuccess: () => void;
}

export default function ProposalDetails({ proposalId, onClose, backUrl, onQuoteSuccess }: ProposalDetailsProps) {
  const { t } = useTranslation();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { cancelQuote, loading } = useProviderRfqApi();

  const {
    requestDetail,
    detailsLoading,
    detailsError,
    fetchDiscoverRequestDetails,
  } = useQuoteprovider();

  // Fetch request details on component mount
  useEffect(() => {
    if (proposalId) {
      fetchDiscoverRequestDetails(proposalId);
    }
  }, [proposalId, fetchDiscoverRequestDetails]);

  const timeRemaining = requestDetail?.time_remaining ?? { days: 0, hours: 0, minutes: 0 };

  const canCancelQuote = (status: string) =>
    status?.toLowerCase() === "pending" || status?.toLowerCase() === "accepted";

  const handleWithdraw = async () => {
    try {
      if (!requestDetail?.my_quote?.id) return;
      await cancelQuote(String(requestDetail.my_quote.id), {
        showMessage: true,
        onSuccess: () => {
          setIsWithdrawModalOpen(false);
          fetchDiscoverRequestDetails(proposalId);
        },
      });
    } catch (error) {
      console.error("Failed to withdraw quote:", error);
    }
  };

  if (detailsLoading) {
    return <ProposalDetailsSkeleton />;
  }

  if (detailsError && !detailsLoading) {
    return (
      <ErrorWithRetry
        onRetry={() => {
          if (proposalId) {
            fetchDiscoverRequestDetails(proposalId);
          }
        }}
      />
    );
  }

  if (!requestDetail) {
    return <ProposalDetailsSkeleton />;
  }

  return (
    <div className="p-4">
      <RequestHeader
        referenceNumber={requestDetail.reference_number}
        status={requestDetail.status}
        createdAt={new Date(requestDetail.created_at).toLocaleDateString()}
        onClose={onClose}
        backUrl={backUrl}
      />

      <div className="grid gap-6 items-start lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Left column: request summary, time remaining, brief */}
        <div className="space-y-4">
          <RequestSummary
            category={requestDetail.category}
            title={requestDetail.title}
            deliveryModel={requestDetail.delivery_model}
            deadline={requestDetail.deadline_date}
            budgetMin={requestDetail.budget_min}
            budgetMax={requestDetail.budget_max}
          />

          <TimeRemaining
            days={timeRemaining.days}
            hours={timeRemaining.hours}
            minutes={timeRemaining.minutes}
          />

          <ProjectBrief
            description={requestDetail.description}
            customerName={t("serviceMarket.providerRfq.customerName", "Customer Name")}
            attachments={requestDetail.attachments || []}
          />


        </div>

        {/* Right column: Submit Quote or My Quote Card */}
        {requestDetail.has_applied && requestDetail.my_quote ? (
          <MyQuoteCard
            myQuote={requestDetail.my_quote}
            onSuccess={() => fetchDiscoverRequestDetails(proposalId)}
          />
        ) : (
          <QuoteSubmission
            requestId={proposalId}
            defaultBudget={(requestDetail.budget_min + requestDetail.budget_max) / 2}
            onSuccess={() => {
              onQuoteSuccess();
            }}
          />
        )}
      </div>
      <div className="py-4" >
        {/* Cancel Quote — only for Pending and Accepted status */}
        {requestDetail.my_quote && canCancelQuote(requestDetail.my_quote.status) && (
          <Button
            type="button"
            unstyled
            onClick={() => setIsWithdrawModalOpen(true)}
            className="inline-flex  items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            {t("serviceMarket.providerRfq.quoteSubmission.cancelQuote", "Cancel Quote")}
          </Button>
        )}</div>
      <CustomConfirmModal
        open={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        type="danger"
        title={t("serviceMarket.providerRfq.quoteSubmission.withdrawConfirm", "Are you sure you want to withdraw this quote?")}
        confirmText={t("serviceMarket.providerRfq.quoteSubmission.withdrawConfirmBtn", "Yes, Withdraw")}
        cancelText={t("serviceMarket.providerRfq.quoteSubmission.cancel", "Cancel")}
        onConfirm={handleWithdraw}
        loading={loading}
        width={400}
      />
    </div>
  );
}

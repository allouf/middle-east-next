"use client";

import React, { useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useRfqClientApi } from "../../../hooks/useRfqClientApi";
import { QuoteItem } from "../../../types/Rfq";
import RFQHeader from "./RFQHeader";
import RequestSummaryCard from "./RequestSummaryCard";
import TimeRemainingCard from "./TimeRemainingCard";
import ProjectBriefCard from "./ProjectBriefCard";
import InsightsCard from "./InsightsCard";
import QuotesSidebar from "./QuotesSidebar";
import { RFQDetailsSkeleton } from "./RFQDetailsSkeleton";
import ErrorReload from "@/components/shared/ErrorReload";
import QuoteApprovalModal from "@/features/profile/components/ServiceMarket/Client/components/MyRFQ/RFQDetails/QuoteApprovalModal";

interface RFQDetailsViewProps {
  onClose?: () => void;
  requestId?: string;
  onEdit?: () => void;
  onAcceptQuote?: () => void;
}

const RFQDetailsView = ({ onClose, requestId, onEdit, onAcceptQuote }: RFQDetailsViewProps) => {
  const { t } = useTranslation();
  const { requestDetail, loading, showRequest, cancelRequest, acceptQuote, processPayment } = useRfqClientApi();
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = React.useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (requestId) {
      showRequest(requestId);
    }
  }, [requestId, showRequest]);

  const quotes: QuoteItem[] = requestDetail?.quotes || [];

  const handleCancelRequest = async () => {
    if (!requestId) return;
    await cancelRequest(requestId, {
      showMessage: true,
      onSuccess: () => {
        onClose?.();
      },
    });
  };

  const handleAcceptQuote = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    setConfirmModalOpen(true);
  };

  const handleConfirmAcceptQuote = async () => {
    if (!selectedQuoteId) return;
    await acceptQuote(selectedQuoteId, {
      showMessage: true,
      onSuccess: () => {
        if (requestId) {
          showRequest(requestId);
          // Call parent callback to handle payment navigation
          onAcceptQuote?.();
        }
      },
    });
    setConfirmModalOpen(false);
    setSelectedQuoteId(null);
  };

  const handleProcessPayment = async (orderId: string) => {
    await processPayment(orderId, {
      showMessage: true,
      onSuccess: () => {
        if (requestId) showRequest(requestId);
      },
    });
  };

  if (!requestDetail && requestId) {
    return <RFQDetailsSkeleton />;
  }

  if (!requestDetail) {
    return <ErrorReload onRetry={() => requestId && showRequest(requestId)} />;
  }

  return (
    <>
      <section className="w-full p-2 md:p-4">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <RFQHeader requestDetail={requestDetail} />
              <RequestSummaryCard requestDetail={requestDetail} />
              <TimeRemainingCard requestDetail={requestDetail} />
              <ProjectBriefCard requestDetail={requestDetail} />
              <InsightsCard requestDetail={requestDetail} />

              {requestDetail?.status !== 'Expired' && requestDetail?.status !== 'Canceled' && requestDetail?.status !== 'Awarded' && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancelRequest}
                    disabled={loading}
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#FEECEC] px-5 text-sm font-semibold text-[#F04438] transition hover:opacity-90 disabled:opacity-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t('serviceMarket.rfq.details.actions.closeRequest')}
                  </button>

                  <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-blueSite px-5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    {t('serviceMarket.rfq.details.actions.editRequest')}
                  </button>
                </div>
              )}
            </div>

            <QuotesSidebar quotes={quotes} onAcceptQuote={handleAcceptQuote} />
          </div>
      </section>

      <QuoteApprovalModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setSelectedQuoteId(null);
        }}
        onConfirm={handleConfirmAcceptQuote}
        providerName={quotes.find(q => q.id === Number(selectedQuoteId))?.provider?.name}
        providerRole={quotes.find(q => q.id === Number(selectedQuoteId))?.provider?.provider_type}
        rating={quotes.find(q => q.id === Number(selectedQuoteId))?.provider?.rating}
        proposedBudget={quotes.find(q => q.id === Number(selectedQuoteId)) ? `${quotes.find(q => q.id === Number(selectedQuoteId))?.proposed_budget} $` : ""}
        providerAvatar={quotes.find(q => q.id === Number(selectedQuoteId))?.provider?.photo || ""}
        title={t('serviceMarket.rfq.details.acceptQuote.title', 'Quotation Approval')}
        subtitle={t('serviceMarket.rfq.details.acceptQuote.subtitle', 'Are you sure you want to accept this quote?')}
        confirmText={t('serviceMarket.rfq.details.acceptQuote.confirm', 'Confirm')}
        backText={t('serviceMarket.rfq.details.acceptQuote.back', 'Back')}
      />

    </>
  );
};

export default RFQDetailsView;
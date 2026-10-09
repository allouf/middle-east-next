"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProviderRfqMyQuote } from "../../../../types/providerRfq.types";
import { useProviderRfqApi } from "../../../../hooks/ProviderRFQ/useProviderRfqApi";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface MyQuoteCardProps {
  myQuote: ProviderRfqMyQuote;
  onSuccess?: () => void;
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  Pending:  { color: "#0B6B57", bg: "#DDF5EA" },
  PENDING:  { color: "#0B6B57", bg: "#DDF5EA" },
  Awarded:  { color: "#065F46", bg: "#D1FAE5" },
  AWARDED:  { color: "#065F46", bg: "#D1FAE5" },
  Rejected: { color: "#B91C1C", bg: "#FEE2E2" },
  REJECTED: { color: "#B91C1C", bg: "#FEE2E2" },
};

const isPending = (status: string) =>
  status?.toLowerCase() === "pending";

export default function MyQuoteCard({ myQuote, onSuccess }: MyQuoteCardProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    proposed_budget: String(myQuote.proposed_budget),
    cover_letter_or_message: myQuote.cover_letter_or_message,
  });

  const { updateQuote, loading } = useProviderRfqApi();

  const config = statusConfig[myQuote.status] ?? { color: "#374151", bg: "#F3F4F6" };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.proposed_budget || Number(formData.proposed_budget) <= 0) {
      newErrors.proposed_budget = t(
        "serviceMarket.providerRfq.quoteSubmission.errors.budgetRequired",
        "Quote amount is required"
      );
    }

    if (!formData.cover_letter_or_message || formData.cover_letter_or_message.length < 10) {
      newErrors.cover_letter_or_message = t(
        "serviceMarket.providerRfq.quoteSubmission.errors.proposalRequired",
        "Proposal must be at least 10 characters"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmited(true);

    if (!validateForm()) return;

    try {
      await updateQuote(
        String(myQuote.id),
        {
          proposed_budget: Number(formData.proposed_budget),
          cover_letter_or_message: formData.cover_letter_or_message,
        },
        {
          showMessage: true,
          onSuccess: () => {
            setIsEditing(false);
            setIsSubmited(false);
            setErrors({});
            onSuccess?.();
          },
        }
      );
    } catch (error) {
      console.error("Failed to update quote:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsSubmited(false);
    setErrors({});
    setFormData({
      proposed_budget: String(myQuote.proposed_budget),
      cover_letter_or_message: myQuote.cover_letter_or_message,
    });
  };

  return (
    <div className="relative rounded-2xl border border-[#E2E8F0] bg-[#f7f4f4] p-5 md:p-6 shadow-[0_6px_18px_rgba(16,24,40,0.04)] space-y-5">
      {/* Status Badge */}
      <span
        className="absolute left-5 top-0 -translate-y-1/2 rounded-full px-3 py-1 text-[10px] font-bold"
        style={{ color: config.color, backgroundColor: config.bg }}
      >
        {myQuote.status}
      </span>

      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          {t("serviceMarket.providerRfq.quoteSubmission.title", "My Quote")}
        </h3>
        <p className="mt-0.5 text-sm text-gray-500">
          {t(
            "serviceMarket.providerRfq.quoteSubmission.description",
            "Craft a competitive proposal to win this project."
          )}
        </p>
      </div>

      {isEditing ? (
        /* ── Edit Form ── */
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="proposed_budget"
            label={t("serviceMarket.providerRfq.quoteSubmission.quoteAmount", "Quote Amount")}
            type="numric"
            min={1}
            value={formData.proposed_budget}
            onChange={(e) => handleInputChange("proposed_budget", (e as any)?.target?.value ?? e)}
            placeholder={t("serviceMarket.providerRfq.quoteSubmission.enterAmount", "Enter amount")}
            required
            isSubmited={isSubmited}
            error={errors.proposed_budget}
            withFieldset
          />

          <InputField
            id="cover_letter_or_message"
            label={t("serviceMarket.providerRfq.quoteSubmission.proposal", "Proposal")}
            type="textarea"
            value={formData.cover_letter_or_message}
            onChange={(e) =>
              handleInputChange("cover_letter_or_message", (e as any)?.target?.value ?? e)
            }
            placeholder={t(
              "serviceMarket.providerRfq.quoteSubmission.proposalPlaceholder",
              "Describe your approach, timeline, and why you're the best fit..."
            )}
            required
            isSubmited={isSubmited}
            error={errors.cover_letter_or_message}
            withFieldset
          />

          <div className="flex gap-3 pt-1">
            <Button
              type="submit"
              disabled={loading}
              unstyled
              className="flex-1 rounded-lg bg-blueSite px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blueSiteHover disabled:opacity-60"
            >
              {loading
                ? t("serviceMarket.providerRfq.quoteSubmission.saving", "Saving...")
                : t("serviceMarket.providerRfq.quoteSubmission.saveChanges", "Save Changes")}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              unstyled
              disabled={loading}
              className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
            >
              {t("serviceMarket.providerRfq.quoteSubmission.cancel", "Cancel")}
            </Button>
          </div>
        </form>
      ) : (
        /* ── View Mode ── */
        <>
          {/* Quote Amount */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              {t("serviceMarket.providerRfq.quoteSubmission.quoteAmount", "Quote Amount")}
            </label>
            <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
              <div className="flex items-center gap-2 font-medium text-gray-800">
                <span className="font-semibold text-[#0B6B57]">$</span>
                <span>{Number(myQuote.proposed_budget).toFixed(2)}</span>
              </div>
              <span className="text-sm font-medium text-gray-400">USD</span>
            </div>
          </div>

          {/* Proposal */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              {t("serviceMarket.providerRfq.quoteSubmission.proposal", "Proposal")}
            </label>
            <div className="min-h-[120px] rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm leading-relaxed text-gray-700">
              {myQuote.cover_letter_or_message}
            </div>
          </div>

          {/* Edit — only for Pending */}
          {isPending(myQuote.status) && (
            <Button
              type="button"
              unstyled
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B6B57] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#095544]"
            >
              {t("serviceMarket.providerRfq.quoteSubmission.editProposal", "Edit Proposal")}
            </Button>
          )}

        </>
      )}
    </div>
  );
}

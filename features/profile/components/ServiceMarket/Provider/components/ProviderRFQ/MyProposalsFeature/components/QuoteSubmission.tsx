"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProviderRfqApi } from "../../../../hooks/ProviderRFQ/useProviderRfqApi";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface QuoteSubmissionProps {
  requestId: string | number;
  defaultBudget?: number;
  onSuccess: () => void;
}

export default function QuoteSubmission({
  requestId,
  defaultBudget = 0,
  onSuccess
}: QuoteSubmissionProps) {
  const { t } = useTranslation();
  const [isSubmited, setIsSubmited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    proposed_budget: "",
    estimated_delivery_date: "",
    cover_letter_or_message: "",
  });

  const { submitQuote, loading } = useProviderRfqApi();

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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
      newErrors.proposed_budget = t("serviceMarket.providerRfq.quoteSubmission.errors.budgetRequired", "Quote amount is required");
    }

    if (!formData.estimated_delivery_date) {
      newErrors.estimated_delivery_date = t("serviceMarket.providerRfq.quoteSubmission.errors.dateRequired", "Delivery date is required");
    }

    if (!formData.cover_letter_or_message || formData.cover_letter_or_message.length < 10) {
      newErrors.cover_letter_or_message = t("serviceMarket.providerRfq.quoteSubmission.errors.proposalRequired", "Proposal must be at least 10 characters");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmited(true);

    if (!validateForm()) {
      return;
    }

    try {
      await submitQuote(String(requestId), {
        proposed_budget: Number(formData.proposed_budget),
        estimated_delivery_date: formData.estimated_delivery_date,
        cover_letter_or_message: formData.cover_letter_or_message,
      }, {
        showMessage: true,
        onSuccess: () => {
          // Reset form
          setFormData({
            proposed_budget: "",
            estimated_delivery_date: "",
            cover_letter_or_message: "",
          });
          setErrors({});
          setIsSubmited(false);
          onSuccess();
        },
      });
    } catch (error) {
      console.error("Failed to submit quote:", error);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F4F4F4] p-5 md:p-6">
      <h3 className="text-base font-semibold text-gray-900">{t("serviceMarket.providerRfq.quoteSubmission.title", "Submit Quote")}</h3>
      <p className="mt-1 text-xs text-gray-500">
        {t("serviceMarket.providerRfq.quoteSubmission.description", "Craft a competitive proposal to win this project.")}
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
          id="estimated_delivery_date"
          label={t("serviceMarket.providerRfq.quoteSubmission.estimatedDeliveryDate", "Estimated Delivery Date")}
          type="date"
          value={formData.estimated_delivery_date}
          onChange={(e) => handleInputChange("estimated_delivery_date", (e as any)?.target?.value ?? e)}
          min={new Date().toISOString().split('T')[0] as any}
          required
          isSubmited={isSubmited}
          error={errors.estimated_delivery_date}
          withFieldset
        />

        <InputField
          id="cover_letter_or_message"
          label={t("serviceMarket.providerRfq.quoteSubmission.proposal", "Proposal")}
          type="textarea"
          value={formData.cover_letter_or_message}
          onChange={(e) => handleInputChange("cover_letter_or_message", (e as any)?.target?.value ?? e)}
          placeholder={t("serviceMarket.providerRfq.quoteSubmission.proposalPlaceholder", "Describe your approach, relevant experience, and why you are the best fit for this project...")}
          rows={4}
          required
          conditions={{ textarea: { min: 10 } }}
          isSubmited={isSubmited}
          error={errors.cover_letter_or_message}
          withFieldset
        />

        <Button
          type="submit"
          unstyled
          disabled={loading}
          className="mt-2 h-10 w-full rounded-lg bg-[#0B6B57] text-sm font-semibold text-white hover:bg-[#095544] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("serviceMarket.providerRfq.quoteSubmission.submitting", "Submitting...") : t("serviceMarket.providerRfq.quoteSubmission.submitProposal", "Submit Proposal")}
        </Button>
      </form>
    </div>
  );
}

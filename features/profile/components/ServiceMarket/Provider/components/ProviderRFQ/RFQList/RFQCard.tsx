"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, DollarSign, MapPin, Briefcase } from "lucide-react";
import { ProviderRfqItem } from "../../../types/providerRfq.types";

interface RFQCardProps {
  request: ProviderRfqItem;
  onQuote?: (requestId: string) => void;
}

export default function RFQCard({ request, onQuote }: RFQCardProps) {
  const { t } = useTranslation();
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const handleQuoteClick = () => {
    if (onQuote) {
      onQuote(String(request.id));
    } else {
      setShowQuoteModal(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatBudget = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) {
      return "N/A";
    }
    return `${amount.toFixed(2)}$`;
  };

  const getStatusBadge = () => {
    if (request.has_applied) {
      return (
        <span className="inline-flex items-center rounded-lg border bg-[#E5F0E9] px-4 py-1.5 text-sm font-medium text-[#0B6B57]">
          {t("serviceMarket.providerRfq.status.applied", "Applied")}
        </span>
      );
    }
    return null;
  };

  const getDeliveryModelLabel = (model: string) => {
    const models: Record<string, string> = {
      remote: t("serviceMarket.providerRfq.deliveryModel.remote", "Remote"),
      onsite: t("serviceMarket.providerRfq.deliveryModel.onsite", "OnSite"),
      hybrid: t("serviceMarket.providerRfq.deliveryModel.hybrid", "HYBRID"),
    };
    return models[model?.toLowerCase()] || model;
  };

  return (
    <>
      <div className="rounded-xl bg-[#FCFCFC] p-5 shadow-sm transition hover:shadow-md border border-[#d4d4d4]">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">
              {request.customer?.name || t("serviceMarket.providerRfq.customerName", "Customer Name")}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{request.title}</h3>
              {/* Category Badge */}
              <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-medium text-[#15803D]">
                {request.category?.name || "Category"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            {!request.has_applied && (
              <button
                type="button"
                onClick={handleQuoteClick}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0B6B57] px-6 text-sm font-semibold text-white transition hover:bg-[#095544]"
              >
                {t("serviceMarket.providerRfq.quote", "Quote")}
              </button>
            )}
          </div>
        </div>



        {/* Details Row */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <span>{t("serviceMarket.providerRfq.deliveryModel.label", "Delivery Model")}:</span>
            <span className="font-semibold text-gray-900">
              {getDeliveryModelLabel(request.delivery_model)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{t("serviceMarket.providerRfq.deadline", "Deadline")}:</span>
            <span className="font-semibold text-gray-900">{formatDate(request.deadline_date)}</span>
            <span className="text-gray-400">.</span>
          </div>

          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>{t("serviceMarket.providerRfq.budget", "Budget")}</span>
            <span className="font-semibold text-gray-900">{formatBudget(request.budget_min)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900">
              {request.delivery_model?.toLowerCase() === "remote"
                ? t("serviceMarket.providerRfq.remote", "Remote")
                : t("serviceMarket.providerRfq.onsite", "OnSite")}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
          {request.description}
        </p>
      </div>

      {/* Quote Modal */}
    </>
  );
}

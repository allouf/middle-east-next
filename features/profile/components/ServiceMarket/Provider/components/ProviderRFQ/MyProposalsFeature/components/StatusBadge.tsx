"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { ProposalStatus } from "../types";

interface StatusBadgeProps {
  status: ProposalStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();

  switch (status) {
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-[#FEF3C7] bg-[#FFFBEB] px-3 py-1 text-sm font-medium text-[#D97706]">
          {t(`serviceMarket.providerRfq.status.${status.toLowerCase()}`, status)}
          <Clock className="h-4 w-4" />
        </span>
      );
    case "Accepted":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-[#DCFCE7] bg-[#F0FDF4] px-3 py-1 text-sm font-medium text-[#16A34A]">
          {t(`serviceMarket.providerRfq.status.${status.toLowerCase()}`, status)}
          <CheckCircle className="h-4 w-4" />
        </span>
      );
    case "Canceled":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-[#C9CDD1] bg-[#EEF0F2] px-3 py-1 text-sm font-medium text-[#64748B]">
          {t(`serviceMarket.providerRfq.status.${status.toLowerCase()}`, status)}
          <XCircle className="h-4 w-4" />
        </span>
      );
    case "Rejected":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-[#FEE2E2] bg-[#FEF2F2] px-3 py-1 text-sm font-medium text-[#DC2626]">
          {t(`serviceMarket.providerRfq.status.${status.toLowerCase()}`, status)}
          <XCircle className="h-4 w-4" />
        </span>
      );
    default:
      return <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-500">{status}</span>;
  }
}

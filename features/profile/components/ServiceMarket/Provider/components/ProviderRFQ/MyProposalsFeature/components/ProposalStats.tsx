"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FileText, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import { QuoteStats } from "../../../../types/providerRfq.types";

interface ProposalStatsProps {
  stats: QuoteStats | null;
}

export default function ProposalStats({ stats }: ProposalStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Pending */}
      <div className="flex items-center gap-4 rounded-3xl border border-[#FEF3C7] bg-[#FFFBEB] p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF3C7]">
          <Clock className="h-6 w-6 text-[#D97706]" />
        </div>
        <div>
          <p className="text-sm text-[#D97706]">{t("serviceMarket.providerRfq.myProposals.stats.pending", "Pending")}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#D97706]">
              {stats?.under_review || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Accepted */}
      <div className="flex items-center gap-4 rounded-3xl border border-[#DCFCE7] bg-[#F0FDF4] p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DCFCE7]">
          <CheckCircle className="h-6 w-6 text-[#16A34A]" />
        </div>
        <div>
          <p className="text-sm text-[#16A34A]">{t("serviceMarket.providerRfq.myProposals.stats.accepted", "Accepted")}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#16A34A]">
              {stats?.awarded || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Canceled */}
      <div className="flex items-center gap-4 rounded-3xl border border-[#C9CDD1] bg-[#EEF0F2] p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9CDD1]">
          <XCircle className="h-6 w-6 text-[#64748B]" />
        </div>
        <div>
          <p className="text-sm text-[#64748B]">{t("serviceMarket.providerRfq.myProposals.stats.canceled", "Canceled")}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#64748B]">
              0
            </span>
          </div>
        </div>
      </div>

      {/* Rejected */}
      <div className="flex items-center gap-4 rounded-3xl border border-[#FEE2E2] bg-[#FEF2F2] p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2]">
          <XCircle className="h-6 w-6 text-[#DC2626]" />
        </div>
        <div>
          <p className="text-sm text-[#DC2626]">{t("serviceMarket.providerRfq.myProposals.stats.rejected", "Rejected")}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#DC2626]">
              {stats?.rejected || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

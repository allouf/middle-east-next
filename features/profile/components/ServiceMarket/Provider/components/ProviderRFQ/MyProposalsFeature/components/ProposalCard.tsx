"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
} from "lucide-react";
import { ProposalItem } from "../types";
import StatusBadge from "./StatusBadge";

interface ProposalCardProps {
  proposal: ProposalItem;
  createUrl: (params: { proposalId: string }) => string;
}

export default function ProposalCard({ proposal, createUrl }: ProposalCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-gray-200 bg-white  transition hover:shadow-sm">
      {/* Header Row */}
      <div className="mb-3 flex items-start justify-between m-5">
        <div className="flex items-center gap-3">
          <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            {proposal.reference_number}
          </span>
          <span className="text-sm text-gray-500">
            {t("serviceMarket.providerRfq.myProposals.submitted", "Submitted")} {proposal.submitted_date}
          </span>
        </div>
        <StatusBadge status={proposal.status} />
      </div>

      {/* Title and Category */}
      <div className="mb-4 flex items-center gap-3 border-b-2 pb-2 border-[#E2E8F0] m-5">
        <h3 className="text-lg font-bold text-gray-900">{proposal.title}</h3>
        <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-medium text-[#0B6B57]">
          {proposal.category}
        </span>
      </div>

      {/* Customer Info */}
      <div className="mb-4 flex items-center gap-3  m-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
          {proposal.customer.avatar ? (
            <img
              src={proposal.customer.avatar}
              alt={proposal.customer.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-gray-600">
              {proposal.customer.name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{proposal.customer.name}</p>
          <p className="text-sm text-gray-500">{proposal.customer.description}</p>
        </div>
      </div>

      {/* Details Row */}
      <div className="flex flex-wrap items-center bg-[#F4F4F4] justify-between gap-4 rounded-b-3xl border border-[#E2E8F0] p-5">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <span>{t("serviceMarket.providerRfq.deliveryModel.label", "Delivery Model")}:</span>
            <span className="font-semibold text-gray-900">
              {proposal.delivery_model}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{t("serviceMarket.providerRfq.deadline", "Deadline")}:</span>
            <span className="font-semibold text-gray-900">
              {proposal.deadline_date}
            </span>
            <span className="text-gray-400">.</span>
          </div>

          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>{t("serviceMarket.providerRfq.budget", "Budget")}</span>
            <span className="font-semibold text-gray-900">
              {proposal.budget.toFixed(2)}$
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900">
              {proposal.location}
            </span>
          </div>
        </div>

        <Link
          href={createUrl({ proposalId: String(proposal.custom_request_id) })}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blueSite px-5 text-sm font-semibold text-white transition hover:bg-[#095544]"
        >
          {t("serviceMarket.providerRfq.myProposals.viewDetails", "View Details")}
        </Link>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Select } from "antd";

interface ProposalFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProposalFilter({ value, onChange }: ProposalFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex justify-end">
      <Select
        className="w-40"
        value={value}
        onChange={onChange}
        options={[
          { value: "all", label: t("serviceMarket.providerRfq.myProposals.filter.allStatus", "All Status") },
          { value: "in_review", label: t("serviceMarket.providerRfq.myProposals.filter.inReview", "In Review") },
          { value: "awarded", label: t("serviceMarket.providerRfq.myProposals.filter.awarded", "Awarded") },
          { value: "rejected", label: t("serviceMarket.providerRfq.myProposals.filter.rejected", "Rejected") },
        ]}
      />
    </div>
  );
}

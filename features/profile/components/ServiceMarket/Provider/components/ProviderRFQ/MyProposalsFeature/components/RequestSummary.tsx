"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Briefcase, Calendar, DollarSign } from "lucide-react";

interface RequestSummaryProps {
  category: { id: number; name: string };
  title: string;
  deliveryModel: string;
  deadline: string;
  budgetMin: number;
  budgetMax: number;
}

export default function RequestSummary({ 
  category, 
  title, 
  deliveryModel, 
  deadline, 
  budgetMin, 
  budgetMax 
}: RequestSummaryProps) {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden rounded-2xl bg-grayLight shadow-sm">
      <div className="p-5">
        <div className="mb-3 inline-flex rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#0B6B57]">
          {category.name}
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          {title}
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#E2E8F0] bg-[#F4F4F4] px-5 py-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Briefcase className="h-4 w-4 text-gray-400" />
          <span>{t("serviceMarket.providerRfq.deliveryModel.label", "Delivery Model")}:</span>
          <span className="font-semibold text-gray-900">{deliveryModel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{t("serviceMarket.providerRfq.deadline", "Deadline")}:</span>
          <span className="font-semibold text-gray-900">{deadline}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span>{t("serviceMarket.providerRfq.budget", "Budget")}:</span>
          <span className="font-semibold text-gray-900">
            ${budgetMin.toFixed(2)} - ${budgetMax.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

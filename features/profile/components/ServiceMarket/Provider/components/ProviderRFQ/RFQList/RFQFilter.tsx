"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Select, Slider } from "antd";
import { ProviderRfqFilters } from "../../../types/providerRfq.types";


interface RFQFilterProps {
  filters: ProviderRfqFilters;
  onFilterChange: (filters: Partial<ProviderRfqFilters>) => void;
  validationError?: Record<string, string[]> | null;
  categories?: { id: number; name: string }[];
}

export default function RFQFilter({ filters, onFilterChange, validationError, categories = [] }: RFQFilterProps) {
  const { t } = useTranslation();
  const [budgetRange, setBudgetRange] = useState<[number, number]>([
    filters.budget_min || 40,
    filters.budget_max || 2000,
  ]);

  const deadlineOptions = [
    { value: "", label: t("serviceMarket.providerRfq.filter.allDeadlines", "All Deadlines") },
    { value: "7", label: t("serviceMarket.providerRfq.filter.next7Days", "Next 7 Days") },
    { value: "14", label: t("serviceMarket.providerRfq.filter.next14Days", "Next 14 Days") },
    { value: "30", label: t("serviceMarket.providerRfq.filter.next30Days", "Next 30 Days") },
    { value: "60", label: t("serviceMarket.providerRfq.filter.next60Days", "Next 60 Days") },
  ];

  const handleCategoryChange = (value: number | undefined) => {
    onFilterChange({ category_id: value });
  };

  const handleDeadlineChange = (value: string) => {
    onFilterChange({ deadline: value || undefined });
  };

  const handleBudgetChange = (value: number[]) => {
    setBudgetRange([value[0], value[1]]);
  };

  const handleBudgetAfterChange = (value: number[]) => {
    if (value[0] > value[1]) {
      return; // Prevent invalid budget range
    }
    onFilterChange({ budget_min: value[0], budget_max: value[1] });
  };

  return (
    <div className="rounded-xl bg-[#FAFAFA] p-5 shadow-sm h-fit border border-[#E2E8F0]">
      <h3 className="mb-5 text-lg font-semibold text-gray-900 border-b ">
        {t("serviceMarket.providerRfq.filter.title", "Filter")}
      </h3>

      {/* Category Filter */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
          {t("serviceMarket.providerRfq.filter.category", "CATEGORY")}
        </label>
        <Select
          className="w-full"
          placeholder={t("serviceMarket.providerRfq.filter.selectCategory", "Select Category")}
          allowClear
          value={filters.category_id}
          onChange={handleCategoryChange}
          options={[
            { value: undefined, label: t("serviceMarket.providerRfq.filter.allCategories", "All Categories") },
            ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
          ]}
        />
      </div>

      {/* Deadline Filter */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
          {t("serviceMarket.providerRfq.filter.deadline", "DEADLINE")}
        </label>
        <Select
          className="w-full"
          value={filters.deadline || ""}
          onChange={handleDeadlineChange}
          options={deadlineOptions}
        />
      </div>

      {/* Budget Range Filter */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
          {t("serviceMarket.providerRfq.filter.budgetRange", "BUDGET RANGE")}
        </label>
        <div className="mb-2 w-[120px] flex items-center justify-between text-sm">
          <span className="font-semibold text-[#0B6B57]">{budgetRange[0].toFixed(2)}$</span>
          <span className="text-gray-400">-</span>
          <span className="font-semibold text-[#0B6B57]">{budgetRange[1].toFixed(2)}$</span>
        </div>
        <Slider
          range
          min={0}
          max={10000}
          step={10}
          // @ts-ignore - allowCross is supported by rc-slider but not typed in antd
          allowCross={false}
          value={budgetRange}
          onChange={handleBudgetChange}
          onChangeComplete={handleBudgetAfterChange}
          styles={{
            track: { backgroundColor: "#0B6B57" },
            handle: { borderColor: "#0B6B57" },
          }}
        />
        {validationError?.budget_max && (
          <p className="mt-2 text-sm text-red-500">
            {t("serviceMarket.providerRfq.filter.budgetValidationError", validationError.budget_max[0])}
          </p>
        )}
      </div>
    </div>
  );
}

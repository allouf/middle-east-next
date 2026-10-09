"use client";

import React from "react";
import { Select, DatePicker, Input } from "antd";
import {
  Search,
  Plus,
  ShoppingBag,
  Pause,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { FilterState } from "./types";
import Button from "@/components/ui/Button";

interface UsedMarketFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onApplyFilters: () => void;
  onAddAd: () => void;
}

const UsedMarketFilters: React.FC<UsedMarketFiltersProps> = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onAddAd,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Top Row - Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 p-4">
        {/* Filter by Case */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t("usedMarket.filters.filterByCase")}
          </label>
          <Select
            value={filters.case}
            onChange={(value) => onFilterChange({ case: value })}
            className="w-full"
            placeholder={t("usedMarket.filters.allCategories")}
            allowClear
            options={[
              {
                value: "negotiable",
                label: t("usedMarket.filters.negotiable"),
              },
              { value: "free", label: t("usedMarket.filters.free") },
            ]}
          />
        </div>

        {/* Filter by Condition */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t("usedMarket.filters.filterByCondition")}
          </label>
          <Select
            value={filters.condition}
            onChange={(value) => onFilterChange({ condition: value })}
            className="w-full"
            placeholder={t("usedMarket.filters.allCategories")}
            allowClear
            options={[
              { value: "new", label: t("usedMarket.filters.new") },
              { value: "used", label: t("usedMarket.filters.used") },
            ]}
          />
        </div>

        {/* Filter by Date */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t("usedMarket.filters.filterByDate")}
          </label>
          <DatePicker
            className="w-full"
            onChange={(date) => {
              if (date) {
                onFilterChange({
                  date: date.format("YYYY-MM-DD"),
                });
              } else {
                onFilterChange({ date: null });
              }
            }}
          />
        </div>

        {/* Sort by */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t("usedMarket.filters.sortBy")}
          </label>
          <Select
            value={filters.sortBy}
            onChange={(value) => onFilterChange({ sortBy: value })}
            className="w-full"
            options={[
              {
                value: "most_viewed",
                label: t("usedMarket.filters.mostViewed"),
              },
              { value: "latest", label: t("usedMarket.filters.latest") },
              {
                value: "price_high",
                label: t("usedMarket.filters.priceHighToLow"),
              },
              {
                value: "price_low",
                label: t("usedMarket.filters.priceLowToHigh"),
              },
            ]}
          />
        </div>
      </div>

      {/* Bottom Row - Search and Actions */}
      <div className="flex flex-col md:flex-row gap-3 bg-[#FCFCFC] rounded-t-xl border border-[#00664F33] border-b-0 p-6">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder={t("usedMarket.filters.searchPlaceholder")}
            prefix={null}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="h-8 rounded-full max-w-[300px]"
            onPressEnter={onApplyFilters}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="bg-[#EFFFF8] text-[#00664F] px-4 h-8 flex items-center justify-center rounded-md font-medium text-sm min-w-[100px]">
            {t("usedMarket.filters.filterBy")} :
          </div>
          <Select
            value={filters.state}
            onChange={(value) => onFilterChange({ state: value })}
            placeholder={t("usedMarket.filters.allStatuses")}
            allowClear
            className="w-[150px] [&_.ant-select-selector]:!h-8 [&_.ant-select-selection-item]:!line-height-[30px]"
            popupRender={(menu) => <div className="p-1">{menu}</div>}
            options={[
              {
                value: "active",
                label: (
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t("usedMarket.stats.activeAds")}</span>
                  </div>
                ),
              },
              {
                value: "paused",
                label: (
                  <div className="flex items-center gap-2">
                    <Pause className="w-4 h-4" />
                    <span>{t("usedMarket.stats.pausedAds")}</span>
                  </div>
                ),
              },
              {
                value: "sold",
                label: (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t("usedMarket.stats.soldAds")}</span>
                  </div>
                ),
              },
              {
                value: "expired",
                label: (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{t("usedMarket.stats.expiredAds")}</span>
                  </div>
                ),
              },

              // ✅ NEW: Rejected
              {
                value: "rejected",
                label: (
                  <div className="flex items-center gap-2 text-red-600">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{t("usedMarket.stats.rejectedAds")}</span>
                  </div>
                ),
              },
            ]}
          />

        </div>
        <Button
          onClick={onAddAd}
          className="bg-blueIcons hover:bg-blueIcons/90 text-white px-6 h-8 rounded-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("usedMarket.filters.addAd")}
        </Button>
      </div>
    </div>
  );
};

export default UsedMarketFilters;

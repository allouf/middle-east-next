import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { RequestStatus } from "../../../types/Rfq";

type FilterValue = "All" | RequestStatus;

interface RequestFiltersProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function RequestFilters({ value, onChange }: RequestFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value as FilterValue);
        }}
        className="h-10 appearance-none rounded-xl border border-white/30 bg-white/95 px-4 pr-10 text-sm text-[#667085] outline-none"
      >
        <option value="All">{t('serviceMarket.rfq.table.statusFilter')}</option>
        <option value="Open">{t('serviceMarket.rfq.status.open')}</option>
        <option value="Awarded">{t('serviceMarket.rfq.status.awarded')}</option>
        <option value="Canceled">{t('serviceMarket.rfq.status.canceled')}</option>
        <option value="Expired">{t('serviceMarket.rfq.status.expired')}</option>
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
      />
    </div>
  );
}

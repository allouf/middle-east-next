import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { LayoutGrid, Table2 } from "lucide-react";
import SelectField from "@/components/ui/SelectFiled";
import Button from "@/components/ui/Button";

interface FilterControlsProps {
  service: string;
  onServiceChange: (value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
  view: string;
  onViewChange: (value: string) => void;
}

function FilterControls({
  service,
  onServiceChange,
  date,
  onDateChange,
  view,
  onViewChange,
}: FilterControlsProps) {
  const { t } = useTranslation();

  const serviceOptions = [
    { id: "all", name: t('serviceMarket.projects.filters.serviceAll') },
    { id: "branding", name: t('serviceMarket.projects.filters.branding') },
    { id: "design", name: t('serviceMarket.projects.filters.design') },
    { id: "development", name: t('serviceMarket.projects.filters.development') },
  ];

  const dateOptions = [
    { id: "last30", name: t('serviceMarket.projects.filters.dateLast30') },
    { id: "last7", name: t('serviceMarket.projects.filters.dateLast7') },
    { id: "last90", name: t('serviceMarket.projects.filters.dateLast90') },
  ];
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <SelectField
          id="service"
          label=""
          value={service}
          onChange={(e) => {
            if (e && typeof e === 'object' && 'target' in e && e.target) {
              const target = e.target as HTMLInputElement;
              onServiceChange(target.value);
            } else if (typeof e === 'string') {
              onServiceChange(e);
            } else if (e && typeof e === 'object' && 'value' in e) {
              onServiceChange(String(e.value));
            }
          }}
          selectorOptions={serviceOptions}
          hideLable
          unstyled
          className="min-w-[140px]"
        />

        <SelectField
          id="date"
          label=""
          value={date}
          onChange={(e) => {
            if (e && typeof e === 'object' && 'target' in e && e.target) {
              const target = e.target as HTMLInputElement;
              onDateChange(target.value);
            } else if (typeof e === 'string') {
              onDateChange(e);
            } else if (e && typeof e === 'object' && 'value' in e) {
              onDateChange(String(e.value));
            }
          }}
          selectorOptions={dateOptions}
          hideLable
          unstyled
          className="min-w-[160px]"
        />
      </div>

      <div className="flex rounded-xl bg-[#F3F5F4] p-1">
        <Button
          onClick={() => onViewChange("grid")}
          className={`px-3 py-2 rounded-lg transition-colors ${
            view === "grid"
              ? "bg-white text-blueSite shadow-sm"
              : "text-textGrayColor hover:text-textColor"
          }`}
          unstyled
        >
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span>{t('common.grid')}</span>
          </div>
        </Button>

        <Button
          onClick={() => onViewChange("table")}
          className={`px-3 py-2 rounded-lg transition-colors ${
            view === "table"
              ? "bg-white text-blueSite shadow-sm"
              : "text-textGrayColor hover:text-textColor"
          }`}
          unstyled
        >
          <div className="flex items-center gap-2">
            <Table2 className="h-4 w-4" />
            <span>{t('common.table')}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default FilterControls;

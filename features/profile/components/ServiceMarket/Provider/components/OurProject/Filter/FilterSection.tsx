import React from "react";
import SearchInput from "../SearchInput";
import FilterControls from "./FilterControls";

interface FilterSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  service: string;
  onServiceChange: (value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
  view: string;
  onViewChange: (value: string) => void;
}

function FilterSection({
  search,
  onSearchChange,
  service,
  onServiceChange,
  date,
  onDateChange,
  view,
  onViewChange,
}: FilterSectionProps) {
  return (
    <div className="mb-4  rounded-2xl">
      <div className="mb-4">
        <SearchInput value={search} onChange={onSearchChange} />
      </div>

      <FilterControls
        service={service}
        onServiceChange={onServiceChange}
        date={date}
        onDateChange={onDateChange}
        view={view}
        onViewChange={onViewChange}
      />
    </div>
  );
}

export default FilterSection;

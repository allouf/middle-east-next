"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectorProps {
  sortOptions: SortOption[];
  onSortChange?: () => void; // Optional callback for loading state
}

const SortSelector = ({ sortOptions, onSortChange }: SortSelectorProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort =
    searchParams?.get("sort") ?? "popular";

  const handleChange = (value: string) => {
    onSortChange?.(); // Call loading callback immediately
    const params = new URLSearchParams(searchParams?.toString());
    params.set("sort", value);
    params.set("page", "1"); // reset pagination

    router.push(`?${params.toString()}`, {
      scroll: false,
    });
    router.refresh();
  };

  return (
    <div className="flex w-full items-center gap-2 text-sm text-subTitleColor whitespace-nowrap">
      <span>{t("filters.sort_by")}:</span>

      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="border text-center border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blueSite cursor-pointer flex-1 min-w-0"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelector;

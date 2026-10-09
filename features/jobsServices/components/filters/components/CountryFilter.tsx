"use client";

import React from "react";
import { Search } from "lucide-react";
import { Option } from "@/features/jobsServices/types/jobs.types";
import { TFunction } from "i18next";

export default function CountryFilter({
  placeholder,
  search,
  setSearch,
  items,
  activeValue,
  loading,
  onPick,
  t
}: {
  placeholder: string;
  search: string;
  setSearch: (v: string) => void;
  items: Option[];
  activeValue: string | null;
  loading?: boolean;
  onPick: (v: string) => void;
  t:TFunction
}) {
  // Filter items based on search using only labelKey
  const filteredItems = items.filter(item => 
    item.labelKey?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="relative mb-4 mt-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full py-2 px-4 pr-10 bg-white border border-gray-100 rounded-full text-sm outline-none placeholder:text-gray-400 focus:border-[#00664F]/30"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

      <div className="max-h-[200px] overflow-y-auto">
        {filteredItems.map((country) => {
          const active = activeValue === country.value;
          const isCurrentlyLoading = active && loading;
          
          return (
            <button
              key={country.value}
              type="button"
              onClick={() => onPick(country.value)}
              className={[
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isCurrentlyLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : active ? "bg-emerald-100 text-[#00664F]" : "hover:bg-white text-gray-700",
              ].join(" ")}
              disabled={isCurrentlyLoading}
            >
              <span className="flex items-center justify-between">
                <span className={isCurrentlyLoading ? "animate-pulse" : ""}>{country.labelKey}</span>
                {active ? (
                  <span className="text-xs font-semibold">
                    {isCurrentlyLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-[#00664F] rounded-full animate-spin"></div>
                    ) : "✓"}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            {t("jobs.filter.noCountriesFound", "No countries found")}
          </div>
        )}
      </div>
    </>
  );
}

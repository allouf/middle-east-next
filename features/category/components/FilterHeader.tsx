"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import React, { useState, useEffect } from "react";

import { useTranslation } from "@/lib/i18n/useTranslation";
import useCategoryStore from "@/lib/store/useCategoryStore";
import SortSelector from "@/components/ui/SortSelector";
interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}
interface FiltersHeaderProps {
  results?: number;
  sortOptions: SortOption[];
}

const FiltersHeader: React.FC<FiltersHeaderProps> = ({ results = 0, sortOptions }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams?.get("search") ?? ""
  );
  const { selectedCategoryName, setSelectedCategoryName, setCategoryLoading } = useCategoryStore();

  // Local state for immediate UI updates
  const [activeFiltersLocal, setActiveFiltersLocal] = useState<{ key: string; label: string }[]>([]);

  // Sort functionality using Ant Design Dropdown
  const currentSortValue = searchParams?.get("sort") ?? "popular";
  const currentSort = sortOptions.find(opt => opt.value === currentSortValue) || sortOptions[0];

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("sort", value);
    params.set("page", "1"); // reset pagination

    router.push(`?${params.toString()}`, {
      scroll: false,
    });
    router.refresh();
  };

  // const menuItems: MenuProps['items'] = sortOptions.map((option) => ({
  //   key: option.value,
  //   label: option.icon ? (
  //     <div className="flex items-center gap-3 py-1">
  //       <span
  //         className={`${currentSortValue === option.value
  //             ? "text-white"
  //             : "text-[#00664F]"
  //           }`}
  //       >
  //         {option.icon}
  //       </span>
  //       <span className="text-sm font-medium">{option.label}</span>
  //     </div>
  //   ) : (
  //     <span className="text-sm font-medium">{option.label}</span>
  //   ),
  //   onClick: () => handleSortChange(option.value),
  //   ...(currentSortValue === option.value && { className: 'selected-sort-item' }),
  // }));

  /* ------------------ helpers ------------------ */
  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    // reset page on filter change
    params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  const handleSearch = () => {
    setCategoryLoading(true); // Set loading state when search starts
    updateURL({ search: searchInput.trim() || null });
  };

  const removeFilter = (key: string) => {
    setCategoryLoading(true); // Set loading state when filter removal starts
    // Remove from local state immediately for instant UI update
    setActiveFiltersLocal(prev => prev.filter(filter => filter.key !== key));
    updateURL({ [key]: null });
    // router.refresh();
  };
  // Helper function to get sort label
  const getSortLabel = (sortValue: string | null) => {
    if (!sortValue) return "";

    const sortLabels = {
      popular: t("filters.sort.most_popular"),
      price_asc: t("filters.sort.lowest_price"),
      price_desc: t("filters.sort.highest_price"),
      newest: t("filters.sort.newest")
    };

    return sortLabels[sortValue as keyof typeof sortLabels] || sortValue;
  };
  // Sync local state with URL params
  useEffect(() => {
    const filters = [
      searchParams?.get("search") && {
        key: "search",
        label: `${t("categories.search")}: ${searchParams.get("search")}`,
      },
      searchParams?.get("category") &&
      searchParams.get("category") !== "all" && {
        key: "category",
        label: `${t("categories.category")}: ${selectedCategoryName}`,
      },
      searchParams?.get("min") && {
        key: "min",
        label: `${t("categories.min")}: $${searchParams.get("min")}`,
      },
      searchParams?.get("max") && {
        key: "max",
        label: `${t("categories.max")}: $${searchParams.get("max")}`,
      },
      searchParams?.get("rating") && {
        key: "rating",
        label: `${searchParams.get("rating")}★ & up`,
      },
      searchParams?.get("seller") && {
        key: "seller",
        label: `${t("categories.seller")}: ${searchParams.get("seller")}`,
      },
      searchParams?.get("sort") && {
        key: "sort",
        label: `${t("filters.sort_by")}: ${getSortLabel(searchParams.get("sort"))}`,
      },
      searchParams?.get("promo") && {
        key: "promo",
        label: `${t("categories.promo")}: ${searchParams
          .get("promo")
          ?.split(",")
          .join(", ")}`,
      },
      searchParams?.get("attr") && {
        key: "attr",
        label: `${t("categories.attributes")}: ${searchParams
          .get("attr")
          ?.split(",")
          .join(", ")}`,
      },
    ].filter(Boolean) as { key: string; label: string }[];

    setActiveFiltersLocal(filters);
  }, [searchParams, selectedCategoryName, t]);




  return (
    <div className="space-y-3 mb-6">
      {/* 🔍 Search + Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 py-2">
        <div className="flex items-center gap-2 w-full lg:w-auto lg:max-w-md border border-gray-300 rounded-md px-3 py-2">
          <input
            type="text"
            placeholder={t("common.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 outline-none text-sm min-w-0"
          />
          <button
            onClick={handleSearch}
            className="text-blueSite hover:text-blueSiteHover flex-shrink-0"
          >
            <FiSearch size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between w-full md:max-w-[250px] ">
          <SortSelector sortOptions={sortOptions} onSortChange={() => setCategoryLoading(true)} />
        </div>
      </div>

      {/* 🟦 Active Filters Bar */}
      {activeFiltersLocal.length > 0 && (
        <div className="bg-blueLight rounded-md px-3 py-3 text-xs text-subTitleColor">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-medium text-textColor text-sm">{t("categories.activeFilters")}</span>

              {activeFiltersLocal.map((filter: { key: string; label: string }) => (
                <span
                  key={filter.key}
                  className="px-2 py-1 rounded-md cursor-pointer text-subTitleColor text-sm bg-white border border-gray-200 hover:bg-gray-50 transition-colors max-w-full truncate"
                  onClick={() => removeFilter(filter.key)}
                  title={filter.label}
                >
                  {filter.label} <span className="ml-1 text-gray-500 hover:text-red-500">✕</span>
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                {activeFiltersLocal.length} {t("categories.filtersApplied", { count: activeFiltersLocal.length })}
              </span>
              <span className="font-semibold text-blueSite text-sm">
                {t("categories.resultsFound", { count: results })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersHeader;

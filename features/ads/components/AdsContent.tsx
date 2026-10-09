"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Ad, AdSearchParams } from "../types/type";
import AdCard from "./AdCard";
import Pagination from "@/components/ui/Pagination";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Image from "next/image";
import { Eye, Package } from "lucide-react";
import type { MenuProps } from "antd";
import useAdsFilterStore from "@/lib/store/useAdsFilterStore";

interface AdsContentProps {
  ads: Ad[];
  totalPages: number;
  currentPage: number;
  totalResults: number;
  searchParams: AdSearchParams;
}

const AdsContent: React.FC<AdsContentProps> = ({
  ads,
  totalPages,
  currentPage,
  totalResults,
  searchParams,
}) => {
  // Get loading states from store
  const { 
    categoryLoading, 
    subCategoryLoading, 
    priceLoading, 
    conditionLoading, 
    promoLoading 
  } = useAdsFilterStore();
  
  // Check if any filter is loading
  const isAnyFilterLoading = categoryLoading || subCategoryLoading || priceLoading || conditionLoading || promoLoading;
  const { t } = useTranslation();
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.search || "");

  const [rowsPerPage, setRowsPerPage] = useState(Number(searchParams.rows ?? 10));

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    // Update URL with new rows per page
    const params = new URLSearchParams(urlSearchParams?.toString());
    params.set("rows", String(newRowsPerPage));
    params.set("page", "1"); // Reset to first page when changing rows per page
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const sortOptions = [
    {
      value: "views_desc",
      label: t("filters.sort.most_viewed") || "Most viewed",
      icon: <Eye size={18} />,
    },
    {
      value: "views_asc",
      label: t("filters.sort.least_viewed") || "Least viewed",
      icon: <Eye size={18} />,
    },
    {
      value: "newest",
      label: t("filters.sort.newest") || "Newest ads",
      icon: <Package size={18} />,
    },
    {
      value: "price_asc",
      label: t("filters.sort.lowest_price") || "Lowest price",
      icon: <Package size={18} />,
    },
    {
      value: "price_desc",
      label: t("filters.sort.highest_price") || "Highest price",
      icon: <Package size={18} />,
    },
  ];

  // useEffect(()=>{
  //   console.log(categoryLoading , subCategoryLoading , priceLoading , conditionLoading , promoLoading)
  // },[categoryLoading , subCategoryLoading , priceLoading , conditionLoading , promoLoading])
  const currentSort =
    sortOptions.find((opt) => opt.value === (searchParams.sort || "newest")) ||
    sortOptions[2];

  const menuItems: MenuProps["items"] = sortOptions.reduce(
    (acc: any[], opt, index) => {
      acc.push({
        key: opt.value,
        label: (
          <div className="flex items-center gap-3 py-1">
            <span
              className={`${
                currentSort.value === opt.value
                  ? "text-white"
                  : "text-[#00664F]"
              }`}
            >
              {opt.icon}
            </span>
            <span className="text-sm font-medium">{opt.label}</span>
          </div>
        ),
        className: `sort-dropdown-item ${currentSort.value === opt.value ? "selected-sort-item" : ""}`,
        onClick: () => updateURL({ sort: opt.value }),
      });
      return acc;
    },
    [],
  );

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(urlSearchParams?.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    updateURL({ search: searchInput.trim() || null });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateURL({ sort: e.target.value || null });
  };

  const handleResetAllFilters = () => {
    router.push(window.location.pathname, { scroll: false });
  };

  const removeFilter = (key: string) => {
    updateURL({ [key]: null });
  };

  // Active filters
  const activeFilters = [
    urlSearchParams?.get("search") && {
      key: "search",
      label: `${t("categories.search") || "Search"}: ${urlSearchParams.get("search")}`,
    },
    urlSearchParams?.get("category") && {
      key: "category",
      label: `${t("categories.category") || "Category"}: ${urlSearchParams.get("category")}`,
    },
    urlSearchParams?.get("min") && {
      key: "min",
      label: `${t("categories.min") || "Min"}: $${urlSearchParams.get("min")}`,
    },
    urlSearchParams?.get("max") && {
      key: "max",
      label: `${t("categories.max") || "Max"}: $${urlSearchParams.get("max")}`,
    },
    urlSearchParams?.get("condition") && {
      key: "condition",
      label: `${t("ads_feature.item_condition") || "Condition"}: ${urlSearchParams.get("condition")}`,
    },
    urlSearchParams?.get("promo") && {
      key: "promo",
      label: `${t("ads_feature.acquisition_method") || "Promo"}: ${urlSearchParams.get("promo")}`,
    },
  ].filter(Boolean) as { key: string; label: string }[];

  const handleFavoriteToggle = (id: Ad["id"]) => {
    // This would be handled by a real API/store in production
    console.log("Toggle favorite:", id);
  };

  // Split ads into two groups for banner placement
  const firstGroupAds = ads.slice(0, 6);
  const secondGroupAds = ads.slice(6);


    if(isAnyFilterLoading){
        return (
            <main className="flex-1">
              {/* Header */}
              {/* <div className="flex justify-between items-center mb-6">
                <div className="h-5 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div> */}
      
              {/* Products grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-3 space-y-3"
                  >
                    {/* Image */}
                    <div className="h-[180px] bg-gray-200 rounded" />
      
                    {/* Title */}
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
      
                    {/* Rating */}
                    <div className="h-3 w-24 bg-gray-200 rounded" />
      
                    {/* Price */}
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </main>
        )
    }

  return (
    <div className="flex-1 pb-4">
      {/* Search + Sort Header using FilterHeader */}




      {/* Ads Grid - First Group */}
      {ads.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-4 md:gap-6 mb-6">
            {firstGroupAds.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>

          {/* Promotional Banner */}
          {secondGroupAds.length > 0 && (
            <div className="relative w-full h-[220px] bg-[#303333] rounded-3xl mb-10 overflow-hidden flex items-center justify-between px-8 md:px-16">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-900/30 blur-[80px] rounded-full pointer-events-none" />

              {/* Left Content */}
              <div className="relative z-10 flex flex-col gap-1 max-w-[30%]">
                <span className="text-emerald-500 font-semibold text-lg md:text-2xl tracking-tight">
                  {t("promoBanner.preOrder") || "Pre Order"}
                </span>
                <span className="text-white/80 text-xs md:text-sm">
                  {t("promoBanner.beTheFirst") || "Be The First To Own"}
                </span>
                <span className="text-white font-medium text-sm md:text-base mt-2">
                  {t("promoBanner.from") || "From"} $399
                </span>
              </div>

              {/* Center Product Image */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="relative w-[180px] h-[180px] md:w-[240px] md:h-[240px]">
                  <Image
                    src="/dummy/promo.png"
                    alt="Product"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Right Content */}
              <div className="relative z-10 flex flex-col items-end text-right max-w-[40%]">
                <span className="text-white text-[10px] md:text-xs mb-1 opacity-90">
                  {t("ads_feature.banner_subtitle") ||
                    "Opplo Watch SportSeries 8"}
                </span>
                <h2 className="text-white text-xl md:text-4xl font-bold leading-tight">
                  {t("ads_feature.banner_title") || "A healthy leap ahead"}
                </h2>
              </div>
            </div>
          )}

          {/* Ads Grid - Second Group */}
          {secondGroupAds.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-4 md:gap-6 mb-6">
              {secondGroupAds.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-500">
              {t("common.showing") || "Showing"} 1 - {ads.length}{" "}
              {t("common.of") || "of"} {totalResults}
            </span>
            <div>
              
              <Pagination 
                  totalPages={totalPages} 
                  currentPage={currentPage} 
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="relative w-64 h-64 mb-8">
            <Image
              src="/empty.svg"
              alt="No results"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-[#1A1C1A] mb-3">
            {t("ads_feature.no_results_title") || "No results available"}
          </h3>
          <p className="text-[#474947] max-w-lg mb-10 leading-relaxed">
            {t("ads_feature.no_results_desc") ||
              "We're sorry, but no results match your selected criteria at this time. Please review your filter settings or try again with different options"}
          </p>
          <button
            onClick={handleResetAllFilters}
            className="bg-[#00664f] text-white px-24 py-2 rounded-xl transition-all hover:bg-[#00523f] shadow-lg active:scale-95"
          >
            {t("ads_feature.reset_filters") || "Reset All Filters"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdsContent;

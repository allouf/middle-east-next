"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Input, Select } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useFavoriteAds from "@/features/ads/hooks/useFavoriteAds";
import SavedAdCard from "./SavedAdCard";
import Image from "next/image";
import Link from "next/link";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface UsedMarketSavedAdsProps {
  onBack: () => void;
}

const UsedMarketSavedAds: React.FC<UsedMarketSavedAdsProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const {isRTL} = useLocaleDirection();
  const [search, setSearch] = useState("");


  // Fetch favorite ads using the hook
  const { favorites, favoritesLoading, favoritesError, toggleFavorite, isPending, refetchFavorites } = useFavoriteAds(true);

  // Filter favorites based on search
  const filteredFavorites = favorites
    ? favorites.filter(
        (ad) =>
          ad.title?.toLowerCase().includes(search.toLowerCase()) ||
          ad.description?.toLowerCase().includes(search.toLowerCase())
      )
    : [];



  return (
    <div className="p-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blueSite text-[20px] mb-6 hover:opacity-80 transition-opacity font-medium"
      >
       {isRTL? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        {t("usedMarket.rejectedAds.goBack")}
      </button>

      {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
     
      </div> */}

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <h1 className="text-[24px] text-subTitleColor">
          {t("usedMarket.savedAds.titleWithCount", { count: favorites?.length })} :
        </h1>
        <div className="flex-1 max-w-md">
          <Input
            suffix={<Search className="w-4 h-4 text-gray-400" />}
            
            placeholder={t("usedMarket.savedAds.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 bg-white border-gray-200"
          />
        </div>
       
      </div>

      {/* List */}
      <div className="space-y-4">
        {favoritesLoading ? (
          // Loading state
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00664F]"></div>
          </div>
        ) : favoritesError ? (
          // Error state
          <div className="text-center py-12 text-red-500">
            {t("common.errorLoading")}
          </div>
        ) : filteredFavorites.length === 0 ? (
          // Empty state
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
            {t("usedMarket.savedAds.emptyTitle")}
        </h3>
        <p className="text-[#474947] max-w-lg mb-10 leading-relaxed">
            {t("ads_feature.no_results_desc") ||
            "We're sorry, but no results match your selected criteria at this time. Please review your filter settings or try again with different options"}
        </p>
        <Link
            href={"/"}
            className="bg-[#00664f] text-white px-24 py-2 rounded-xl transition-all hover:bg-[#00523f] shadow-lg active:scale-95"
        >
            {t("usedMarket.savedAds.goToHome")}
        </Link>
        </div>
        ) : (
          // Render saved ads
          filteredFavorites.map((ad) => (
            <SavedAdCard
              key={ad.id}
              id={ad.id}
              title={ad.title}
              description={ad.description || ""}
              image={ad.images?.[0] || ""}
              category={ad.category?.name}
              viewsCount={ad.views_count}
              isNegotiable={ad.is_price_negotiable}
              condition={ad.condition}
              toggleFavorite={toggleFavorite}
              isPending={isPending}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UsedMarketSavedAds;
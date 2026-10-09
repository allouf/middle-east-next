import React from "react";
import { fetchFreeZoneProducts } from "../api/getFreeZoneProducts";
import { FreeZoneSearchParams } from "../types/type";
import FreeZoneProductCard from "./FreeZoneProductCard";
import { getT } from "@/lib/i18n/server";
import { fetchCountries, getCountryNameByCodeFromList } from "@/shared/utils/locationApi";
import Image from "next/image";
import Link from "next/link";

interface FreeZoneMarketContentProps {
  locale: string;
  searchParams: FreeZoneSearchParams;
}

const FreeZoneMarketContent = async ({
  locale,
  searchParams,
}: FreeZoneMarketContentProps) => {
  const t = await getT(locale);
  const { products, meta } = await fetchFreeZoneProducts(searchParams, locale);
  const countries = await fetchCountries();

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#323232]">
            {t("freeZoneMarket.market.title")}
          </h2>
          <p className="text-md text-[#747474] font-medium">
            {t("freeZoneMarket.market.foundCount", { count: meta.total })}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
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
            {t("freeZoneMarket.market.no_results_title") || "No results available"}
          </h3>
          <p className="text-[#474947] max-w-lg mb-10 leading-relaxed">
            {t("freeZoneMarket.market.no_results_desc") ||
              "We're sorry, but no results match your selected criteria at this time. Please review your filter settings or try again with different options"}
          </p>
          <Link
            href={`/${locale}/free-zone`}
            className="bg-[#00664f] text-white px-24 py-2 rounded-xl transition-all hover:bg-[#00523f] shadow-lg active:scale-95 font-somar-medium inline-flex"
          >
            {t("freeZoneMarket.market.reset_filters") || "Reset All Filters"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product: any) => (
            <FreeZoneProductCard
              key={product.id}
              id={product.id}
              storeId={product.store?.id}
              image={product.gallery?.[0]?.file_path ?? "/freeCard1.png"}
              category={product.category?.name ?? ""}
              title={product.name}
              company={product.store?.name ?? ""}
              available={product.total_left_in_stock ?? 0}
              country={getCountryNameByCodeFromList((countries || []), product.country_code) || product.country_code || "-"}
              price={product.price}
              rating={product.avg_rating ?? 0}
            />
          ))}
        </div>
      )}

      {/* Pagination info */}
      {meta.total > 0 && (
        <div className="flex justify-between items-center py-6 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-400">
            {t("freeZoneMarket.market.pagination", {
              start: (meta.current_page - 1) * meta.per_page + 1,
              end: Math.min(meta.current_page * meta.per_page, meta.total),
              total: meta.total,
            })}
          </span>
        </div>
      )}
    </>
  );
};

export default FreeZoneMarketContent;

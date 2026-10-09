import React, { Suspense } from "react";
import FreeZoneBanner from "./FreeZoneBanner";
import FreeZoneFilters from "./FreeZoneFilters";
import FreeZoneMarketContent from "./FreeZoneMarketContent";
import { FreeZoneSearchParams } from "../types/type";
import { fetchCategoriesWithChildren } from "@/features/category/api/getCategoriesWithChildren";

interface FreeZoneMarketProps {
  locale: string;
  searchParams: FreeZoneSearchParams;
}

const FreeZoneMarket = async ({ locale, searchParams }: FreeZoneMarketProps) => {
  const categories = await fetchCategoriesWithChildren('', locale);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Banner - Full Width */}
      <FreeZoneBanner locale={locale} />

      <div className="max-w-9xl mx-auto py-8 px-4 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <FreeZoneFilters initialCategories={categories} />
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
                      <div className="aspect-[3/2.8] w-full bg-gray-200" />
                      <div className="p-4 flex flex-col flex-grow gap-2">
                        <div className="flex justify-between items-center mb-1">
                          <div className="h-2 w-16 bg-gray-200 rounded" />
                          <div className="h-2 w-10 bg-gray-200 rounded" />
                        </div>
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-3/4 bg-gray-200 rounded" />
                        <div className="h-3 w-1/2 bg-gray-200 rounded mt-2" />
                        <div className="h-10 w-full bg-gray-200 rounded mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <FreeZoneMarketContent locale={locale} searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FreeZoneMarket;

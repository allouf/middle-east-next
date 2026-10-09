import React, { Suspense } from "react";
import AdsSideBar from "./AdsSideBar";
import { AdSearchParams } from "../types/type";
import AdsContent_server from "./AdsContent_server";
import { fetchAllAdsCategoriesWithSub } from "../api/getAllCategoriesWithSub";
import ContentSkelatonLoader from "./ContentSkelatonLoader";

interface AdsPageProps {
  searchParams: AdSearchParams;
  locale: string;
}

const AdsPage = async ({ searchParams, locale }: AdsPageProps) => {

  
  // Fetch categories with subcategories from API
  const activeCategory = searchParams.category ?? "";
  const query = new URLSearchParams({
    ...(activeCategory && { "category": activeCategory }),
  }).toString();
  const categories = await fetchAllAdsCategoriesWithSub(query, locale);



  return (
    <div>
      {/* Hero Banner */}
      <div className="relative w-full sm:h-56 h-[100px] bg-gray-100 flex items-center justify-center mb-10">
        <div className="w-full h-full bg-gradient-to-tr from-blueSite via-[#323232] to-blueSite flex items-center justify-center">
          {/* Hero content can be added here */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6 md:pe-4">
        {/* Sidebar */}
        <AdsSideBar categories={categories} searchParams={searchParams} />

        {/* Content */}
        <main className="flex-1 pt-10 lg:pt-0">
          <Suspense fallback={
           <ContentSkelatonLoader/>
          }>
            <AdsContent_server searchParams={searchParams} locale={locale}/>
          </Suspense>
        </main>

      </div>
    </div>
  );
};

export default AdsPage;

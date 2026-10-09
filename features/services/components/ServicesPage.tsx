import React, { Suspense } from "react";
import ServicesSideBar from "./ServicesSideBar";
import { ServiceSearchParams } from "../types/type";
import ServicesContent_server from "./ServicesContent_server";
import { dummyServiceCategories } from "../data/dummyServices";
import ContentSkelatonLoader from "./ContentSkelatonLoader";
import ServicesHeroBanner from "./ServicesHeroBanner";
import { fetchServiceCategories } from "../api/getAllCategories";

interface ServicesPageProps {
  searchParams: ServiceSearchParams;
  locale: string;
}

const ServicesPage = async ({ searchParams, locale }: ServicesPageProps) => {
  const categorySearchQuery = (searchParams as any).category_search 
    ? `search=${(searchParams as any).category_search}` 
    : "";
  
  const categoriesData = await fetchServiceCategories(categorySearchQuery, locale);
  const categories = categoriesData as any as typeof dummyServiceCategories;

  // console.log("services categories", categoriesData)
  return (
    <div>
      {/* Hero Banner */}
 
      <ServicesHeroBanner/>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6 md:pe-4">
        {/* Sidebar */}
        <ServicesSideBar categories={categories} searchParams={searchParams} />

        {/* Content */}
        <main className="flex-1 pt-10 lg:pt-0">
          <Suspense fallback={<ContentSkelatonLoader />}>
            <ServicesContent_server searchParams={searchParams} locale={locale} />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default ServicesPage;

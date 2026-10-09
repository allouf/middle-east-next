"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Service, ServiceSearchParams } from "../types/type";
import ServiceCard from "./ServiceCard";
import Pagination from "@/components/ui/Pagination";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Image from "next/image";
import useServicesFilterStore from "@/lib/store/useServicesFilterStore";
import ContentSkelatonLoader from "./ContentSkelatonLoader";
import EmptyState from "./EmptyState";
import PromoBannerClient from "@/features/home/components/PromoBanner.client";

interface ServicesContentProps {
  services: Service[];
  totalPages: number;
  currentPage: number;
  totalResults: number;
  searchParams: ServiceSearchParams;
}

const ServicesContent: React.FC<ServicesContentProps> = ({
  services,
  totalPages,
  currentPage,
  totalResults,
  searchParams,
}) => {
  const { 
    categoryLoading, 
    subCategoryLoading, 
    priceLoading, 
    ratingLoading,
    serviceTypeLoading,
    deliveryTypeLoading
  } = useServicesFilterStore();
  
  const isAnyFilterLoading = categoryLoading || subCategoryLoading || priceLoading || ratingLoading || serviceTypeLoading || deliveryTypeLoading;
  const { t } = useTranslation();
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  useEffect(()=>{
    console.log("category Loading ",categoryLoading)
  },[categoryLoading])

  const [rowsPerPage, setRowsPerPage] = useState(Number(searchParams.rows ?? 10));

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    const params = new URLSearchParams(urlSearchParams?.toString());
    params.set("rows", String(newRowsPerPage));
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleResetAllFilters = () => {
    router.push(window.location.pathname, { scroll: false });
  };


  // console.log("services",services)
  // Split services into two groups for banner placement
  const firstGroupServices = services.slice(0, 6);
  const secondGroupServices = services.slice(6);

  if (isAnyFilterLoading) {
    return <ContentSkelatonLoader />;
  }

  return (
    <div className="flex-1 pb-4">
      {firstGroupServices.length  > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-4 md:gap-6 mb-6">
            {firstGroupServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Promotional Banner */}
          {secondGroupServices.length > 0 && (
            <div className="mb-10">
              <PromoBannerClient preOrderData={{
                title: t("promoBanner.topRated"),
                price: 150,
                product_name: t("promoBanner.featured"),
                product_description: t("promoBanner.expertSolutions"),
                image: "/dummy/promo.png",
                link: null
              }}
              padding="" />
            </div>
          )}

          {secondGroupServices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-4 md:gap-5 mb-6">
              {secondGroupServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-500">
              {t("common.showing")} 1 - {services.length}{" "}
              {t("common.of")} {totalResults}
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
          <EmptyState/>
        </div>
      )}
    </div>
  );
};

export default ServicesContent;

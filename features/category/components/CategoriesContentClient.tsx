"use client";
import Pagination from "@/components/ui/Pagination";
import React from "react";
import CategoryProductCard from "./CategoryProductCard";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Product } from "@/features/product/types/type";
import useCategoryStore from "@/lib/store/useCategoryStore";
import LoaderPage from "@/components/shared/LoaderPage";

const CategoriesContentClient = ({
  products,
  lastPage,
  page,
}: {
  products: Product[];
  lastPage: number;
  page: number;
}) => {
  const { categoryLoading } = useCategoryStore();
  const { t } = useTranslation();

  if (categoryLoading) {
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
            <div key={i} className="border rounded-lg p-3 space-y-3">
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
    );
  }

  return (
    <div className="mb-4 min-h-[65vh]">
      <div className="space-y-6 w-full">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              {products.map((product: Product) => (
                <CategoryProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination totalPages={lastPage} currentPage={page} />
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-textColor text-lg">
              {t("categories.noProducts")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesContentClient;

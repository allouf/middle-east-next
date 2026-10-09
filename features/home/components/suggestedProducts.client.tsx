'use client';

import React, { useState, useMemo } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import HeaderHome from "./HeaderHome";
import ProductCard from "@/components/cards/product/ProductCard";
import { MappedProdcut } from "../type";
interface SuggestedProductsClientProps {
  products: MappedProdcut[];
}

const SuggestedProductsClient: React.FC<SuggestedProductsClientProps> = ({ products }) => {
  const { t } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);



  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const transformedProducts = useMemo(() => {
    if (!products?.length) return [];
    return products;
  }, [products]);

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((item) => item.id === id);
      if (exists) { return prev.filter((item) => item.id !== id) }

      return [...prev, { id, value: true }]

    });

  };


  return (
    <section className="p-4 md:p-10">
      <div className="mx-auto">
        <HeaderHome
          text={t("suggestedProducts.title")}
          // onClick={toggleExpand} 
          url={"/products?attr=suggested"}
          // showText={isExpanded ? t("suggestedProducts.viewFewer") : t("suggestedProducts.viewAll")}
        />

        {transformedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 gap-4">
            {transformedProducts.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden group"
              >
                <ProductCard
                  product={item}
                  toggleProduct={toggleProduct}
                  selected={selectedProducts}
                  selectable={false}
                  showCartIcon={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {t("suggestedProducts.noProducts")}
          </div>
        )}
      </div>
    </section>
  );
};

export default SuggestedProductsClient;

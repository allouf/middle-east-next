'use client';

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import HeaderHome from "./HeaderHome";

import ProductCard from "@/components/cards/product/ProductCard";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { MappedProdcut } from "../type";

import ProductAsideCard from "@/features/product/components/ProductAsideCard";

interface DiscountedProductsClientProps {
  products: MappedProdcut[];
}

const DiscountedProductsClient: React.FC<DiscountedProductsClientProps> = ({ products }) => {
  const { t } = useTranslation();

  const [selectedProducts, setSelectedProducts] = useState<MappedProdcut[]>([]);
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
      return [...prev, { id, value: true } as unknown as MappedProdcut]
    });
  };

  // console.log("discounted products",products)

  return (
    <section className="p-4 md:p-10">
      <div className="mx-auto">
        <HeaderHome
          text={t("discountedProducts.title")}
          url="/products?attr=discounted"
          // onClick={toggleExpand}
          // showText={isExpanded ? t("discountedProducts.viewFewer") : t("discountedProducts.viewAll")}
        />
          {transformedProducts.length > 0 ? (
              <div className="flex sm:flex-row flex-col max-sm:flex-col-reverse gap-5">
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3   gap-4" >
                    
                    {transformedProducts.slice(0, -1).map((item, index) => (
                      // <motion.div
                      //   key={item.id}
                      //   className="relative bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden group"
                      //   initial={{ opacity: 0, y: 20 }}
                      //   animate={{ opacity: 1, y: 0 }}
                      //   transition={{ delay: index * 0.05, duration: 0.3 }}
                      // >
                        <ProductCard 
                          key={item.id}
                          product={item}                 
                          showCartIcon={true}
                          isSecondary={true}
                        />
                      // </motion.div>
                    ))}
                    
                  </div>
                  <div className=" max-h-[700px] sm:w-auto row-span-2" >
                    <ProductAsideCard
                      key={transformedProducts[0]?.id}
                      product={transformedProducts[0]}
                      isDark={false}
                      showCartIcon={true}
                    />

                  </div>
              </div>
               ) : (
            <div className="text-center py-8 text-textColor">
              {t("discountedProducts.noProducts")}
            </div>
          )}


      </div>
    </section>
  );
};

export default DiscountedProductsClient;

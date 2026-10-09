'use client';

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import HeaderHome from "./HeaderHome";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ProductCard from "@/components/cards/product/ProductCard";
import { useTranslation } from "@/lib/i18n/useTranslation";

import ProductAsideCard from "@/features/product/components/ProductAsideCard";

interface FreeShippingProductsClientsProps {
  products: any[];
}

const FreeShippingProductsClient: React.FC<FreeShippingProductsClientsProps> = ({ products }) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string | number>("All");
  const [isExpanded, setIsExpanded] = useState(false);

  const transformedProducts = useMemo(() => {
    if (!products?.length) return [];
    return products;
  }, [products]);

  const categories = useMemo(() => {
    const categoryMap = new Map();
    categoryMap.set("All", { id: "All", name: t("freeShipping.all") });

    transformedProducts.forEach((product: any) => {
      if (product.categoryId && product.category) {
        if (!categoryMap.has(product.categoryId)) {
          categoryMap.set(product.categoryId, {
            id: product.categoryId,
            name: product.category,
          });
        }
      }
    });

    const categoriesArray = Array.from(categoryMap.values());
    const allCategory = categoriesArray.find((cat) => cat.id === "All");
    const otherCategories = categoriesArray
      .filter((cat) => cat.id !== "All")
      .sort((a, b) => a.name.localeCompare(b.name));

    return allCategory ? [allCategory, ...otherCategories] : otherCategories;
  }, [transformedProducts, t]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return transformedProducts;
    return transformedProducts.filter(
      (product: any) => product.categoryId?.toString() === activeCategory.toString()
    );
  }, [transformedProducts, activeCategory]);

  const productsToDisplay = useMemo(() => {
    return isExpanded ? filteredProducts : filteredProducts.slice(0, 4);
  }, [filteredProducts, isExpanded]);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <section className="p-4 md:p-10">
      <div className="mx-auto">
        <HeaderHome
          text={t("freeShipping.title")}
          url="/products?attr=free_delivery"
          // onClick={toggleExpand}
          // showText={isExpanded ? t("freeShipping.viewFewer") : t("freeShipping.viewAll")}
        />

        {/* {categories.length > 1 && (
          <Swiper
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            grabCursor={true}
            modules={[Pagination]}
            className="mySwiper sm:mb-8 mb-4"
            breakpoints={{
              0: { slidesPerView: 2.5 },
              400: { slidesPerView: 3.5 },
              640: { slidesPerView: 4.5 },
              768: { slidesPerView: 5.5 },
              1024: { slidesPerView: 6.5 },
              1280: { slidesPerView: 7.5 },
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id} className="!w-auto">
                <button
                  onClick={() => setActiveCategory(cat.id)}
                  className={`sm:px-5 px-3 sm:py-2 py-1 rounded-md sm:text-sm text-[12px] font-medium border transition-all duration-200 whitespace-nowrap ${activeCategory === cat.id
                    ? "bg-blueSite text-textWhiteColor border-blueSite"
                    : "border-gray-300 text-subTitleColor hover:border-blueSiteHover"
                    }`}
                >
                  {cat.name}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )} */}

          {transformedProducts.length > 0 ? (
              <div className="flex sm:flex-row flex-col max-sm:flex-col-reverse gap-5">
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3  gap-4" style={{ '--row-height': '200px' } as React.CSSProperties}>
                    {transformedProducts.slice(0, -1).map((item, index) => (
        
                        <ProductCard
                          key={item.id || index}
                          product={item}                 
                          showCartIcon={true} 
                          isSecondary={true}
                        />
                 
                    ))}
                  </div>
                  <div className=" sm:w-auto row-span-2 max-h-[700px]" >
                    <ProductAsideCard
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

export default FreeShippingProductsClient;

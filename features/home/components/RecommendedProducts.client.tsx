'use client';

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import HeaderHome from "./HeaderHome";
import { Swiper, SwiperSlide } from "swiper/react";
;
import { Pagination } from "swiper/modules";
import ProductCard from "@/components/cards/product/ProductCard";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface RecommendedProductsClientProps {
  products: any[];
}

const RecommendedProductsClient: React.FC<RecommendedProductsClientProps> = ({ products }) => {
  const { t } = useTranslation();
  const { dir } = useLocaleDirection();
  const [activeCategory, setActiveCategory] = useState("All");
  const [isExpanded, setIsExpanded] = useState(false);


  const transformedProducts = useMemo(() => {
    if (!products?.length) return [];
    return products;
  }, [products]);

  const categories = useMemo(() => {
    const categoryMap = new Map();
    categoryMap.set("All", { id: "All", name: t("recommendedProducts.all") });

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
    if (isExpanded) return filteredProducts;
    return filteredProducts.slice(0, 4);
  }, [filteredProducts, isExpanded]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <section className="p-4 md:p-10">
      <div className="mx-auto">
        <HeaderHome
          text={t("recommendedProducts.title")}
          url={"/products?attr=recommended"}
          // onClick={toggleExpand}
          // showText={isExpanded ? t("recommendedProducts.viewFewer") : t("recommendedProducts.viewAll")}
        />

        {categories.length > 1 && (
          <Swiper
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            grabCursor={true}
            modules={[Pagination]}
            dir={dir}
            key={dir}
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
        )}

        {productsToDisplay.length > 0 ? (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 gap-4"
          >
            {productsToDisplay.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                className="relative bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <ProductCard
                  key={item.id}
                  product={item}
                  toggleProduct={() => { }}
                  selected={[]}
                  selectable={false}
                  showCartIcon={true}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="w-full text-center py-10 text-textColor">
            <p>{t("recommendedProducts.noProducts")}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedProductsClient;

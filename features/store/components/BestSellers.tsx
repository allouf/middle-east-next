'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import HeaderHome from "../../../components/shared/HeaderHome";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import { BestSellersResponse } from "../types/type";
import SwiperProductsContainer from "@/features/home/components/SwiperProductsContainer";

interface BestSellersProps {
  data: BestSellersResponse
}

const BestSellers: React.FC<BestSellersProps> = ({ data }) => {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState(t("bestSellers.all"));
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    console.log("best Sellers", data);
  }, [data]);

  const apiProducts = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    // if (Array.isArray(data.data?.products)) return data.data.products;
    return [];
  }, [data]);

  const transformedProducts = useMemo(() => {
    if (!apiProducts.length) return [];

    return apiProducts.map((product: any) => ({
      id: product.id,
      name: product.name,
      title: product.name,
      company: product.store?.name || t("bestSellers.companyName"),
      category: product.category?.name || t("bestSellers.defaultCategory"),
      price: `$${product.price}`,
      price_before_discount: product.price_before_discount
        ? `$${product.price_before_discount}`
        : null,
      rating: product.avg_rating || 0,
      reviews: product.number_of_buys || 0,
      discount:
        product.discount_value && product.discount_value > 0
          ? product.discount_type === "percentage"
            ? t("bestSellers.discountPercentage", { value: product.discount_value })
            : t("bestSellers.discountAmount", { value: product.discount_value })
          : null,
      stock:
        product.total_left_in_stock > 0
          ? t("bestSellers.inStock", { value: product.total_left_in_stock })
          : t("bestSellers.outOfStock"),
      image:
        product.gallery && product.gallery.length > 0
          ? product.gallery[0].file_path
          : "/dummy/prod21.png",
      deliveryTime: t("bestSellers.deliveryTime"),
      originalProduct: product,
    }));
  }, [apiProducts, t]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === t("bestSellers.all")) return transformedProducts;
    return transformedProducts.filter(
      (product: any) => product.category === activeCategory
    );
  }, [transformedProducts, activeCategory, t]);

  const availableCategories = useMemo(() => {
    const categorySet = new Set([t("bestSellers.all")]);
    transformedProducts.forEach((product: any) => {
      if (product.category) categorySet.add(product.category);
    });
    return Array.from(categorySet);
  }, [transformedProducts, t]);

  const toggleProduct = (id: any) => {
    setSelectedProducts((prev: any) =>
      prev.some((item: any) => item.id === id)
        ? prev.filter((item: any) => item.id !== id)
        : [...prev, { id, value: true }]
    );
  };

  // if (loading && url) {
  //   return (
  //     <section className="py-10">
  //       <div className="mx-auto">
  //         <HeaderHome text={t("bestSellers.title")} url="#" onClick={() => {}} />
  //         <div className="container mx-auto">
  //           <LoaderPage type="products"/>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  // if (!url && !transformedProducts.length) return null;
  // if (error && !transformedProducts.length) return null;

 
  if (Array.isArray(apiProducts) && apiProducts.length === 0)
    return

  return (
    <section className="py-10">
      <div className="mx-auto">
        <HeaderHome text={t("bestSellers.title")} url="/products?attr=best_seller" />

        {filteredProducts.length > 0 ? (
          <>
            {availableCategories.length > 1 && (
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
                {availableCategories.map((cat: any) => (
                  <SwiperSlide key={cat} className="!w-auto">
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat
                          ? "bg-blueSite text-white border-blueSite"
                          : "border-gray-300 text-subTitleColor hover:border-blueSiteHover"
                        }`}
                    >
                      {cat}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            <SwiperProductsContainer
              products={filteredProducts}
              showCartIcon={true}
              navigationRefs={[]}
            />
          </>
        ) : (
          <div className="text-center py-8 text-textColor">
            {t("bestSellers.noProducts")}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers;

"use client";
// Force HMR refresh
import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import HeaderHome from "./HeaderHome";
import SwiperProductsContainer from "./SwiperProductsContainer";
import { MappedProdcut } from "../type";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

const ALL_KEY = "__ALL__";

interface BestSellersClientProps {
    products: MappedProdcut[];
}

const BestSellersClient: React.FC<BestSellersClientProps> = ({ products }) => {
    const { t } = useTranslation();
    const { dir } = useLocaleDirection();
    const [activeCategory, setActiveCategory] = useState(ALL_KEY);
    // const [selectedProducts, setSelectedProducts] = useState<MappedProdcut[]>([]);
    const allLabel = t("product.all") || t("search.all");

    const filteredProducts = useMemo(() => {
        if (activeCategory === ALL_KEY) return products;
        return products.filter((p) => p.category === activeCategory);
    }, [products, activeCategory]);

    const availableCategories = useMemo(() => {
        const categories = new Set<string>([ALL_KEY]);
        products.forEach((p) => p.category && categories.add(p.category));
        return Array.from(categories);
    }, [products]);

    // const toggleProduct = (id: string) => {
    //     setSelectedProducts((prev) =>
    //         prev.some((item) => item.id === id)
    //             ? prev.filter((item) => item.id !== id)
    //             : [...prev, { id, value: true }]
    //     );
    // };

    return (
        <section className="p-4 md:p-10">
            <div className="mx-auto">
                <HeaderHome text={t("product.bestSellers").replace(":", "")} url="/products?attr=best_seller"  />

                {availableCategories.length > 1 && (
                    <Swiper
                        spaceBetween={10}
                        slidesPerView="auto"
                        freeMode
                        grabCursor
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
                        {availableCategories.map((cat) => (
                            <SwiperSlide key={cat} className="!w-auto">
                                <button
                                    onClick={() => setActiveCategory(cat)}
                                    className={`sm:px-5 px-3 sm:py-2 py-1 rounded-md sm:text-sm text-[12px] font-medium border transition-all duration-200 whitespace-nowrap ${activeCategory === cat
                                        ? "bg-blueSite text-textWhiteColor border-blueSite"
                                        : "border-gray-300 text-subTitleColor hover:border-blueSiteHover"
                                        }`}
                                >
                                    {cat === ALL_KEY ? allLabel : cat}
                                </button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                {filteredProducts.length > 0 ? (
                    <SwiperProductsContainer
                        products={filteredProducts}
                        showCartIcon
                        navigationRefs={[]}
                    />
                ) : (
                    <div className="text-center py-8 text-textColor">
                        {t("product.noProductsAvailable")}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BestSellersClient;

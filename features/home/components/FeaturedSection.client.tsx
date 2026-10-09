'use client';

import React, { useRef } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from "@/lib/i18n/useTranslation";
import GlowLight from "@/components/shered/GlowLight";
import SwiperProductsContainer from "./SwiperProductsContainer";
import Image from "next/image";
import { MappedProdcut } from "../type";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface FeaturedProductsClientProps {
  featuredProduct: MappedProdcut;
  carouselProducts: MappedProdcut[];
}

const FeaturedSectionClient: React.FC<FeaturedProductsClientProps> = ({ featuredProduct,
  carouselProducts }) => {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);


  return (
    <section className="bg-[#2d2d2d] ">
      {/* Left Feature Section */}
      <div className="max-w-[1900px]  relative overflow-hidden mx-auto  text-textWhiteColor px-4 sm:px-6 md:px-10 py-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 rounded-none ">

      <div className="lg:max-w-[400px] 2xl:max-w-[500px] space-y-1 text-center lg:text-left">
        {featuredProduct.category && (
          <p className="uppercase tracking-wide text-gray-300 text-xs sm:text-sm">
            {featuredProduct.category}
          </p>
        )}
        <h1 className="text-2xl font-bold ">
          {featuredProduct.name}
        </h1>
        <div>
          <p className="sm:text-[8px] sm:text-sm text-gray-200">{t("featuredProducts.startingPrice")}</p>
          <p className="text-3xl sm:text-4xl font-bold text-green-500">
            ${typeof featuredProduct.price === 'number'
              ? featuredProduct.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : "0.00"}
          </p>
        </div>
        <div className="relative mt-6 flex justify-center lg:justify-start w-[600px] h-[280px] md:h-[360px] ">
          <Image
            src={featuredProduct.image || "/dummy/prod21.png"}
            alt={featuredProduct.name}
            fill
            priority
            sizes="
              (max-width: 640px) 260px,
              (max-width: 768px) 320px,
              (max-width: 1024px) 420px,
              480px
            "
            className="object-contain"
          />
        </div>

      </div>

      {/* Right Discover Section */}
      <div className="w-full lg:max-w-[500px] xl:max-w-[700px] 2xl:max-w-[850px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[14px] sm:text-2xl font-semibold">
            {t("featuredProducts.discoverTitle")}
          </h2>
          <div className={`flex flex-row ${isRTL ? "flex-row-reverse" : ""} gap-2`}>
            <button
              ref={prevRef}
              type="button"
              className="bg-white hover:bg-white/95 rounded-full sm:p-2 p-1 transition"
              aria-label={t("featuredProducts.prev")}
            >
              <MdKeyboardArrowLeft className="text-subTitleColor text-lg sm:text-xl text-md" />
            </button>
            <button
              ref={nextRef}
              type="button"
              className="bg-white hover:bg-white/95 rounded-full sm:p-2 p-1 transition"
              aria-label={t("featuredProducts.next")}
            >
              <MdKeyboardArrowRight className="text-subTitleColor text-lg sm:text-xl text-md" />
            </button>
          </div>
        </div>

        {carouselProducts.length > 0 ? (
          <SwiperProductsContainer
            products={carouselProducts}
            selectable={false}
            isDark={true}
            navigationRefs={{ prev: prevRef, next: nextRef }}
            breakpoints={{
              0: { slidesPerView: 1.6 },
              500: { slidesPerView: 2.8 },
              1024: { slidesPerView: 1.5 },
              1280: { slidesPerView: 2 },
              1620: { slidesPerView: 2.8 },
            }}
          />
        ) : (
          <div className="text-center text-textColor py-10">
            {t("featuredProducts.noProducts")}
          </div>
        )}
      </div>

      {/* Blue Glow Effect */}
      <GlowLight
        color="#00664F"
        position="-bottom-8 -left-8"
        size="w-[250px] sm:w-[300px] h-[250px] sm:h-[300px]"
        opacity="opacity-70"
        blur="blur-[120px]"
      />
      </div>
    </section>
  );
};

export default FeaturedSectionClient;

"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

import HeaderHome from "./HeaderHome";
import { Category } from "../type";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useCategoryStore from "@/lib/store/useCategoryStore";

interface PopularCategoriesClientProps {
  categories: Category[];
}

const PopularCategoriesClient: React.FC<PopularCategoriesClientProps> = ({
  categories,
}) => {
  const { t } = useTranslation();
  const { dir, isRTL } = useLocaleDirection();
  const router = useRouter();
      const { setSelectedCategoryName} = useCategoryStore();

  // if (!categories?.length) return null;
  return (
    <section className="p-4 md:p-10">
      <div className="mx-auto">
        {/* Header */}
        <HeaderHome
          text={t("popularCategories.title")}
          url="/categories/all"

        />
        {/* Swiper */}
        <div className="relative px-9">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".cat-next",
              prevEl: ".cat-prev",
            }}
            slidesPerView={2}
            spaceBetween={20}
            dir={dir}
            key={dir}
            breakpoints={{
              0: { slidesPerView: 2 },
              375: { slidesPerView: 2.5 },
              450: { slidesPerView: 3 },
              525: { slidesPerView: 3.5 },
              600: { slidesPerView: 4 },
              675: { slidesPerView: 4.5 },
              850: { slidesPerView: 5 },
              975: { slidesPerView: 5.5 },
              1124: { slidesPerView: 6 },
              1280: { slidesPerView: 7 },
            }}
            className="pb-6"
          >
            {categories.map((cat: Category, i: number) => (
              <SwiperSlide key={cat.id}>
                <motion.div
                  onClick={() =>{ 
                    setSelectedCategoryName(cat.name)
                    router.push(`/categories?category=${cat.id}`)}}
                  className="flex flex-col items-center text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                >
                  <div
                    className="
                    w-20 h-20
                    sm:w-24 sm:h-24
                    md:w-28 md:h-28
                    lg:w-32 lg:h-32
                    bg-[#FAFAFA]
                    rounded-full
                    overflow-hidden
                    flex items-center justify-center
                    mb-3
                    transition
                    group-hover:shadow-lg
                  "
                  >
                    <Image
                      src={cat.icon || "/dummy/smartPhone.png"}
                      alt={cat.name}
                      width={160}
                      height={160}
                      sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 160px"
                      className="
        w-full
        h-auto
        max-h-full
        object-cover
        transition-transform
        duration-300  
        group-hover:scale-105
      "
                      priority={i < 6}
                    />
                  </div>

                  <p className="text-subTitleColor text-sm md:text-lg lg:text-lg xl:text-lg font-base leading-tight">
                    {cat.name}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Navigation arrows */}
          <button
            type="button"
            className={`cat-prev absolute ${isRTL ? "!right-0" : "!left-0"} top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-100 transition z-10`}
            aria-label={t("popularCategories.prev")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className={`w-4 h-4 text-subTitleColor ${isRTL ? "rotate-180" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            className={`cat-next absolute ${isRTL ? "!left-0" : "!right-0"} top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-100 transition z-10`}
            aria-label={t("popularCategories.next")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className={`w-4 h-4 text-subTitleColor ${isRTL ? "rotate-180" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
export default PopularCategoriesClient;

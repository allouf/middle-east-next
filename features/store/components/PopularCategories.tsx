'use client';

import React, { useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import "swiper/css";
import "swiper/css/navigation";
import useGetData from "@/lib/api/useGetData";
import HeaderHome from "../../../components/shared/HeaderHome";
import LoaderPage from "@/components/shared/LoaderPage";
import { CategoriesResponse } from "../types/type";

interface PopularCategoriesProps {
  resData:CategoriesResponse
}

const PopularCategories: React.FC<PopularCategoriesProps> = ({ resData }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const categories = useMemo(() => {
    if (!Array.isArray(resData?.data)) return [];
    return resData.data
      .filter((cat: any) => cat.is_active)
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [resData]);


  // if (loading) {
  //   return (
  //     <section className="py-10">
  //       <div className="mx-auto">
  //         <HeaderHome text={t("popularCategories.title")} url="#" onClick={() => {}} />
  //         <div className="container mx-auto">
  //           <LoaderPage type="categories" count={8} />
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }
  // if (error || !categories.length) {
  //   return null;
  // }


  if(Array.isArray(categories)&&categories.length===0)
    return    
  
  return (
    <section className="py-10">
      <div className="mx-auto">
        {/* Header */}
        <HeaderHome text={t("popularCategories.title")} url="/categories" />
        
        {categories.length > 0 ? (
          <>
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
                {categories.map((cat: any, i: number) => (
                  <SwiperSlide key={cat.id}>
                    <motion.div
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/category/${cat.id}`);
                      }}
                      className="flex flex-col items-center text-center group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-[#FAFAFA] rounded-full flex items-center justify-center mb-3 hover:shadow-lg hover:rounded-full overflow-hidden transition">
                        <img
                          src={cat.icon}
                          alt={cat.name}
                          className="object-contain w-[60%] group-hover:scale-105 transition"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/dummy/smartPhone.png";
                          }}
                        />
                      </div>
                      <p className="text-subTitleColor text-sm font-medium">
                        {cat.name}
                      </p>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Navigation arrows */}
              <button className="cat-prev absolute !left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-100 transition z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4 text-subTitleColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button className="cat-next absolute !right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-100 transition z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4 text-subTitleColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-textColor">
            {t("popularCategories.noCategories")}
          </div>
        )}
      </div>
    </section>
  ); 
};
export default PopularCategories;

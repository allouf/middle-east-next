'use client';

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import useGetData from "@/lib/api/useGetData";
import { storageURL } from "@/shared/constants/data";
import HeaderDetails from "../Sheared/HeaderDetails";
import LoaderPage from "@/components/shared/LoaderPage";

interface Category {
  id: number;
  name: string;
  icon?: string;
  image?: string;
}

const Categories = () => {
  const { data: categories, loading, error } = useGetData<Category[]>({
    url: "/api/shared/categories",
  });

  if (loading) {
    return <LoaderPage />;
  }

  if (error) {
    console.error("Failed to fetch categories:", error);
    return null;
  }

  if (!categories || categories.length === 0) {
    return null;
  }
  return (
    <section className="py-10">
      <div className=" mx-auto ">
        {/* Header */}
        <HeaderDetails text="The Categories : " url="#" />
        {/* Swiper */}
        <div className="relative px-9">
          {/* <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".cat-next",
              prevEl: ".cat-prev",
            }}
            slidesPerView={2}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 7 },
            }}
            className="pb-6"
          >
            {categories.map((cat, i) => (
              <SwiperSlide key={cat.id}>
                <motion.div
                  className="flex flex-col items-center text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <div className="w-32 h-32 md:w-36 md:h-36  flex items-center justify-center mb-3 hover:shadow-lg hover:rounded-full transition">
                    {cat.image ? (
                      <img
                        src={cat.image.startsWith('http') ? cat.image : `${storageURL}/${cat.image}`}
                        alt={cat.name}
                        className="object-contain group-hover:scale-105 transition"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const iconElement = target.nextElementSibling as HTMLDivElement;
                          if (iconElement) iconElement.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {cat.icon && (
                      <div 
                        className="text-4xl flex items-center justify-center"
                        style={{ display: cat.image ? 'none' : 'flex' }}
                      >
                        {cat.icon}
                      </div>
                    )}
                    {!cat.image && !cat.icon && (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">{cat.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-subTitleColor text-sm font-medium">
                    {cat.name}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper> */}

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
      </div>
    </section>
  );
};

export default Categories;

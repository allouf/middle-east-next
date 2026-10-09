"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import GlowLight from "@/components/shered/GlowLight";
import Button from "@/components/ui/Button";
import { BottomSlide, HomeSlide, MiniSlide } from "../type";
import Image from "next/image";
import bannerToBg from "@/assets/images/bannerToBg.png";
import bannarBottomBg from "@/assets/images/bannerBottomBg.png";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

const FALLBACK_IMG = "/dummy/prod21.png";

type ResilientImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src || FALLBACK_IMG);

  useEffect(() => {
    setCurrentSrc(src || FALLBACK_IMG);
  }, [src]);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => {
        if (src?.startsWith("http://") && currentSrc !== src) {
          setCurrentSrc(src);
          return;
        }
        if (currentSrc !== FALLBACK_IMG) {
          setCurrentSrc(FALLBACK_IMG);
        }
      }}
    />
  );
};

interface HomeHeaderBannerClientProps {
  slides: HomeSlide[];
  topSlides: MiniSlide[];
  bottomSlides: BottomSlide[];
}
const HomeHeaderBannerClient: React.FC<HomeHeaderBannerClientProps> = ({
  slides,
  topSlides,
  bottomSlides,
}) => {
  const { t } = useTranslation();
  const { dir } = useLocaleDirection();
  const isArabic = dir === "rtl";

  // console.log("topSlides",topSlides)
  // console.log("bottomSlides",bottomSlides)
  return (


    <section className="w-full bg-white p-4 md:p-10">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 sm:gap-4 gap-y-4">
        {/* 🟦 Left main banner */}
        <motion.div
          className="relative col-span-2 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {slides.length > 0 ? (
            <>
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{
                  el: ".pagination-home-banner",
                  clickable: true,
                }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                speed={1000}
                loop
                dir={dir}
                key={dir}
                className="rounded-xl"
              >
                {slides.map((slide: any, index: any) => (
                  <SwiperSlide key={slide.id || index} className="!h-[250px] md:!h-[500px]">
                    <motion.div
                      className={`relative rounded-2xl ${slide.bg} px-2 md:px-2 flex flex-col md:flex-row justify-between h-full `}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Price circle - top right */}
                      <div className="absolute top-10 end-6 mt-2 rounded-full p-1 z-10">
                        <div className="bg-blueSite text-textWhiteColor font-bold text-sm md:text-lg  w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center">
                          {slide.price}
                        </div>
                      </div>
                      {/* Text content */}
                      <div className="z-10 max-w-[70%] mt-10 ml-6">
                        {/* Title */}
                        <h2 className="text-[16px] sm:text-4xl md:text-5xl font-bold text-subTitleColor mb-4 leading-tight">
                          {slide.title}
                        </h2>


                        {/* Description */}
                        <p className="text-subTitleColor leading-relaxed text-[10px] md:text-xl mt-6">
                          {slide.description}
                        </p>

                        {/* Button - below description */}
                        <div className="mt-10">
                          {slide.link ? (
                            <Button
                              to={slide.link}
                              unstyled
                              className="flex items-center gap-2 bg-blueSite text-textWhiteColor max-sm:text-[12px] font-semibold px-4 sm:px-6 sm:py-3 py-2 rounded-lg hover:bg-blueSiteHover transition"
                            >
                              {t("product.shopNow")} {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                            </Button>
                          ) : (
                            <Button
                              unstyled
                              className="flex items-center gap-2 bg-blueSite text-textWhiteColor max-sm:text-[12px] font-semibold px-4 sm:px-6 sm:py-3 py-2 rounded-lg hover:bg-blueSiteHover transition"
                            >
                              {t("product.shopNow")} {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                            </Button>
                          )}
                        </div>
                        {slide.image && (
                          <div className="absolute bottom-0 end-0 h-[50%]  w-[200px] sm:w-[260px] md:w-[450px] lg:w-[500px]">
                            <div className="relative w-full h-full">
                              <ResilientImage
                                src={slide.image}
                                alt={slide.title}
                                fill
                                sizes="(max-width: 640px) 200px,
               (max-width: 768px) 260px,
               (max-width: 1024px) 350px,
               450px"
                                className="object-contain drop-shadow-xl"
                                priority
                              />
                            </div>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Pagination dots inside (bottom-left like example) */}
              <div className="pagination-home-banner absolute !start-8 sm:!bottom-8 !bottom-2 flex gap-2 z-10"></div>
            </>
          ) : null}
        </motion.div>

        <motion.div
          className="flex lg:flex-col flex-row gap-4 mx-2 "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* 🟦 Top section with slider */}
          <div className="relative rounded-2xl overflow-hidden max-lg:flex-1">

            {topSlides.length > 0 && (
              <>
                <Swiper
                  modules={[Pagination, Autoplay]}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  pagination={{
                    el: ".mini-banner-pagination",
                    clickable: true,
                  }}
                  loop
                  dir={dir}
                  speed={1200}
                  key={`top-${dir}`}
                  className="rounded-2xl"
                >
                  {topSlides.map((item: any, index: any) => (
                    <SwiperSlide key={item.id || index}>
                      <div
                        className={`relative rounded-2xl flex flex-col justify-between p-3 sm:p-6 md:p-8 ${item.bg} ${item.textColor} min-h-[240px]`}
                      >
                        <GlowLight
                          color="#00664F"
                          position="-top-28 -left-8"
                          size="w-[150px] h-[150px]"
                          opacity="opacity-90"
                          blur="blur-[42px]"
                        />

                        {/* Text */}
                        <div className="z-10">
                          <p className="text-xs uppercase tracking-wide mb-2 font-semibold opacity-90">
                            {item.tag}
                          </p>
                          <h3 className="sm:text-2xl text-[16px] font-bold mb-4">
                            {item.title}
                          </h3>
                          <Button
                            unstyled
                            className="inline-flex items-center gap-2 bg-white text-subTitleColor text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition"
                          >
                            {item.btn}
                            {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                          </Button>
                        </div>

                        {/* Image (bottom-right corner) – only when API provides one */}
                        {item?.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={288}      // set actual width
                            height={288}
                            className="absolute sm:bottom-0 sm:end-4 -bottom-3 -end-6  w-28 md:w-48 object-contain drop-shadow-xl"
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom pagination inside */}
                <div className="mini-banner-pagination absolute sm:!start-6 !start-3 sm:!bottom-5 !bottom-3 flex gap-2 z-10"></div>
              </>
            )}
          </div>

          {/* ⚫ Bottom banners slider */}
          <div className="max-lg:flex-1 relative rounded-2xl overflow-hidden min-h-[240px] bg-[#E6F0ED] text-textWhiteColor">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"

            />
            <div className="relative z-10">
              {bottomSlides.length > 0 && (
                <Swiper
                  modules={[Pagination, Autoplay]}
                  autoplay={{ delay: 4500, disableOnInteraction: false }}
                  speed={1200}
                  pagination={{
                    el: ".bottom-banner-pagination",
                    clickable: true,
                  }}
                  loop
                  dir={dir}
                  key={`bottom-${dir}`}
                  className="rounded-2xl h-full"
                >
                  {bottomSlides.map((item: any, index: any) => (
                    <SwiperSlide key={item.id || index}>
                      <div className="relative bg-[#E6F0ED] text-textWhiteColor rounded-2xl sm:p-6 p-3 md:p-8 flex items-center justify-between overflow-hidden min-h-[240px]">
                        {/* First background image - bannerToBg */}
                        <div
                          className="absolute -top-16 right-0 lg:w-[250px] xl:w-[300px] w-[200px] h-64 bg-cover bg-no-repeat opacity-100"
                          style={{ backgroundImage: `url(${bannerToBg.src})` }}
                        />
                        {/* Second background image - bannarBottomBg */}
                        <div
                          className="absolute -bottom-16 lg:right-20 right-00  lg:w-44 lg:h-32 w-44 h-32  bg-no-repeat opacity-100"
                          style={{ backgroundImage: `url(${bannarBottomBg.src})` }}
                        />
                        <div className="max-w-[70%] absolute top-0 start-0 bottom-0 flex flex-col justify-center items-center px-4">
                          {/* <span className="bg-yellow-400 text-subTitleColor sm:text-xs text-[12px] font-semibold px-2 py-1 rounded-md mb-2 inline-block">
                          {item.tag}
                        </span> */}
                          <h3 className="sm:text-2xl text-[16px] text-subTitleColor font-bold mb-3">
                            {item.title}
                          </h3>
                          {item.link ? (
                            <Button
                              to={item.link}
                              unstyled
                              className="inline-flex items-center gap-2 bg-blueSite text-white sm:text-sm text-[10px] font-semibold px-4 py-2 rounded-md hover:bg-blueSiteHover transition"
                            >
                              {t("product.shopNow")}
                              {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                            </Button>
                          ) : (
                            <Button
                              unstyled
                              className="inline-flex items-center gap-2 bg-blueSite text-subTitleColor sm:text-sm text-[10px] font-semibold px-4 py-2 rounded-md hover:bg-blueSiteHover transition"
                            >
                              {t("product.shopNow")}
                              {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                            </Button>
                          )}
                        </div>

                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={288}      // set actual width
                            height={288}
                            className="sm:w-28 w-20 md:w-44 object-contain drop-shadow-lg absolute end-0 top-1/4"
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  ))}

                  {/* Pagination inside the card */}
                  <div className="bottom-banner-pagination absolute sm:!start-6 !start-3 sm:!bottom-5 !bottom-3 flex gap-2 z-10"></div>
                </Swiper>
              )}
            </div>
          </div>
        </motion.div>
      </div >
    </section >);
};

export default HomeHeaderBannerClient;

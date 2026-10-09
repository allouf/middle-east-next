'use client';

import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import { fadeIn } from "@/lib/utils/motion";
import GlobalSwiper from "./shered/GlobalSwiper";
import { SwiperSlide } from "swiper/react";
import { t } from "i18next";

const ListingCard = ({
  id,
  images,
  date,
  price,
  category,
  location,
  index,
}) => {
  return (
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      glareEnable={true}
      glareMaxOpacity={0.1}
      className="w-full border border-gray-100 rounded-xl shadow-xl"
    >
      {" "}
      <motion.div variants={fadeIn("right", "spring", index * 0.5, 0.7)}>
        <Link href={`/ads/${id}`}
          className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-xs sm:max-w-sm relative transition hover:shadow-lg"
        >
          {/* Image with Date Badge */}
          <div className="relative">
            <GlobalSwiper>
              {images?.map((item) => (
                <SwiperSlide key={item.id}>
                  <img
                    src={`${item.image_path}`}
                    alt="listing"
                    className="w-full h-40 sm:h-44 object-cover rounded-xl"
                  />
                </SwiperSlide>
              ))}
            </GlobalSwiper>

            <div
              className="absolute z-[9999] top-0 bg-sky-400 text-textWhiteColor rounded-tl-xl text-sm font-semibold px-8 py-2 shadow-md opacity-95"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 10px) 0, 85% 50%, calc(100% - 10px) 100%, 0 100%)",
              }}
            >
              {price} {t("currency")}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-1">
            <h3 className="text-blueSiteHover font-bold text-lg">{price} {t('currency')}</h3>
            <p className="text-sm text-subTitleColor">{category?.name}</p>
            <div className="flex items-center text-xs text-textColor mt-1">
              <FaMapMarkerAlt className="mr-1 text-textColor" />
              <span>{location}</span>
            </div>
          </div>
        </Link>{" "}
      </motion.div>
    </Tilt>
  );
};

export default ListingCard;

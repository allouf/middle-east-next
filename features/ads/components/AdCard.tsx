"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Ad } from "../types/type";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Clock, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import useFavoriteAds from "../hooks/useFavoriteAds";
// Import Swiper styles
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { getCountryNameByCode } from '@/shared/utils/locationApi';
import { MdLocationOn } from "react-icons/md";


interface AdCardProps {
  ad: Ad;
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const { t } = useTranslation();
  const { toggleFavorite, isFavorite, toggleLoading ,favoritesError } = useFavoriteAds();

  const {
    id,
    title,
    description,
    price,
    is_price_negotiable,
    is_free,
    condition,
    status,
    contact_method,
    phone,
    show_phone,
    images,
    views_count,
    published_at,
    expires_at,
    renewed_at,
    attributes,
    is_owner,
    can_renew,
    is_favorited = false,
    favorites_count,
    user: seller,
    category,
    subcategory,
    country_code,
    region,
    created_at,
    updated_at,
  } = ad;

  const [countryName, setCountryName] = useState<string>('-');
  useEffect(() => {
    const load = async () => {
      const name = await getCountryNameByCode(country_code);
      setCountryName(name);
    };

    load();
  }, [country_code]);

  const displayImages = images.length > 0 ? images : ["/dummy/prod21.png"];

  const getBadgeInfo = () => {
    if (is_free) {
      return { style: "bg-blueIcons text-white", label: t("usedMarket.filters.free") || "FREE" };
    }
    if (is_price_negotiable) {
      return { style: "bg-emerald-500 text-white", label: t("usedMarket.filters.negotiable") || "NEGOTIABLE" };
    }
    return { style: "", label: "" };
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString();
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  const getTimeAgo = (publishedAt: string) => {
    const publishedDate = new Date(publishedAt);
    const now = new Date();
    const diffInMs = now.getTime() - publishedDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays >= 14) {
      const weeks = Math.floor(diffInDays / 7);
      return t('common.timeAgo.week_other', { count: weeks, defaultValue: `${weeks} weeks ago` });
    } else if (diffInDays > 0) {
      return t('common.timeAgo.day_other', { count: diffInDays, defaultValue: `${diffInDays} days ago` });
    } else {
      return t('common.timeAgo.today', { defaultValue: 'Today' });
    }
  };


  return (
    <div
      className="relative rounded-[40px] px-5 pt-5 pb-2 group hover:shadow-lg transition-all duration-300"
      style={{
        background:
          "linear-gradient(161.9deg, rgba(53, 54, 53, 0.0476) -2.97%, rgba(255, 255, 255, 0.068) 120.88%)",
        boxShadow:
          "-34.98px 34.98px 34.98px 0px #FFFFFF11 inset, 34.98px -34.98px 34.98px 0px #25252511 inset",
        backdropFilter: "blur(84.6535415649414px)",
      }}
    >
      {/* Price and Badge Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          {!is_free && <span className="text-blueSite font-bold text-lg">
            ${formatPrice(price)}
          </span>}
        </div>
        {/* Badge */}
        {(is_free || is_price_negotiable) && (
          <div
            className={`${getBadgeInfo().style} text-xs font-semibold px-3 py-1 rounded-md w-fit`}
          >
            {getBadgeInfo().label}
          </div>
        )}
      </div>
      {/* Location and Time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 text-subTitleColor text-xs">
          <MdLocationOn size={20} />
          <span>{countryName} {countryName && ","} {region}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Clock className="size-3" /> <span>{getTimeAgo(published_at)}</span>
        </div>
      </div>

      {/* Product Image / Carousel */}
      <div className="relative w-full h-[180px] bg-gray-50 rounded-lg overflow-hidden mb-3 group/image">
        {displayImages.length > 1 ? (
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: `.prev-${id}`,
              nextEl: `.next-${id}`,
            }}
            loop={true}
            className="w-full h-full"
          >
            {displayImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Link href={`/ads/${id}`} >
                    <Image
                      src={img || "/dummy/prod21.png"}
                      alt={`${title} - ${index + 1}`}
                      fill
                      className="object-contain transition-all duration-300 "
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/dummy/prod21.png";
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-[#35363533] pointer-events-none" />
                  </Link>
                </div>
              </SwiperSlide>
            ))}

            {/* Custom Navigation Arrows */}
            <button
              className={`prev-${id} absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className={`next-${id} absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white`}
            >
              <ChevronRight size={18} />
            </button>
          </Swiper>
        ) : (
          <Link href={`/ads/${id}`} >
            <Image
              src={displayImages[0] || "/dummy/prod21.png"}
              alt={title}
              fill
              className="object-contain transition-all duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/dummy/prod21.png";
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-[#35363533] pointer-events-none" />
          </Link>
        )}

        {/* Hover Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2  transition-opacity z-20">
          <button
            className={`p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition ${toggleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => toggleFavorite(id)}
            disabled={toggleLoading}
          >
            {isFavorite(id) ? (
              <FaHeart className="text-red-500 text-sm" />
            ) : (
              <FaRegHeart className="text-gray-600 text-sm" />
            )}
          </button>
          {/* <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition">
            <IoIosGitCompare className="text-gray-600 text-sm" />
          </button> */}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm md:text-base font-medium text-subTitleColor line-clamp-2 min-h-[40px] mb-2">
        {title}
      </h3>

      {/* Category and Condition Tags */}
      <div className="flex items-center justify-between gap-1 mb-3">
        <div >
          <span className="flex items-center gap-2 text-xs md:text-sm px-2 py-1 rounded">
            <svg
              className="size-4"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.56531 0H3.54736C1.2214 0 0 1.22129 0 3.53642V5.55419C0 7.86933 1.2214 9.09061 3.53674 9.09061H5.55469C7.87003 9.09061 9.09143 7.86933 9.09143 5.55419V3.53642C9.10205 1.22129 7.88065 0 5.56531 0Z"
                fill="#00664F"
              />
              <path
                opacity="0.4"
                d="M17.7041 0H15.6862C13.3708 0 12.1494 1.22129 12.1494 3.53642V5.55419C12.1494 7.86933 13.3708 9.09061 15.6862 9.09061H17.7041C20.0194 9.09061 21.2408 7.86933 21.2408 5.55419V3.53642C21.2408 1.22129 20.0194 0 17.7041 0Z"
                fill="#00664F"
              />
              <path
                d="M17.7041 12.1387H15.6862C13.3708 12.1387 12.1494 13.36 12.1494 15.6751V17.6929C12.1494 20.008 13.3708 21.2293 15.6862 21.2293H17.7041C20.0194 21.2293 21.2408 20.008 21.2408 17.6929V15.6751C21.2408 13.36 20.0194 12.1387 17.7041 12.1387Z"
                fill="#00664F"
              />
              <path
                opacity="0.4"
                d="M5.56531 12.1387H3.54736C1.2214 12.1387 0 13.36 0 15.6751V17.6929C0 20.0186 1.2214 21.2399 3.53674 21.2399H5.55469C7.87003 21.2399 9.09143 20.0186 9.09143 17.7035V15.6857C9.10205 13.36 7.88065 12.1387 5.56531 12.1387Z"
                fill="#00664F"
              />
            </svg>

            {category?.name}
          </span>
        </div>
        <div>
          <span className="flex items-center gap-2 text-xs md:text-sm px-2 py-1 rounded">
            <div className="w-2.5 h-2.5 rotate-45 border-2 border-blueSite inline-flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-blueSite" />
            </div>

            {condition === "new"
              ? t("usedMarket.filters.new", { defaultValue: 'New' })
              : t("usedMarket.filters.used", { defaultValue: 'Used' })}
          </span>
        </div>
        {views_count && (
          <div >
            <span className="flex items-center text-blueSite gap-2 text-xs md:text-sm ml-auto">
              <Eye className="h-4 w-4" />
              {formatViews(views_count)}
            </span>
          </div>
        )}
      </div>

      {/* Seller Info */}
      <div className="flex items-center gap-2 pt-2 border-t border-black/40">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={`${seller.photo}` || "/user.png"}
            alt={seller.name}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "";
            }}
          />
        </div>
        <div className="flex-1 flex-col">
          <div className="text-xs text-[#353635B2]">{t('common.listedBy', { defaultValue: 'Listed By' })}</div>
          <p className="text-base text-[#353635] ">
            {seller.name}
          </p>
        </div>
        <div className="flex  items-center gap-1 ms-auto">
          <button
            className="rounded-full p-2 bg-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-md"
            style={{
              boxShadow:
                "0px 3.1px 3.1px 0px #0000000D inset, 0px 0px 3.1px 0px #0000000D inset",
            }}
          >
            <svg
              className="size-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
                fill="#00664F"
              />
            </svg>
          </button>
          <button
            className="rounded-full p-2 bg-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-md"
            style={{
              boxShadow:
                "0px 3.1px 3.1px 0px #0000000D inset, 0px 0px 3.1px 0px #0000000D inset",
            }}
          >
            <svg
              className="size-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0366 5.31422L10.6856 6.47715C11.2713 7.52663 11.0362 8.90337 10.1137 9.82585C10.1137 9.82585 8.9949 10.9448 11.0235 12.9735C13.0515 15.0015 14.1712 13.8833 14.1712 13.8833C15.0937 12.9608 16.4704 12.7257 17.5199 13.3114L18.6828 13.9604C20.2676 14.8448 20.4547 17.0672 19.0618 18.4602C18.2248 19.2972 17.1994 19.9485 16.0659 19.9914C14.1578 20.0638 10.9173 19.5809 7.66672 16.3303C4.41616 13.0797 3.93324 9.83927 4.00558 7.93114C4.04855 6.79765 4.69983 5.77228 5.53684 4.93528C6.92979 3.54233 9.15219 3.72949 10.0366 5.31422Z"
                fill="#00664F"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdCard;

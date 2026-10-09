"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { Service } from "../types/type";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Clock, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { getCountryNameByCode } from '@/shared/utils/locationApi';
import { MdLocationOn } from "react-icons/md";
import { CategoryIcon } from "@/components/Icons/CategoryIcon";
import { VisaCardIcon } from "@/components/Icons/VisaCardIcon";
import { BookOpenIcon } from "@/components/Icons/BookOpenIcon";
import { CursorClicking } from "@/components/Icons/CursorClicking";

// Note: Create a useFavoriteServices hook later, currently stubbing it
const useFavoriteServices = () => ({
  toggleFavorite: (id: number) => console.log('Toggle favorite', id),
  isFavorite: (id: number) => false,
  toggleLoading: false,
  favoritesError: null
});

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { t } = useTranslation();
  const { toggleFavorite, isFavorite, toggleLoading, favoritesError } = useFavoriteServices();

  const {
    id,
    title,
    price,
    is_price_negotiable,
    images,
    views_count,
    published_at,
    user: provider,
    category,
    rating,
    reviews_count,
    provider_type,
    country_code,
    region,
    description,
    delivery_time
  } = service;

  const [countryName, setCountryName] = useState<string>('-');
  useEffect(() => {
    const load = async () => {
      if (country_code) {
        const name = await getCountryNameByCode(country_code);
        setCountryName(name);
      }
    };
    load();
  }, [country_code]);

  const displayImages = images && images.length > 0 ? images : ["/anonymous.png"];

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString();
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  const getTimeAgo = (publishedAt: string) => {
    const publishedDate = new Date(publishedAt);
    const now = new Date();
    const diffInMs = now.getTime() - publishedDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays >= 14) {
      const weeks = Math.floor(diffInDays / 7);
      return t('serviceCard.weeksAgo', { count: weeks });
    } else if (diffInDays > 0) {
      return t('serviceCard.daysAgo', { count: diffInDays });
    } else {
      return t('serviceCard.today');
    }
  };



  return (
    <div
      className="relative flex flex-col rounded-[40px] px-5 pt-5 pb-5 group hover:shadow-lg transition-all duration-300"
      style={{
        background: "linear-gradient(161.9deg, rgba(53, 54, 53, 0.0476) -2.97%, rgba(255, 255, 255, 0.068) 120.88%)",
        boxShadow: "-34.98px 34.98px 34.98px 0px #FFFFFF11 inset, 34.98px -34.98px 34.98px 0px #25252511 inset",
        backdropFilter: "blur(84.6535415649414px)",
      }}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <span className="text-blueSite font-bold text-lg">
            {t('serviceCard.priceTemplate', { price: formatPrice(price), defaultValue: `$${formatPrice(price)}` })}
          </span>
          {is_price_negotiable && (
             <span className="text-xs text-gray-500">{t('serviceCard.negotiable')}</span>
          )}
        </div>
      </div>

      {/* Location and Time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 text-subTitleColor text-xs">
          <MdLocationOn size={20} />
          <span>{countryName} {countryName && region && ","} {region}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          {delivery_time ? (
            <>
              <Clock className="size-3 text-blueSite" />
              <span className="text-blueSite">{t('serviceCard.deliveryTime', { defaultValue: 'Delivery Time' })} :</span>
              <span>{delivery_time.value} {t(`serviceCard.units.${delivery_time.unit}`, { defaultValue: delivery_time.unit })}</span>
            </>
          ) : (
            <>
              <Clock className="size-3" /> <span>{getTimeAgo(published_at)}</span>
            </>
          )}
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
                  <Link href={`/services/${id}`} >
                    <Image
                      src={img || "/anonymous.png"}
                      alt={`${title} - ${index + 1}`}
                      fill
                      className="object-contain transition-all duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("/anonymous.png")) {
                          target.src = "/anonymous.png";
                        }
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-[#35363533] pointer-events-none" />
                  </Link>
                </div>
              </SwiperSlide>
            ))}

            <button className={`prev-${id} absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white`}>
              <ChevronLeft size={18} />
            </button>
            <button className={`next-${id} absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white`}>
              <ChevronRight size={18} />
            </button>
          </Swiper>
        ) : (
          <Link href={`/services/${id}`} >
            <Image
              src={displayImages[0] || "/anonymous.png"}
              alt={title}
              fill
              className="object-contain transition-all duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("/anonymous.png")) {
                  target.src = "/anonymous.png";
                }
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-[#35363533] pointer-events-none" />
          </Link>
        )}

        {/* Hover Actions */}
        {/* <div className="absolute top-2 right-2 flex flex-col gap-2 transition-opacity z-20">
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
        </div> */}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-start  gap-2">
          {/* Title */}
          <h3 className="text-sm md:text-base font-medium text-subTitleColor line-clamp-2 min-h-[30px] hover:text-blueSite transition-colors uppercase">
            <Link href={`/services/${id}`}>{title}</Link>
          </h3>
          {typeof rating === 'number' && (
            <div className="flex items-center gap-1 text-[14px] text-gray-800 font-medium">
              <FaStar className="text-blueSite" size={15} />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 ">
          {description}
        </p>

        {/* Service Details (Category, Price, Type) */}
        <div className="flex items-center justify-between flex-wrap gap-x-1 gap-y-2 my-4 pb-2">
          {category && (
            <div className="flex items-center gap-2">
              <CategoryIcon className="w-[20px] h-[20px] flex-shrink-0" />
              <span className="text-[13px] md:text-[14px] text-black ">{category.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <VisaCardIcon className="w-[20px] h-[20px] flex-shrink-0" />
            <span className="text-[13px] md:text-[14px] text-black ">
              {t('serviceCard.priceTemplate', { price: formatPrice(price), defaultValue: `${formatPrice(price)}$` })}
            </span>
          </div>
          {service.service_type && (
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-[20px] h-[20px] flex-shrink-0" />
              <span className="text-[13px] md:text-[14px] text-black capitalize">
                {t(`serviceCard.serviceTypes.${service.service_type}`, { defaultValue: service.service_type.replace("_", " ") })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Provider Info */}
      <div className="flex items-center gap-2 pt-2 border-t border-black/10">
        <div className="relative min-w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          <Link href={`/services/provider_profile/${provider.id}`}>
          <Image
            src={provider.photo || "/anonymous.png"}
            alt={provider.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes("/anonymous.png")) {
                target.src = "/anonymous.png";
              }
            }}
          />
          </Link>
        </div>
        <div className="flex-1 min-w-0 flex-col">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">
            {provider_type ? t(`serviceCard.providerTypes.${provider_type}`, { defaultValue: provider_type }) : t('serviceCard.provider')}
          </div>
          <Link href={`/services/provider_profile/${provider.id}`}>
            <p className="text-sm font-medium text-[#353635] truncate" title={provider.name}>
              {provider.name}
            </p>
          </Link>
        </div>
        
        {/* Contact Quick Actions (Optional mirroring AdCard button shapes) */}
        <div className="flex items-center gap-1 ms-auto">
          <Link href={`/services/${id}`} passHref>
             <button className="text-[18px] font-semibold flex felx-row items-center gap-2 bg-blueSite hover:bg-blueSiteHover text-white px-4 py-1 rounded-[10px] transition-colors shadow-sm">
                <CursorClicking className="size-5" />
                {t('serviceCard.request')}
                
             </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import useFavoriteAds from "../hooks/useFavoriteAds";
import { Breadcrumb, Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import {
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaPhoneAlt, FaRegHeart, FaHeart } from "react-icons/fa";
import { TbMessageCircleFilled } from "react-icons/tb";
import { Ad } from "../types/type";
import AdCard from "./AdCard";
import { RiSendPlaneFill } from "react-icons/ri";
import AdReport from "./AdReport";
import { getCountryNameByCode } from "@/shared/utils/locationApi";
import { MdLocationOn } from "react-icons/md";
import useAdsFilterStore from "@/lib/store/useAdsFilterStore";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface AdDetailsProps {
  ad: Ad;
  similarAds?: Ad[];
}

import SafeHtml from "@/components/shared/SafeHtml";

const AdDetails: React.FC<AdDetailsProps> = ({ ad, similarAds = [] }) => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLocaleDirection();
  const { toggleFavorite, isPending, isFavorite } = useFavoriteAds(false);
  const carouselRef = useRef<CarouselRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);


  // Destructure ad data for easier access
  const {
    id,
    title,
    slug,
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
    is_favorited,
    favorites_count,
    user,
    category,
    subcategory,
    country_code,
    region,
    created_at,
    updated_at
  } = ad || {};
  const [showPhoneNumber, setShowPhoneNumber] = useState(show_phone);
  const [countryName, setCountryName] = useState<string>('-');
  const { setSelectedCategoryName, setSelectedSubCategoryName } = useAdsFilterStore();

  useEffect(() => {
    const load = async () => {
      const name = await getCountryNameByCode(country_code);
      setCountryName(name);
    };

    load();
  }, [country_code]);

  // Fallback data if some fields are missing
  const adImages = images?.length ? images : ["/dummy/prod1.png"];

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "USD", // Should be dynamic
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("US", ""); // Simple hack to remove code if needed
  };

  const handleImageClick = (index: number) => {
    setCurrentSlide(index);
    carouselRef.current?.goTo(index); // Moves the Ant Carousel to that slide
  };

  if (!ad) return null;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6 sm:px-6 sm:py-6 md:px-[80px] md:py-8 animate-in fade-in duration-500">
      {/* Breadcrumb - Mock for now */}
      <Breadcrumb
        className="mb-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
        separator={<span className="text-gray-400 text-xs">&gt;</span>}
        items={[
          {
            title: (
              <Link
                href={`/ads?category=${ad.category?.id || ''}`}
                className="hover:!text-[#00664F] transition-colors"
                onClick={() => {
                  setSelectedCategoryName(ad.category?.name ?? null);
                  setSelectedSubCategoryName(null);
                }}
              >
                {ad.category?.name || ""}
              </Link>
            ),
          },
          {
            title: (
              <Link
                href={`/ads?category=${ad.category?.id || ''}&sub_category=${ad.subcategory?.id || ''}`}
                className="hover:!text-[#00664F] transition-colors"
                onClick={()=>{
                   setSelectedCategoryName(ad.category?.name ?? null);
                  setSelectedSubCategoryName(ad.subcategory?.name ?? null);
                }}
              >
                {ad.subcategory?.name || ""}
              </Link>
            ),
          },
          {
            title: (
              <Link
                href={`/ads`}
                className="hover:!text-[#00664F] transition-colors"
              >
                {t("ads_feature.allAds") || "All Ads"}
              </Link>
            ),
          },
          {
            title: (
              <span className="text-[#00664F] font-semibold max-w-[200px] inline-block truncate underline">
                {t("ads_feature.detailsAds") || "Details Ads"}
              </span>
            ),
          },
        ]}
      />

      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-semibold text-subTitleColor">
            {title || "Untitled Ad"}
          </h1>
          <div className="flex items-center gap-2 text-subTitleColor">
            <MdLocationOn size={18} className="flex-shrink-0" />
            <span className="text-sm sm:text-base">{countryName} {countryName && ","} {region}</span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between bg-gray-50 rounded-lg p-3">
          <span className="text-sm text-blueSite">
            {t("categories.price") || "Price"}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-blueSite">
            {is_free ?
              (t("ads_feature.free") || "FREE") :
              `${Number(price || 0).toLocaleString()} $`
            }
          </span>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mb-12">
        <div className="grid grid-cols-1 gap-4 pb-5 border-b border-[#353635]">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide border border-[#353635] rounded-xl">
              {adImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleImageClick(idx)}
                  className={`relative w-24 h-16 md:w-32 md:h-20 aspect-video flex-shrink-0 rounded-xl overflow-hidden transition-all after:absolute after:inset-0 after:transition-all z-10 ${currentSlide === idx
                    ? "after:bg-transparent shadow-md"
                    : "after:bg-[#0A0A0A]/50"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          {/* Main Image */}
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden group -mx-2">
            <Carousel
              ref={carouselRef}
              dots={false} // Hiding dots since we have thumbnails
              infinite={images.length > 2} // Infinite only if we have enough items
              slidesToShow={2} // Show two items
              slidesToScroll={1}
              responsive={[
                {
                  breakpoint: 768, // On mobile (below 768px)
                  settings: {
                    slidesToShow: 1, // Show only one item
                    centerMode: false,
                  },
                },
              ]}
              afterChange={(current) => setCurrentSlide(current)}
            >
              {images.map((img, index) => (
                <div key={index} className="px-2">
                  <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-[#F5F5F5] rounded-xl overflow-hidden">
                    <Image
                      src={img}
                      alt={ad.title}
                      fill
                      priority={index === 0}
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          {/* Counter with Zero Padding */}
          <span className="text-lg font-semibold text-[#338572]">
            {String(currentSlide + 1).padStart(2, "0")}{" "}
            <span className="text-[#232323]">
              {t("updateProduct.preview.of") || "of"}{" "}
              {String(images.length).padStart(2, "0")}
            </span>
          </span>

          {/* Bottom Navigation Controls */}
          {images.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => carouselRef.current?.prev()}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#323232] text-[#323232] bg-white hover:bg-[#F0F7F5] transition-all active:scale-90"
                aria-label="Previous image"
              >
               {isRTL ?<FaArrowRight size={16} />: <FaArrowLeft size={16} />}

              </button>
              <button
                type="button"
                onClick={() => carouselRef.current?.next()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#323232] text-white hover:bg-[#2a2a2a] transition-all active:scale-90 shadow-md"
                aria-label="Next image"
              >
                {isRTL?<FaArrowLeft size={16} />: <FaArrowRight size={16} />}

              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Details & Description */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <div>
            <h2 className="text-xl text-[#1A1C1A] mb-6">
              {title}
            </h2>
            <h2 className="text-2xl font-bold text-[#1A1C1A] mb-4">
              {t("ads_feature.ad_details.description") || "Description"}
            </h2>
            <SafeHtml
              className="text-[#474947] leading-relaxed space-y-4 min-h-[100px]"
              html={description || "No description provided."}
              config="MODERATE"
            />
          </div>
          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Category */}
            <div className="flex justify-center md:justify-start border-e  border-[#232323] pb-3 sm:pb-0">
              <div className="flex flex-col gap-2 min-w-[100px] py-2">
                <div className="flex items-center gap-2 text-[#00664F]">
                  <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.33648 0H4.67631C1.61011 0 0 1.60996 0 4.66189V7.32183C0 10.3738 1.61011 11.9837 4.66231 11.9837H7.32248C10.3747 11.9837 11.9848 10.3738 11.9848 7.32183V4.66189C11.9988 1.60996 10.3887 0 7.33648 0Z" fill="#00664F" />
                    <path opacity="0.4" d="M23.3376 0H20.6774C17.6252 0 16.0151 1.60996 16.0151 4.66189V7.32183C16.0151 10.3738 17.6252 11.9837 20.6774 11.9837H23.3376C26.3898 11.9837 27.9999 10.3738 27.9999 7.32183V4.66189C27.9999 1.60996 26.3898 0 23.3376 0Z" fill="#00664F" />
                    <path d="M23.3376 16.002H20.6774C17.6252 16.002 16.0151 17.6119 16.0151 20.6638V23.3238C16.0151 26.3757 17.6252 27.9857 20.6774 27.9857H23.3376C26.3898 27.9857 27.9999 26.3757 27.9999 23.3238V20.6638C27.9999 17.6119 26.3898 16.002 23.3376 16.002Z" fill="#00664F" />
                    <path opacity="0.4" d="M7.33648 16.002H4.67631C1.61011 16.002 0 17.6119 0 20.6638V23.3238C0 26.3897 1.61011 27.9997 4.66231 27.9997H7.32248C10.3747 27.9997 11.9848 26.3897 11.9848 23.3378V20.6778C11.9988 17.6119 10.3887 16.002 7.33648 16.002Z" fill="#00664F" />
                  </svg>
                  <span className="text-[#323232]">
                    {t("ads_feature.ad_details.category") || "Category"} :
                  </span>
                </div>
                <span className="font-semibold text-[#323232]">
                  {category?.name || "General"}
                </span>
              </div>
            </div>

            {/* Condition */}
            <div className="flex justify-center sm:border-b-0 sm:border-e border-[#232323] pb-3 sm:pb-0">
              <div className="flex flex-col gap-2 min-w-[100px] py-2">
                <div className="flex items-center gap-2 text-[#00664F]">
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8.00001L8 16L16 24L24 16L16 8.00001Z" fill="#00664F" />
                    <path d="M16 30C15.7264 30.0005 15.4554 29.9469 15.2025 29.8423C14.9497 29.7377 14.7201 29.5842 14.5268 29.3906L2.60936 17.4732C2.21915 17.0822 2 16.5523 2 16C2 15.4476 2.21915 14.9177 2.60936 14.5268L14.5268 2.60936C14.9177 2.21915 15.4476 2 16 2C16.5523 2 17.0822 2.21915 17.4732 2.60936L29.3906 14.5268C29.7808 14.9177 29.9999 15.4476 29.9999 16C29.9999 16.5523 29.7808 17.0822 29.3906 17.4732L17.4732 29.3906C17.2799 29.5842 17.0502 29.7377 16.7974 29.8423C16.5446 29.9469 16.2736 30.0005 16 30ZM16 3.99916C15.9778 3.99919 15.9566 4.00796 15.9409 4.02356L4.02356 15.9409C4.00794 15.9566 3.99917 15.9778 3.99917 16C3.99917 16.0221 4.00794 16.0434 4.02356 16.0591L15.9409 27.9764C15.9566 27.9919 15.9778 28.0006 16 28.0006C16.0221 28.0006 16.0433 27.9919 16.0591 27.9764L27.9764 16.0591C27.992 16.0434 28.0007 16.0221 28.0007 16C28.0007 15.9778 27.992 15.9566 27.9764 15.9409L16.0591 4.02356C16.0433 4.00796 16.0221 3.99919 16 3.99916Z" fill="#00664F" />
                  </svg>
                  <span className="text-[#323232]">
                    {t("ads_feature.ad_details.condition") || "Condition"} :
                  </span>
                </div>
                <span className="font-semibold text-[#323232]">
                  {condition === "new"
                    ? t("ads_feature.condition.new")
                    : t("ads_feature.condition.used") || "Used"}
                </span>
              </div>
            </div>

            {/* Case / Type */}
            <div className="flex justify-center border-e border-[#232323] pb-3 sm:pb-0">
              <div className="flex flex-col gap-2 min-w-[100px] py-2">
                <div className="flex items-center gap-2 text-[#00664F]">
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5039 2.13622C16.1925 1.95459 15.8075 1.95459 15.4961 2.13622L4 8.8423L16 15.8423L28 8.8423L16.5039 2.13622Z" fill="#00664F" />
                    <path d="M29 10.5744L17 17.5744V29.5744L28.5039 22.8638C28.8111 22.6846 29 22.3557 29 22V10.5744Z" fill="#00664F" />
                    <path d="M15 29.5744V17.5744L3 10.5744V22C3 22.3557 3.18891 22.6846 3.49613 22.8638L15 29.5744Z" fill="#00664F" />
                  </svg>
                  <span className="text-[#323232]">
                    {t("ads_feature.ad_details.case") || "Case"} :
                  </span>
                </div>
                <span className="font-semibold text-[#323232]">
                  {is_price_negotiable
                    ? t("ads_feature.badges.negotiable")
                    : is_free
                      ? t("ads_feature.free") || "Free"
                      : "Fixed Price"}
                </span>
              </div>
            </div>

            {/* Views */}
            <div className="flex justify-center pb-3 sm:pb-0">
              <div className="flex flex-col gap-2 min-w-[100px] py-2">
                <div className="flex items-center gap-2 text-[#00664F]">
                  <svg width="18" height="18" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M29.6441 16.1701C27.2901 20.989 21.394 25.6023 16.1688 25.6023C10.9435 25.6023 5.04744 20.989 2.69409 16.1695" fill="#00664F" fillOpacity="0.2" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M29.6441 16.1701C27.2901 11.3511 21.395 6.7373 16.1697 6.7373C10.9444 6.7373 5.04744 11.35 2.69409 16.1695" fill="#00664F" fillOpacity="0.2" />
                    <path d="M20.2116 16.1698C20.2116 18.4024 18.4017 20.2123 16.1691 20.2123C13.9365 20.2123 12.1266 18.4024 12.1266 16.1698C12.1266 13.9372 13.9365 12.1273 16.1691 12.1273C18.4017 12.1273 20.2116 13.9372 20.2116 16.1698Z" fill="#00664F" fillOpacity="0.2" />
                    <path d="M29.6441 16.1701C27.2901 20.989 21.394 25.6023 16.1688 25.6023C10.9435 25.6023 5.04744 20.989 2.69409 16.1695C5.04744 11.35 10.9444 6.7373 16.1697 6.7373C21.395 6.7373 27.2901 11.3511 29.6441 16.1701ZM20.2116 16.1698C20.2116 18.4024 18.4017 20.2123 16.1691 20.2123C13.9365 20.2123 12.1266 18.4024 12.1266 16.1698C12.1266 13.9372 13.9365 12.1273 16.1691 12.1273C18.4017 12.1273 20.2116 13.9372 20.2116 16.1698Z" stroke="#00664F" strokeWidth="1.30325" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[#323232]">
                    {t("ads_feature.ad_details.viewer") || "Viewer"} :
                  </span>
                </div>
                <span className="font-semibold text-[#323232]">
                  {(views_count || 0).toLocaleString()}{" "}
                  {t("ads_feature.ad_details.viewer")?.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Seller Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 sm:top-8 lg:top-40 bg-[#E6F0ED]/30 border border-[#00664F] rounded-2xl py-4 px-4 sm:px-6 shadow-sm overflow-hidden"
            style={{ background: "linear-gradient(-45deg, #00664F66 0%, #FFFFFF 20%, #FFFFFF 80%, #00664F66 100%)" }}>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00664F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <Image
                    src={`${user.photo}` || "/user.png"}
                    alt={user?.name || "Seller"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs text-[#474947] block mb-0.5">
                    {t("ads_feature.ad_details.listed_by") || "Listed By"}
                  </span>
                  <h3 className="font-bold text-lg text-[#1A1C1A]">
                    {user?.name || "Unknown User"}
                  </h3>
                </div>
              </div>
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => toggleFavorite(id)}
                  disabled={isPending(id)}
                  className="w-[44px] h-[44px] rounded-full bg-[#E6F0ED] flex items-center justify-center text-[#00664F] hover:bg-[#d4e4df] transition-colors disabled:opacity-50"
                >
                  {isFavorite(id) ? (
                    <FaHeart className="text-red-500 text-[20px]" />
                  ) : (
                    <FaRegHeart className="text-gray-600 text-[20px]" />
                  )}
                </button>
                {ad && <AdReport advertisement_id={ad.id} />}
              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#00664F] text-[#00664F] py-3 px-4 rounded-xl font-semibold hover:bg-[#E6F0ED] transition-colors text-sm">
                <FaPhoneAlt size={16} />
                {t("ads_feature.ad_details.call") || "Call"}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#00664F] text-[#00664F] py-3 px-4 rounded-xl font-semibold hover:bg-[#E6F0ED] transition-colors text-sm">
                <TbMessageCircleFilled size={16} />
                {t("ads_feature.ad_details.chat") || "Chat"}
              </button>
            </div>

            {(
              <button
                className="w-full text-lg flex items-center justify-center gap-2 text-[#474947] py-2 hover:text-[#00664F] transition-colors mb-2"
                onClick={() => setShowPhoneNumber(!showPhoneNumber)}
              >
                <FaPhoneAlt size={18} />
                <span className="underline underline-offset-2">
                  {showPhoneNumber ? (phone || "No Number") : (t("ads_feature.ad_details.showPhone") || "Show Number")}
                </span>
              </button>
            )}

            <button className="w-full text-lg flex items-center justify-center gap-2 text-[#474947] py-2 hover:text-[#00664F] transition-colors mb-6">
              <RiSendPlaneFill size={20} />
              <span className="underline underline-offset-2">
                {t("ads_feature.ad_details.share") || "Share this Ads"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Similar Ads */}
      <div className="mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#1A1C1A]">
            {t("ads_feature.ad_details.similar_ads") || "The Similar Ads :"}
          </h2>
          <button
            onClick={() => {
              setSelectedCategoryName(ad.category?.name ?? null);
              setSelectedSubCategoryName(ad.subcategory?.name ?? null);
            }}>
            <Link
              href={`/ads?category=${ad.category?.id || ''}&sub_category=${ad.subcategory?.id || ''}`}
              className="text-[#00664F] font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              {t("ads_feature.ad_details.view_all") || "View All"}{" "}
              <ChevronRight size={18} />
            </Link>
          </button>
        </div>

        {/* Using Ant Design Carousel or custom grid */}
        {similarAds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {similarAds.slice(0, 4).map((item) => (
              <AdCard key={item.id} ad={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No similar ads found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdDetails;

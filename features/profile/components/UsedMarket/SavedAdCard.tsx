"use client";

import React from "react";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { useTranslation } from "@/lib/i18n/useTranslation";

import Link from "next/link";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface SavedAdCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  category?: string;
  viewsCount?: number;
  isNegotiable?: boolean;
  condition?: string;
  toggleFavorite: (id: number) => Promise<void>;
  isPending: (id: number) => boolean;
}

const SavedAdCard: React.FC<SavedAdCardProps> = ({
  id,
  title,
  description,
  image,
  category,
  viewsCount,
  isNegotiable,
  condition,
  toggleFavorite,
  isPending,
}) => {
  const { t } = useTranslation();
  const {isRTL} = useLocaleDirection();

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-5 bg-[#FBFBFB] rounded-[30px] border border-gray-100 hover:shadow-sm transition-shadow">
      {/* Image */}
      <div className="w-full h-[100px] lg:w-[153px] md:h-[133px]   bg-white rounded-xl border border-blueSite flex items-center justify-center shrink-0 overflow-hidden relative ">
        <Image
          src={image || "/assets/images/placeholder.png"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        
          <div className="flex flex-col justify-between" >
          {/* Title */}
          <h3 className="font-semibold text-subTitleColor text-sm md:text-[18px] line-clamp-1 mb-3">
            {title}
          </h3>

          {/* Description */}
          <p className="text-textColor text-[16px] line-clamp-1 mb-3">
            {description}
          </p>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-[19px] font-normal text-blueSite">
            {category && (
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.33648 0H4.67631C1.61011 0 0 1.60996 0 4.66189V7.32183C0 10.3738 1.61011 11.9837 4.66231 11.9837H7.32248C10.3747 11.9837 11.9848 10.3738 11.9848 7.32183V4.66189C11.9988 1.60996 10.3887 0 7.33648 0Z" fill="#00664F"/>
                    <path opacity="0.4" d="M23.3376 0H20.6774C17.6252 0 16.0151 1.60996 16.0151 4.66189V7.32183C16.0151 10.3738 17.6252 11.9837 20.6774 11.9837H23.3376C26.3898 11.9837 27.9999 10.3738 27.9999 7.32183V4.66189C27.9999 1.60996 26.3898 0 23.3376 0Z" fill="#00664F"/>
                    <path d="M23.3376 16.002H20.6774C17.6252 16.002 16.0151 17.6119 16.0151 20.6638V23.3238C16.0151 26.3757 17.6252 27.9857 20.6774 27.9857H23.3376C26.3898 27.9857 27.9999 26.3757 27.9999 23.3238V20.6638C27.9999 17.6119 26.3898 16.002 23.3376 16.002Z" fill="#00664F"/>
                    <path opacity="0.4" d="M7.33648 16.002H4.67631C1.61011 16.002 0 17.6119 0 20.6638V23.3238C0 26.3897 1.61011 27.9997 4.66231 27.9997H7.32248C10.3747 27.9997 11.9848 26.3897 11.9848 23.3378V20.6778C11.9988 17.6119 10.3887 16.002 7.33648 16.002Z" fill="#00664F"/>
                  </svg>
                <span>{category}</span>
              </div>
            )}
            {viewsCount !== undefined && (
              <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M29.6441 16.1701C27.2901 20.989 21.394 25.6023 16.1688 25.6023C10.9435 25.6023 5.04744 20.989 2.69409 16.1695" fill="#00664F" fillOpacity="0.2"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M29.6441 16.1701C27.2901 11.3511 21.395 6.7373 16.1697 6.7373C10.9444 6.7373 5.04744 11.35 2.69409 16.1695" fill="#00664F" fillOpacity="0.2"/>
                    <path d="M20.2116 16.1698C20.2116 18.4024 18.4017 20.2123 16.1691 20.2123C13.9365 20.2123 12.1266 18.4024 12.1266 16.1698C12.1266 13.9372 13.9365 12.1273 16.1691 12.1273C18.4017 12.1273 20.2116 13.9372 20.2116 16.1698Z" fill="#00664F" fillOpacity="0.2"/>
                    <path d="M29.6441 16.1701C27.2901 20.989 21.394 25.6023 16.1688 25.6023C10.9435 25.6023 5.04744 20.989 2.69409 16.1695C5.04744 11.35 10.9444 6.7373 16.1697 6.7373C21.395 6.7373 27.2901 11.3511 29.6441 16.1701ZM20.2116 16.1698C20.2116 18.4024 18.4017 20.2123 16.1691 20.2123C13.9365 20.2123 12.1266 18.4024 12.1266 16.1698C12.1266 13.9372 13.9365 12.1273 16.1691 12.1273C18.4017 12.1273 20.2116 13.9372 20.2116 16.1698Z" stroke="#00664F" strokeWidth="1.30325" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                <span className="first-letter:uppercase">
                  {viewsCount} {t("ads.viewers")}
                </span>
              </div>
            )}
            {isNegotiable && (
              <div className="flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="#00664F"/>
                  <path d="M12 22.5C11.7948 22.5003 11.5915 22.4602 11.4019 22.3817C11.2123 22.3033 11.04 22.1881 10.8951 22.0429L1.95702 13.1049C1.66436 12.8116 1.5 12.4143 1.5 12C1.5 11.5857 1.66436 11.1883 1.95702 10.8951L10.8951 1.95702C11.1883 1.66436 11.5857 1.5 12 1.5C12.4143 1.5 12.8116 1.66436 13.1049 1.95702L22.0429 10.8951C22.3356 11.1883 22.4999 11.5857 22.4999 12C22.4999 12.4143 22.3356 12.8116 22.0429 13.1049L13.1049 22.0429C12.9599 22.1881 12.7877 22.3033 12.598 22.3817C12.4084 22.4602 12.2052 22.5003 12 22.5ZM12 2.99937C11.9834 2.9994 11.9674 3.00597 11.9556 3.01767L3.01767 11.9556C3.00595 11.9674 2.99938 11.9834 2.99938 12C2.99938 12.0166 3.00595 12.0325 3.01767 12.0443L11.9556 20.9823C11.9675 20.9939 11.9834 21.0004 12 21.0004C12.0166 21.0004 12.0325 20.9939 12.0443 20.9823L20.9823 12.0443C20.994 12.0325 21.0006 12.0166 21.0006 12C21.0006 11.9834 20.994 11.9674 20.9823 11.9556L12.0443 3.01767C12.0325 3.00597 12.0166 2.9994 12 2.99937Z" fill="#00664F"/>
                  </svg>
                <span>{t("ads.negotiable")}</span>
              </div>
            )}
            {condition && (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1.61011L21 6.80626V17.1986L12 22.3947L3 17.1986V6.80626L12 1.61011ZM8.99995 11.3094L9 18.3533L11 19.5081V12.4641L8.99995 11.3094ZM5 9.00011V16.0439L6.99998 17.1986V10.1548L5 9.00011ZM15.9371 6.19256L10.0506 9.60675L12 10.7322L17.9 7.32588L15.9371 6.19256ZM12 3.91951L6.1 7.32588L8.05289 8.45334L13.9394 5.0392L12 3.91951Z"
                    fill="#00664F"
                  />
                </svg>
                <span className="first-letter:uppercase">
                  {condition === "new" ? t("usedMarket.filters.new") : t("usedMarket.filters.used")}
                </span>
              </div>
            )}
          </div>
   
      </div>

      {/* Right Side - Saved & Actions */}
      <div className="flex lg:flex-col flex-row lg:items-end items-center max-lg:mt-3 justify-around gap-2 shrink-0 min-w-[120px]">
        {/* UnSave Button */}
        <button
          onClick={() => toggleFavorite(id)}
          disabled={isPending(id)}
          className="flex items-center gap-1.5 text-[#CA1417] text-[16px] font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          <FaRegHeart className="w-3.5 h-3.5" />
          <span className="underline">{t("common.unSave")}</span>
        </button>

        {/* See Details Button */}
        <Link
          href={`/ads/${id}`}
          className="bg-blueSite hover:bg-blueSiteHover text-white text-[16px] font-medium px-5 py-2 rounded-[10px] transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          {t("common.seeDetails")}
        { isRTL?<FaArrowLeftLong/>:<FaArrowRightLong />}
        </Link>
      </div>
    </div>
  );
};

export default SavedAdCard;

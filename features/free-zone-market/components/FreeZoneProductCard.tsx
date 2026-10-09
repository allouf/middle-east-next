"use client";

import React from 'react';
import Image from 'next/image';
import { Rate, Button } from 'antd';
import { EnvironmentOutlined, ShopOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface FreeZoneProductCardProps {
  id: number | string;
  storeId?: number | string;
  image: string;
  category: string;
  title: string;
  company: string;
  available: number;
  country: string;
  price: number;
  rating: number;
  isNew?: boolean;
}

const FreeZoneProductCard: React.FC<FreeZoneProductCardProps> = ({
  id,
  storeId,
  image,
  category,
  title,
  company,
  available,
  country,
  price,
  rating,
  isNew
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params?.locale || 'en';

  const productUrl = `/${locale}/products/${id}`;
  const storeUrl = storeId ? `/${locale}/stores/${storeId}` : '#';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <Link href={productUrl} className="relative rounded-lg overflow-hidden aspect-[3/2.8] w-full block">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-[#EF4444] text-white text-[10px] font-medium px-3 py-1 rounded-full uppercase">
              {t('freeZoneMarket.product.new')}
            </span>
          )}
          <span className="bg-blueSite text-white text-[10px] font-medium px-3 py-1 rounded-full flex items-center gap-1 flex items-center">
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.475 6.775L6.3 3.95L5.5875 3.2375L3.475 5.35L2.425 4.3L1.7125 5.0125L3.475 6.775ZM4 10C2.84167 9.70833 1.88542 9.04375 1.13125 8.00625C0.377083 6.96875 0 5.81667 0 4.55V1.5L4 0L8 1.5V4.55C8 5.81667 7.62292 6.96875 6.86875 8.00625C6.11458 9.04375 5.15833 9.70833 4 10ZM4 8.95C4.86667 8.675 5.58333 8.125 6.15 7.3C6.71667 6.475 7 5.55833 7 4.55V2.1875L4 1.0625L1 2.1875V4.55C1 5.55833 1.28333 6.475 1.85 7.3C2.41667 8.125 3.13333 8.675 4 8.95Z" fill="white" />
            </svg>

            {t('freeZoneMarket.product.badge')}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] text-[#747474] uppercase font-bold tracking-wider">
            {category}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-blueSite text-[#323232]"><svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z" fill="#00664F" />
            </svg>
            </span>
            <span className="text-md font-bold text-gray-700">{rating}</span>
          </div>
        </div>

        <h3 className="text-[17px] font-bold text-[#323232] mb-2 line-clamp-2 hover:text-blueSite transition-colors">
          <Link href={productUrl}>{title}</Link>
        </h3>

        <div className="flex items-center gap-2 text-[#747474] text-md mb-2">
          <svg width="13" height="13" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10.5V2.33333H2.33333V0H8.16667V4.66667H10.5V10.5H5.83333V8.16667H4.66667V10.5H0ZM1.16667 9.33333H2.33333V8.16667H1.16667V9.33333ZM1.16667 7H2.33333V5.83333H1.16667V7ZM1.16667 4.66667H2.33333V3.5H1.16667V4.66667ZM3.5 7H4.66667V5.83333H3.5V7ZM3.5 4.66667H4.66667V3.5H3.5V4.66667ZM3.5 2.33333H4.66667V1.16667H3.5V2.33333ZM5.83333 7H7V5.83333H5.83333V7ZM5.83333 4.66667H7V3.5H5.83333V4.66667ZM5.83333 2.33333H7V1.16667H5.83333V2.33333ZM8.16667 9.33333H9.33333V8.16667H8.16667V9.33333ZM8.16667 7H9.33333V5.83333H8.16667V7Z" fill="#747474" />
          </svg>
          <Link href={storeUrl} className="font-somar-medium hover:text-blueSite hover:underline transition-colors block truncate max-w-[150px]">
            {company}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-3">
          <div>
            <p className="text-[10px] text-[#747474] uppercase font-bold tracking-tight">{t('freeZoneMarket.product.available')}</p>
            <p className="text-md font-medium text-[#323232]">{available} {t('freeZoneMarket.product.units')}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#747474] uppercase font-bold tracking-tight">{t('freeZoneMarket.product.country')}</p>
            <div className="flex items-center gap-1">
              <span className="text-md font-medium text-[#323232]">{country}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex justify-between items-center -mx-4 -mb-4 p-4">
          <span className="text-lg font-extrabold text-blueSite">
            ${price.toFixed(2)}
          </span>
          <Button
            href={productUrl}
            className="rounded-lg px-4 py-1.5 bg-[#00664F1A] border-none text-blueSite hover:bg-blueSite hover:text-white font-bold text-md"
          >
            {t('freeZoneMarket.product.viewDetails')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FreeZoneProductCard;

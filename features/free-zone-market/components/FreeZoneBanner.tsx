"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface FreeZoneBannerProps {
  locale: string;
}

const FreeZoneBanner: React.FC<FreeZoneBannerProps> = ({ locale }) => {
  const { t } = useTranslation();
  const isRtl = locale === 'ar';

  return (
    <div className={`relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden ${isRtl ? 'mb-0' : 'mb-0'}`}>
      {/* Background Image */}
      <div className={`absolute w-full h-full  ${isRtl ? '-scale-x-100' : ''}`}>
        <Image
          src="/freezone.webp"
          alt={t('freeZoneMarket.banner.title1')}
          fill
          className="object-cover"
          priority
        />
        {/* White Mask Overlay */}
        <div className={`absolute inset-0 bg-white/60 z-[1]`}></div>
      </div>

      {/* Content Overlay */}
      <div className={`!relative !z-50 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 max-w-7xl ${isRtl ? 'items-start text-right' : 'items-start text-left'}`}>
        <h1 className={`text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-blueSite font-expanded !leading-[1.2]`}>
          {t('freeZoneMarket.banner.title1')} <br />
          {t('freeZoneMarket.banner.title2')} <span className="opacity-30">{t('freeZoneMarket.banner.title3')}</span>
        </h1>
        <p className="text-gray-700 text-sm md:text-md font-somar max-w-xl leading-relaxed text-[#1A3A32]">
          {t('freeZoneMarket.banner.description')}
        </p>
      </div>

      {/* Decorative Element (match the green shape in the image) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none hidden md:block">
        {/* This would ideally be a specific SVG or image part, but fill handles the main visual */}
      </div>
    </div>
  );
};

export default FreeZoneBanner;

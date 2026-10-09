"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import GlowLight from '@/components/shered/GlowLight';

interface StoreImageProps {
  src: string | null;
  alt: string;
  fallbackType: 'logo' | 'cover';
  storeName: string;
  className?: string;
}

const StoreImage: React.FC<StoreImageProps> = ({ 
  src, 
  alt, 
  fallbackType, 
  storeName, 
  className = "" 
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (!src || imageError) {
    // Fallback for logo
    if (fallbackType === 'logo') {
      return (
        <div className={`w-full h-full bg-gray-300 flex items-center justify-center text-textColor text-2xl ${className}`}>
          {storeName?.[0]?.toUpperCase() || "S"}
        </div>
      );
    }
    
    // Fallback for cover
    return (
      <div className={`relative z-10 w-full h-full bg-[#323232] flex items-center justify-center overflow-hidden ${className}`}>
        <h1 className="text-textWhiteColor text-2xl md:text-3xl font-bold relative z-10">
          {storeName}
        </h1>

        <GlowLight
          color="#00664F"
          size="w-[200px] h-[200px]"
          opacity="opacity-100"
          blur="blur-[120px]"
          position="-top-24 -right-16"
         // offset="translate-x-1/3 -translate-y-1/3"
        />
        <GlowLight
          color="#00664F"
          size="w-[200px] h-[200px]"
          opacity="opacity-100"
          blur="blur-[120px]"
          position="bottom-0 start-0"
         // offset="-translate-x-1/3 translate-y-1/3"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      onError={handleImageError}
    />
  );
};

export default StoreImage;

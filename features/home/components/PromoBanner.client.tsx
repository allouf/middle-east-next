'use client';

import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import GlowLight from "@/components/shered/GlowLight";
import { PreOrderType } from "../type";
import Image from "next/image";

interface PromoBannerClientProps {
  preOrderData: PreOrderType;
  padding?:string
}
const PromoBannerClient: React.FC<PromoBannerClientProps> = ({ preOrderData,padding="p-4 md:p-10" }) => {
  const { t } = useTranslation();

  return (
    <div className={padding}>
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between bg-[#2d2d2d] rounded-3xl px-4 sm:px-10 py-2 md:py-0  text-textWhiteColor overflow-hidden gap-5 ">
        <GlowLight
          color="#00664F"
          size="w-[400px] sm:w-[600px] lg:w-[700px] h-[400px] sm:h-[600px] lg:h-[700px]"
          opacity="opacity-60"
          blur="blur-[160px] sm:blur-[180px]"
          position="bottom-0 left-1/4"
        />

        {/* Left Text */}
        <div className="flex flex-col space-y-3 text-center lg:text-left w-full lg:w-1/4">
          <h3 className="text-white font-semibold text-lg md:text-[32px]">
            {t("promoBanner.preOrder")}
          </h3>
          <p className="text-white text-sm md:text-base">
            {preOrderData.title || t("promoBanner.beTheFirst")}
          </p>
          <p className="text-gray-200 text-sm md:text-base">
            {t("promoBanner.from")} <span className="font-semibold">${preOrderData.price || 399}</span>
          </p>
        </div>

        {/* Middle Product Image */}
        {preOrderData.image && (
          <div className="relative flex justify-center items-end w-full lg:w-2/4 order-first lg:order-none">
            <div
              className="
        relative
        w-[260px] sm:w-[320px] md:w-[380px] xl:w-[450px]
        h-[160px] sm:h-[200px] md:h-[240px]
      "
            >
              <Image
                src={preOrderData.image || "/dummy/smartPhone.png"}
                alt={preOrderData.product_name || t("promoBanner.product")}
                fill
                sizes="
          (max-width: 640px) 260px,
          (max-width: 768px) 320px,
          (max-width: 1024px) 380px,
          450px
        "
                className="
          object-contain
          object-bottom
          z-20
        "
                priority
              />
            </div>
          </div>
        )}


        {/* Right Text + Button */}
        <div className="flex flex-col items-center lg:items-end text-center lg:text-right w-full lg:w-1/4 space-y-4 max-lg:pb-4">
          <div>
            <p className="text-white text-sm md:text-2xl font-bold leading-snug">
              {preOrderData.product_name || t("promoBanner.productName")}
            </p>
            <h2 className="text-white text-2xl sm:text-3xl font-light">
              {preOrderData.product_description || t("promoBanner.productDescription")}
            </h2>
          </div>
          {preOrderData.link ? (
            <a
              href={preOrderData.link}
              className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full px-6 py-2 text-sm sm:text-base font-medium transition-all inline-block"
            >
              {t("promoBanner.discoverNow")}
            </a>
          ) : (
            <button className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full px-6 py-2 text-sm sm:text-base font-medium transition-all">
              {t("promoBanner.discoverNow")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoBannerClient;

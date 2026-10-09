'use client';

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import HomeBannar from "@/assets/images/homeLastBannar.png"
import Link from "next/link";

const UsedMarketBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="p-4 md:p-10">
      <div className="relative rounded-2xl mx-auto overflow-hidden my-10 px-4 md:px-6 h-[400px] md:h-[500px]">

        {/* Background Image */}
        <div className="absolute inset-0 ">
          <Image
            src={HomeBannar}
            alt={t("usedMarket.backgroundAlt")}
            fill
            className="object-cover brightness-[0.6] blur-[1px]"
            priority
          />
        </div>

        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start text-white px-8 md:px-20 py-20 md:py-28 h-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-semibold leading-snug text-left"
          >
            {t("usedMarket.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-4 text-gray-100 text-base md:text-lg leading-relaxed"
          >
            {t("usedMarket.description")}
          </motion.p>

          <Link
          href={'/ads'}>
            <motion.button 
            
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="mt-8 bg-white text-blueBtn font-medium px-8 2xl:px-14 py-3 rounded-xl flex items-center gap-2 hover:bg-[#E6F0ED] transition-all shadow-sm"
            >
              {t("usedMarket.button")} <ArrowRight size={18} />
              {/* {t("usedMarket.comingSoon")} */}
            </motion.button>
           </Link>
        </div>
      </div>
    </section>
  );
};

export default UsedMarketBanner;

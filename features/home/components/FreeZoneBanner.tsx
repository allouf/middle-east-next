'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import FreeZoneBannar from "@/public/4.webp"
import Link from "next/link";

const FreeZoneBanner: React.FC = () => {
  const { t, locale } = useTranslation();
  const isRtl = locale === 'ar';

  return (
    <section className="p-4 md:p-10">
      <div className="relative rounded-[2rem] mx-auto overflow-hidden my-10 px-4 sm:px-8 md:px-12 h-auto min-h-[450px] md:min-h-[500px] flex items-center shadow-sm border border-gray-50">

        {/* Background Image - Positioned to the right as per reference */}
        <div className={`absolute inset-0 flex items-center pointer-events-none opacity-40 md:opacity-100 ${isRtl ? 'justify-start' : 'justify-end'}`}>
          <div className={`relative !w-full h-full ${isRtl ? '-scale-x-100' : ''}`}>
            <Image
              src={FreeZoneBannar}
              alt={t("freeZone")}
              fill
              className={`object-cover ${isRtl ? 'object-left' : 'object-right'}`}
              priority
            />
          </div>
          {/* Mask Overlay - Fades from the container background color */}
          <div className={`absolute inset-0 bg-gradient-to-r ${isRtl ? 'bg-gradient-to-l' : ''} from-[#f9f9f9] via-[#f9f9f9]/90 md:via-[#f9f9f9]/80 to-transparent z-[1]`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start max-w-2xl py-12 md:py-0">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 bg-[#00664F1A] px-3 md:px-4 py-1.5 rounded-full mb-4 md:mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-blueSite"></div>
            <span className="text-blueSite text-[10px] md:text-xs lg:text-sm font-bold tracking-wide uppercase">
              {t("homeFreeZone.badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.2] md:leading-[1.1] text-[#0F172A] mb-4 md:mb-6"
          >
            {t("homeFreeZone.title1")}
            <span className="block sm:inline text-[#378674]">
              {t("homeFreeZone.title2")}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[#475569] text-sm md:text-base lg:text-lg max-w-xl leading-relaxed mb-6 md:mb-10"
          >
            {t("homeFreeZone.description")}
          </motion.p>

          <Link
            href={'/free-zone'}>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#00604B] text-white font-semibold px-8 md:px-10 py-3 md:py-4 rounded-full flex items-center justify-center shadow-lg shadow-[#00604b20] hover:bg-[#004d3c] transition-all text-sm md:text-base"
            >
              {t("homeFreeZone.button")}
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FreeZoneBanner;

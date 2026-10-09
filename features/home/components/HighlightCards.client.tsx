'use client';

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

import Image from "next/image";
import GlowLight from "@/components/shered/GlowLight";

const HighlightCardsClient = ({banners}) => {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();



  return (
    <section className="mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 px-4 sm:px-10">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className={`${banner.bg} rounded-2xl flex flex-col ${banner.reverse ? "md:flex-row-reverse" : "md:flex-row"
              } items-center justify-between p-8 md:p-12 relative overflow-hidden`}
          >
            <div className={`space-y-4 max-w-sm ${banner.textColor}`}>
              <span
                className={`${banner.tagBg} text-xs font-semibold px-3 py-1 rounded-sm inline-block uppercase tracking-wide`}
              >
                {banner.tag}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold leading-snug">
                {banner.title}
              </h3>
              <p className="text-sm opacity-80">{banner.description}</p>
              <button
                className={`${banner.btnBg} font-medium px-6 py-2.5 rounded-md flex items-center gap-2 transition-all`}
              >
                {t("highlightCards.shopNow")} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            </div>

            {banner.image && (
              <div className="mt-6 md:mt-0 flex justify-center md:justify-end">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  width={160}
                  height={160}
                  className="w-40 md:w-56 object-contain drop-shadow-xl"
                />
              </div>
            )}

            {banner.bg === "bg-[#2D2D2D]" && (
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-blueSite/30 blur-[80px] rounded-full"></div>
            )}

            {index==1&&
            <GlowLight
                color="#00664F"
                size="w-[200px]  h-[200px]"
                opacity="opacity-40"
                blur="blur-[160px] sm:blur-[180px]"
                position="top-0 left-0"
              />}
              {index==1&&
              <GlowLight
                  color="#00664F"
                  size="w-[200px] h-[200px]"
                  opacity="opacity-70"
                  blur="blur-[160px] sm:blur-[180px]"
                  position="bottom-0 end-0"
                />}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HighlightCardsClient;

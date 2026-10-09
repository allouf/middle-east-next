"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

type Props = {
  title?: string;
  description?: string;
};

export default function ServicesHeroBanner({
  title,
  description,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url('/BannerJobs.png')",
          transform: isRTL ? "scaleX(-1)" : "scaleX(1)",
        }}
      />

      {/* Overlay for soft readability */}
      <div className="absolute inset-0  backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16  md:py-[80px]">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-blueSite leading-tight">
            {title || t("services.hero.titlePart1")}
            <span className="text-[#06B18747]">
              {t("services.hero.titlePart2")}
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-[#1A3A32] text-sm sm:text-base md:text-[18px] max-w-2xl">
            {description || t("services.hero.description")}
          </p>
        </div>
      </div>
    </section>
  );
}

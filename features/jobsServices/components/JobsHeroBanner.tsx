'use client';
import { useTranslation } from "react-i18next";

type Props = {
  title?: string;
  description?: string;
};

export default function JobsHeroBanner({
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
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            {title || t("jobs.heroTitle")}
          </h1>

          <p className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base md:text-lg max-w-lg">
            {description || t("jobs.heroDescription")}
          </p>
        </div>
      </div>
    </section>
  );
}

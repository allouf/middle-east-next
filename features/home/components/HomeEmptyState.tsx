"use client";
import Image from "next/image";
import emptyCartImg from "@/assets/images/emptyCart.png";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useState, useEffect } from "react";
import { getLocationCookie } from "@/lib/utils/auth-storage";

interface LocationData {
  country: {
    id: string;
    name: string;
    shortName: string;
  };
  region: {
    id: string;
    name: string;
    shortName: string;
  };
}

interface HomeEmptyStateProps {
  isError?: boolean;
}

const HomeEmptyState = ({ isError }: HomeEmptyStateProps) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    // Get location from secure cookie
    const getLocationFromStorage = () => {
      const storedLocation = getLocationCookie();
      if (storedLocation) {
        setLocation(storedLocation);
      }
    };

    // Initial load
    getLocationFromStorage();

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = () => {
      getLocationFromStorage();
    };

    // Polling as fallback to catch any missed changes
    const interval = setInterval(() => {
      getLocationFromStorage();
    }, 1000); // Check every second

    window.addEventListener('storage', handleCustomStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleCustomStorageChange);
    };
  }, []);

  const getTitle = () => {
    if (isError) return t("home.errorTitle");
    if (location?.country && location?.region) {
      return `${t("home.emptyProductsPrefix")} ${location.country.name} , ${location.region.name}`;
    }
    return t("home.emptyTitle");
  };

  const getMessage = () => {
    if (isError) return t("home.errorMessage");
    return t("home.emptyMessage");
  };

  return (
    <section className="flex flex-col items-center justify-center gap-6 md:gap-8 py-16 md:py-24 text-center">
      <div className="relative h-[220px] w-[250px] md:h-[320px] md:w-[380px]">
        <Image
          src={emptyCartImg}
          alt={isError ? t("home.errorTitle") : t("home.emptyImageAlt")}
          sizes="(max-width: 768px) 260px, 320px"
          className="object-contain"
        />
      </div>
      <div className="max-w-3xl space-y-3 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-subTitleColor">
          {getTitle()}
        </h1>
        <p className="text-textColor text-base md:text-lg leading-relaxed">
          {getMessage()}
        </p>
      </div>
    </section>
  );
};

export default HomeEmptyState;

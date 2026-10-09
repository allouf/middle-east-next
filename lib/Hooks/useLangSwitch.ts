import { useEffect, useState } from "react";

interface UseLangSwitchReturn {
  currentLang: string;
}

export const useLangSwitch = (): UseLangSwitchReturn => {
  const [currentLang, setCurrentLang] = useState<string>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const getInitialLang = () => {
      // 1. URL Path
      const pathLocale = window.location.pathname.split("/")[1];
      if (pathLocale === "ar" || pathLocale === "en") return pathLocale;
      
      // 2. Cookie
      const match = document.cookie.match(/i18nextLng=([^;]+)/);
      if (match && (match[1] === "ar" || match[1] === "en")) return match[1];

      // 3. Default fallback
      return "en";
    };

    setCurrentLang(getInitialLang());
  }, []);

  return {
    currentLang,
  };
};









"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_LOCALE,
  extractLocaleFromPathname,
  normalizeLocale,
} from "./locales";

export const useLocaleDirection = () => {
  const pathname = usePathname();

  const locale = useMemo(() => {
    const fromPath = extractLocaleFromPathname(pathname);
    return normalizeLocale(fromPath || DEFAULT_LOCALE);
  }, [pathname]);

  const isRTL = locale === "ar";
  const dir: "rtl" | "ltr" = isRTL ? "rtl" : "ltr";

  return { locale, dir, isRTL };
};


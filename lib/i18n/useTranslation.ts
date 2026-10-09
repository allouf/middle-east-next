"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import i18n, { applyLocale } from "./i18n";
import {
  DEFAULT_LOCALE,
  Locale,
  extractLocaleFromPathname,
  normalizeLocale,
} from "./locales";
import { getStoredLocale, syncLocalePreferences } from "./dom";

export function useTranslation() {
  const pathname = usePathname();
  
  // 1. Initial stable locale detection
  const initialLocale = useMemo(() => {
    const localeFromPath = extractLocaleFromPathname(pathname);
    if (localeFromPath) return localeFromPath;

    const stored = getStoredLocale();
    if (stored) return stored;

    return DEFAULT_LOCALE;
  }, []); // Only run once on mount

  const [activeLocale, setActiveLocale] = useState<Locale>(initialLocale);

  // 2. React to pathname changes
  const currentPathLocale = useMemo(
    () => extractLocaleFromPathname(pathname) || activeLocale,
    [pathname],
  );

  useEffect(() => {
    let cancelled = false;
    const nextLocale = normalizeLocale(currentPathLocale);

    void applyLocale(nextLocale).then(() => {
      if (!cancelled) {
        setActiveLocale(nextLocale);
      }
    });

    syncLocalePreferences(nextLocale);

    const handleLanguageChanged = (lng: string) => {
      if (!cancelled) {
        setActiveLocale(normalizeLocale(lng));
      }
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      cancelled = true;
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [currentPathLocale]);

  // 3. Provide a fixed "T" function that is bound to the active locale
  // This prevents flipping if the singleton i18n instance is updated by another component
  const t = useMemo(
    () => i18n.getFixedT(activeLocale),
    [activeLocale],
  );

  return {
    t,
    i18n,
    locale: activeLocale,
  };
}

/* eslint-disable import/no-named-as-default-member */
"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultNS, resources } from "./config";
import {
  DEFAULT_LOCALE,
  Locale,
  SUPPORTED_LOCALES,
  extractLocaleFromPathname,
  normalizeLocale,
} from "./locales";
import { getStoredLocale } from "./dom";

const initialLocale: Locale = (() => {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const pathLocale = extractLocaleFromPathname(window.location.pathname);
  const stored = getStoredLocale();
  return normalizeLocale(pathLocale || stored || DEFAULT_LOCALE);
})();

const baseConfig = {
  resources,
  lng: initialLocale,
  fallbackLng: DEFAULT_LOCALE,
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
  initImmediate: false,
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init(baseConfig);
}

export const applyLocale = async (locale?: string | null): Promise<typeof i18n> => {
  const nextLocale = (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(
    (locale || "").toLowerCase(),
  )
    ? ((locale || "").toLowerCase() as Locale)
    : DEFAULT_LOCALE;

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      ...baseConfig,
      lng: nextLocale,
    });
    return i18n;
  }

  if (i18n.language !== nextLocale) {
    await i18n.changeLanguage(nextLocale);
  }

  return i18n;
};

export default i18n;

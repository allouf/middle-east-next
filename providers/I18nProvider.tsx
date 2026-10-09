"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { applyLocale } from "@/lib/i18n/i18n";
import { DEFAULT_LOCALE, Locale, normalizeLocale } from "@/lib/i18n/locales";
import { syncLocalePreferences } from "@/lib/i18n/dom";

export function I18nProvider({
  children,
  locale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  const nextLocale = normalizeLocale(locale);
  // Synchronously update i18n language if it differs, to help with SSR and initial hydration
  if (i18n.isInitialized && i18n.language !== nextLocale) {
    void i18n.changeLanguage(nextLocale);
  }

  useEffect(() => {
    void applyLocale(nextLocale);
    syncLocalePreferences(nextLocale);
  }, [nextLocale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

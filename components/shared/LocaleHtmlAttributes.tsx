"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { syncLocalePreferences } from "@/lib/i18n/dom";
import {
  DEFAULT_LOCALE,
  extractLocaleFromPathname,
  normalizeLocale,
} from "@/lib/i18n/locales";

export function LocaleHtmlAttributes({ locale }: { locale?: string }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const localeFromPath = extractLocaleFromPathname(pathname);
    if (!localeFromPath && !locale) return;

    const nextLocale = normalizeLocale(locale || localeFromPath || DEFAULT_LOCALE);

    syncLocalePreferences(nextLocale);
  }, [locale, pathname]);

  return null;
}


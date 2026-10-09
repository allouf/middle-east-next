"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { TbWorld } from "react-icons/tb";
import { Dropdown, type MenuProps } from "antd";
import {
  DEFAULT_LOCALE,
  Locale,
  SUPPORTED_LOCALES,
  buildPathnameWithLocale,
  extractLocaleFromPathname,
  normalizeLocale,
} from "@/lib/i18n/locales";
import { applyLocale } from "@/lib/i18n/i18n";
import { getStoredLocale, syncLocalePreferences } from "@/lib/i18n/dom";
import { useTranslation } from "@/lib/i18n/useTranslation";

const LangSwitcher = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const currentLocale: Locale = useMemo(() => {
    const localeFromPath = extractLocaleFromPathname(pathname);
    if (localeFromPath) return localeFromPath;

    const stored = getStoredLocale();
    if (stored) return stored;

    return DEFAULT_LOCALE;
  }, [pathname]);

  const router = useRouter();

  const handleChange = (locale: Locale) => {
    const nextLocale = normalizeLocale(locale);
    if (nextLocale === currentLocale) return;

    // Use window.location.pathname to ensure we grab the absolute latest path,
    // bypassing Next.js layout cache which may hold stale usePathname() references
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    const nextPath = buildPathnameWithLocale(currentPath || "/", nextLocale);

    // Use window.location.search to ensure we grab the absolute latest query params,
    // bypassing Next.js layout cache which may hold stale useSearchParams() references
    const queryString = typeof window !== 'undefined' ? window.location.search : '';
    const href = queryString ? `${nextPath}${queryString}` : nextPath;

    syncLocalePreferences(nextLocale);
    void applyLocale(nextLocale);

    // Use client navigation first to avoid full page flash.
    if (typeof window !== 'undefined') {
      void router.push(href);
    }
  };

  const localeLabels: Record<Locale, string> = useMemo(
    () => ({
      en: t("languages.english"),
      ar: t("languages.arabic"),
    }),
    [t],
  );

  const menuItems: MenuProps["items"] = useMemo(
    () =>
      SUPPORTED_LOCALES.map((locale) => ({
        key: locale,
        label: localeLabels[locale as Locale] || locale.toUpperCase(),
      })),
    [localeLabels],
  );

  const menuProps: MenuProps = useMemo(
    () => ({
      items: menuItems,
      onClick: ({ key }) => handleChange(normalizeLocale(key)),
    }),
    [menuItems],
  );

  return (
    <Dropdown rootClassName="w-[100px]" menu={menuProps} trigger={["click"]}>
      <button
        className="flex items-center gap-2 rounded-md !bg-transparent !border-none !text-white mx-4"
      >
        <TbWorld size={20} />
        <span className="text-sm font-semibold hidden sm:inline">
          {localeLabels[currentLocale] || currentLocale.toUpperCase()}
        </span>
      </button>
    </Dropdown>
  );
};

export default LangSwitcher;

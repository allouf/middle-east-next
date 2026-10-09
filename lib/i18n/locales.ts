export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "i18nextLng";

export const isLocale = (value?: string | null): value is Locale => {
  if (!value) return false;
  const normalized = value.toLowerCase();
  return (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(normalized);
};

export const normalizeLocale = (value?: string | null): Locale => {
  if (!value) return DEFAULT_LOCALE;
  const normalized = value.toLowerCase();
  return isLocale(normalized) ? (normalized as Locale) : DEFAULT_LOCALE;
};

export const extractLocaleFromPathname = (
  pathname?: string | null,
): Locale | null => {
  if (!pathname) return null;
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return isLocale(firstSegment) ? (firstSegment as Locale) : null;
};

export const buildPathnameWithLocale = (
  pathname: string,
  locale: Locale,
): string => {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${locale}`;
  }

  if (isLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}`;
};

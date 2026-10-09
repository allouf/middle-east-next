import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  Locale,
  SUPPORTED_LOCALES,
  normalizeLocale,
} from "./locales";

export const getStoredLocale = (): Locale | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored ? normalizeLocale(stored) : null;
  } catch {
    return null;
  }
};

export const persistLocale = (locale: Locale) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);

    const maxAge = 30 * 24 * 60 * 60; // 30 days
    document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {
    /* ignore */
  }
};

export const applyDocumentLocale = (locale: Locale = DEFAULT_LOCALE) => {
  if (typeof document === "undefined") return;

  const dir = locale === "ar" ? "rtl" : "ltr";
  const localesToReset = SUPPORTED_LOCALES as ReadonlyArray<string>;

  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
  document.body.dir = dir;

  document.documentElement.classList.remove(...localesToReset);
  document.body.classList.remove(...localesToReset);

  document.documentElement.classList.add(locale);
  document.body.classList.add(locale);
};

export const syncLocalePreferences = (locale: Locale = DEFAULT_LOCALE) => {
  persistLocale(locale);
  applyDocumentLocale(locale);
};

import { createInstance } from "i18next";
import { defaultNS, resources } from "./baseConfig";
import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from "./locales";

const resolveLocale = (_lng?: string): Locale => {
  return (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(
    (_lng || "").toLowerCase(),
  )
    ? ((_lng || "").toLowerCase() as Locale)
    : DEFAULT_LOCALE;
};

// Plain i18n instance for server-only usage (avoids React bindings)
export async function getI18n(lng: string = DEFAULT_LOCALE) {
  const locale = resolveLocale(lng);
  const i18nInstance = createInstance();

  await i18nInstance.init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
    initImmediate: false,
  });

  return i18nInstance;
}

// Helper to get `t` directly
export async function getT(lng: string = DEFAULT_LOCALE) {
  const i18n = await getI18n(lng);
  return i18n.t.bind(i18n);
}

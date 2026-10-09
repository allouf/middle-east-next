import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultNS, resources } from "./baseConfig";
import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from "./locales";

export { defaultNS, resources } from "./baseConfig";

const resolveLocale = (_lng?: string): Locale => {
  return (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(
    (_lng || "").toLowerCase(),
  )
    ? ((_lng || "").toLowerCase() as Locale)
    : DEFAULT_LOCALE;
};

export function createI18nInstance(_lng: string = DEFAULT_LOCALE) {
  const lng = resolveLocale(_lng);
  const i18nInstance = createInstance();

  i18nInstance.use(initReactI18next).init({
    lng,
    fallbackLng: DEFAULT_LOCALE,
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    initImmediate: false,
  });

  return i18nInstance;
}


import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export const defaultNS = "translation";

export const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
} as const;

const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const LANGUAGE_API_BASE = base.endsWith("/")
  ? base.slice(0, -1)
  : base;

export const languageApi = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${LANGUAGE_API_BASE}${normalizedPath}`;
};

let languagesCache: any[] | null = null;

export const fetchLanguages = async () => {
  if (languagesCache) return languagesCache;

  const res = await fetch(languageApi('/api/languages'));
  const payload = await res.json();

  if (res.ok && (payload?.status === 'OK' || payload?.status === true) && Array.isArray(payload.data)) {
    languagesCache = payload.data;
    return languagesCache;
  }

  return [];
};

type LanguageCode = string | number | undefined | null;

export const getLanguageNameByCodeFromList = (
  languages: any[],
  code?: string | null
) => {
  if (!code || !Array.isArray(languages)) return '-';
  const lc = code.toLowerCase();

  const language = languages.find(
    (item) =>
      String(item.id || '').toLowerCase() === lc ||
      String(item.code || '').toLowerCase() === lc
  );

  return language?.name || '-';
};

export const getLanguageNameByCode = async (code: LanguageCode) => {
  if (!code) return '-';

  const languages = await fetchLanguages();

  const language = languages?.find((lang) =>
    String(lang.code).toLowerCase() === String(code).toLowerCase() ||
    String(lang.id) === String(code)
  );

  return language?.name || '-';
};

export const getLanguageCodeByName = async (name?: string) => {
  if (!name) return null;

  const languages = await fetchLanguages();

  const language = languages?.find((lang) =>
    String(lang.name).toLowerCase() === String(name).toLowerCase()
  );

  return language?.code || language?.id || null;
};

export const getActiveLanguages = async () => {
  const languages = await fetchLanguages();
  
  return languages?.filter((lang) => 
    lang.is_active === true || 
    lang.status === 'active' || 
    lang.enabled === true
  ) || [];
};

export const getDefaultLanguage = async () => {
  const languages = await fetchLanguages();
  
  return languages?.find((lang) => 
    lang.is_default === true || 
    lang.default === true ||
    lang.is_primary === true
  ) || null;
};
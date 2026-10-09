const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const LOCATION_API_BASE = base.endsWith("/")
  ? base.slice(0, -1)
  : base;

export const locationApi = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${LOCATION_API_BASE}${normalizedPath}`;
};



let countriesCache: any[] | null = null;

export const fetchCountries = async () => {
  if (countriesCache) return countriesCache;

  const res = await fetch(locationApi('/api/location/countries'));
  const payload = await res.json();

  if (res.ok && (payload?.status === 'OK' || payload?.status === true) && Array.isArray(payload.data)) {
    countriesCache = payload.data;
    return countriesCache;
  }

  return [];
};



type CountryCode = string | number | undefined | null;
export const getCountryNameByCodeFromList = (
  countries: any[],
  code?: string | null
) => {
  if (!code || !Array.isArray(countries)) return '-';
  const lc = code.toLowerCase();

  const c = countries.find(
    (item) =>
      String(item.id || '').toLowerCase() === lc ||
      String(item.shortName || '').toLowerCase() === lc ||
      String(item.cca2 || '').toLowerCase() === lc ||
      String(item.cca3 || '').toLowerCase() === lc ||
      String(item.alpha_2_code || '').toLowerCase() === lc ||
      String(item.alpha_3_code || '').toLowerCase() === lc
  );

  return c?.en_short_name || c?.name || '-';
};

export const getCountryNameByCode = async (code: CountryCode) => {
  if (!code) return '-';

  const countries = await fetchCountries();

  const country = countries?.find((c) =>
    String(c.alpha_2_code).toLowerCase() === String(code).toLowerCase() ||
    String(c.alpha_3_code).toLowerCase() === String(code).toLowerCase() ||
    String(c.id) === String(code)
  );

  return country?.en_short_name || country?.name || '-';
};

let regionsCache: Record<string, any[]> = {};

export const fetchRegions = async (countryCode?: string) => {
  if (!countryCode) return [];
  
  // Check cache first
  if (regionsCache[countryCode]) {
    return regionsCache[countryCode];
  }

  try {
    const res = await fetch(
      locationApi(`/api/location/regions?country=${encodeURIComponent(countryCode)}`)
    );
    const payload = await res.json();
    
    if (res.ok && payload?.status === 'OK' && Array.isArray(payload.data)) {
      const regions = payload.data;
      regionsCache[countryCode] = regions;
      return regions;
    }
  } catch (error) {
    console.error('Failed to fetch regions:', error);
  }
  
  return [];
};

export const getRegionsByCountryCode = async (countryCode?: string) => {
  return await fetchRegions(countryCode);
};

export const getRegionsByCountryName = async (countryName?: string) => {
  return await fetchRegions(countryName);
};

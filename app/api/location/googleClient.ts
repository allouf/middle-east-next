// Google API client utilities for server-side proxying

import { getGoogleMapsApiKey } from '@/lib/security/apiKeys';

const REFERER_HEADER =
  process.env.NEXT_PUBLIC_APP_URl ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.APP_URL ||
  "";

export const ensureGoogleKey = () => {
  return getGoogleMapsApiKey();
};

export const googleFetch = async (
  endpoint: string,
  params: Record<string, string | number>
) => {
  const key = ensureGoogleKey();
  const url = new URL(`https://maps.googleapis.com/maps/api/${endpoint}`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, String(v));
    }
  });
  url.searchParams.set("key", key);

  const response = await fetch(url.toString(), {
    headers: REFERER_HEADER ? { Referer: REFERER_HEADER } : undefined,
    cache: "no-store",
  });

  const payload = await response.json();
  return { response, payload };
};

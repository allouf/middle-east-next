import "server-only";

export function getGoogleMapsApiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error("Google Maps API key is not configured in server environment");
  }
  return key;
}

export function getTinyMceApiKey(): string {
  const key = process.env.TINYMCE_API_KEY;
  if (!key) {
    throw new Error("TinyMCE API key is not configured in server environment");
  }
  return key;
}

export function getApiUrl(): string {
  const url = process.env.API_URL;
  if (!url) {
    throw new Error("API URL is not configured in server environment");
  }
  return url;
}

export function validateApiKeys() {
  const keys = {
    googleMaps: process.env.GOOGLE_MAPS_API_KEY,
    tinymce: process.env.TINYMCE_API_KEY,
    apiUrl: process.env.API_URL,
  };

  const requiredKeys = ["googleMaps", "tinymce", "apiUrl"] as const;
  const missingKeys: string[] = [];
  const availableKeys: string[] = [];

  for (const key of requiredKeys) {
    if (keys[key]) {
      availableKeys.push(key);
    } else {
      missingKeys.push(key);
    }
  }

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    availableKeys,
  };
}
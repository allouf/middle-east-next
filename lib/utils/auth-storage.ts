"use client";

/**
 * Next.js-compatible auth storage utilities
 * Uses cookies for secure storage - no localStorage for sensitive data
 */

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH: "refresh_token",
  AUTH: "auth",
  EMAIL: "user_email",
  LOCATION: "current_location_selection",
  PREFERENCES: "user_preferences",
} as const;

interface AuthStorage {
  role: string;
  isAuthenticated: boolean;
  isVerified: boolean;
}

interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface AuthData {
  tokens: Tokens;
  user: {
    email: string;
    is_verified: boolean;
    role: string;
  };
}

/**
 * Helper function to get cookie value
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

/**
 * Helper function to set cookie
 */
const setCookie = (name: string, value: string, maxAge: number = 7 * 24 * 60 * 60): void => {
  if (typeof window === "undefined") return;
  
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction ? "; Secure" : "";
  const sameSite = "; SameSite=Lax";
  
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}${sameSite}${secure}`;
};

/**
 * Client-side: Save auth data to cookies only (no localStorage for sensitive data)
 */
export const saveAuthToStorage = (data: AuthData): void => {
  if (typeof window === "undefined") return;

  const { tokens, user } = data;
  const maxAge = 7 * 24 * 60 * 60; // 7 days

  // Save tokens to HttpOnly cookies via API call will be handled server-side
  // For client-side, we set non-HttpOnly cookies for immediate access
  setCookie(STORAGE_KEYS.TOKEN, tokens.access_token, maxAge);
  setCookie(STORAGE_KEYS.REFRESH, tokens.refresh_token, maxAge);
  
  // Store non-sensitive auth state in cookie
  const authState = {
    role: user.role,
    isAuthenticated: true,
    isVerified: user.is_verified,
  };
  
  setCookie(STORAGE_KEYS.AUTH, encodeURIComponent(JSON.stringify(authState)), maxAge);
  
  // Store only non-sensitive email in cookie (could also be stored in localStorage if needed)
  setCookie(STORAGE_KEYS.EMAIL, user.email, maxAge);
};

/**
 * Client-side: Clear all auth data from cookies
 */
export const clearAuthStorage = (): void => {
  if (typeof window === "undefined") return;

  // Clear cookies by setting expiration to past
  Object.values(STORAGE_KEYS).forEach((key) => {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
};

/**
 * Client-side: Get auth data from cookies
 */
export const getAuthFromStorage = (): {
  isAuthenticated: boolean;
  role: string | null;
  isVerified: boolean;
} => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, role: null, isVerified: false };
  }

  try {
    const token = getCookie(STORAGE_KEYS.TOKEN);
    const authCookie = getCookie(STORAGE_KEYS.AUTH);

    if (token && authCookie) {
      const parsed: AuthStorage = JSON.parse(decodeURIComponent(authCookie));
      return {
        isAuthenticated: true,
        role: parsed.role || null,
        isVerified: parsed.isVerified ?? false,
      };
    }
  } catch {
    // Ignore parse errors
  }

  return { isAuthenticated: false, role: null, isVerified: false };
};

/**
 * Client-side: Get token from cookies
 */
export const getToken = (): string | null => {
  return getCookie(STORAGE_KEYS.TOKEN);
};

/**
 * Client-side: Get refresh token from cookies
 */
export const getRefreshToken = (): string | null => {
  return getCookie(STORAGE_KEYS.REFRESH);
};

/**
 * Helper function to set secure cookie with strict SameSite
 */
export const setSecureCookie = (name: string, value: string, maxAge: number = 24 * 60 * 60): void => {
  if (typeof window === "undefined") return;
  
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction ? "; Secure" : "";
  const sameSite = "; SameSite=Strict";
  
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}${sameSite}${secure}`;
};

/**
 * Set location data in secure cookie
 */
export const setLocationCookie = (locationData: any): void => {
  setSecureCookie(STORAGE_KEYS.LOCATION, JSON.stringify(locationData));
};

/**
 * Get location data from secure cookie
 */
export const getLocationCookie = (): any | null => {
  if (typeof window === "undefined") return null;
  
  const locationCookie = getCookie(STORAGE_KEYS.LOCATION);
  if (!locationCookie) return null;
  
  try {
    return JSON.parse(decodeURIComponent(locationCookie));
  } catch {
    return null;
  }
};

/**
 * Clear location cookie
 */
export const clearLocationCookie = (): void => {
  if (typeof window === "undefined") return;
  document.cookie = `${STORAGE_KEYS.LOCATION}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

/**
 * Set user preferences in secure cookie
 */
export const setPreferencesCookie = (preferences: any): void => {
  setSecureCookie(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
};

/**
 * Get user preferences from secure cookie
 */
export const getPreferencesCookie = (): any | null => {
  if (typeof window === "undefined") return null;
  
  const preferencesCookie = getCookie(STORAGE_KEYS.PREFERENCES);
  if (!preferencesCookie) return null;
  
  try {
    return JSON.parse(decodeURIComponent(preferencesCookie));
  } catch {
    return null;
  }
};

/**
 * Clear preferences cookie
 */
export const clearPreferencesCookie = (): void => {
  if (typeof window === "undefined") return;
  document.cookie = `${STORAGE_KEYS.PREFERENCES}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

/**
 * Client-side: Update auth data (e.g., role change)
 */
export const updateAuthStorage = (updates: Partial<AuthStorage>): void => {
  if (typeof window === "undefined") return;

  try {
    const authCookie = getCookie(STORAGE_KEYS.AUTH);
    const auth = authCookie ? JSON.parse(decodeURIComponent(authCookie)) : {};
    const updated = { ...auth, ...updates };

    setCookie(STORAGE_KEYS.AUTH, encodeURIComponent(JSON.stringify(updated)));
  } catch {
    // Ignore errors
  }
};



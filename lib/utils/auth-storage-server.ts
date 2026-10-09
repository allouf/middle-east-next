import { cookies } from "next/headers";

/**
 * Server-side auth storage utilities
 * Uses Next.js cookies() API for server components and API routes
 */

export const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH: "refresh_token",
  AUTH: "auth",
  EMAIL: "user_email",
  COUNTRY_CODE: "country_code",
  REGION: "region_name",
} as const;

interface AuthStorage {
  role: string;
  isAuthenticated: boolean;
  isVerified: boolean;
}

/**
 * Server-side: Get token from cookies
 */
export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(STORAGE_KEYS.TOKEN)?.value || null;
}

/**
 * Server-side: Get refresh token from cookies
 */
export async function getServerRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(STORAGE_KEYS.REFRESH)?.value || null;
}

/**
 * Server-side: Get country code from cookies
 */
export async function getServerCountryCode(): Promise<string | null> {
  const cookieStore = await cookies();
  const val = cookieStore.get(STORAGE_KEYS.COUNTRY_CODE)?.value || null;
  // console.log(`[getServerCountryCode] Raw cookie:`, val);
  return val;
}

/**
 * Server-side: Get region from cookies
 */
export async function getServerRegion(): Promise<string | null> {
  const cookieStore = await cookies();
  const val = cookieStore.get(STORAGE_KEYS.REGION)?.value || null;
  // console.log(`[getServerRegion] Raw cookie:`, val);
  if (!val) return null;
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

/**
 * Server-side: Get auth data from cookies
 */
export async function getServerAuth(): Promise<{
  isAuthenticated: boolean;
  role: string | null;
  isVerified: boolean;
}> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(STORAGE_KEYS.AUTH)?.value;

  if (!authCookie) {
    return { isAuthenticated: false, role: null, isVerified: false };
  }

  try {
    const parsed: AuthStorage = JSON.parse(decodeURIComponent(authCookie));
    return {
      isAuthenticated: true,
      role: parsed.role || null,
      isVerified: parsed.isVerified ?? false,
    };
  } catch {
    return { isAuthenticated: false, role: null, isVerified: false };
  }
}

/**
 * Server-side: Check if user is authenticated
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const token = await getServerToken();
  return !!token;
}

/**
 * Server-side: Set auth cookies (for API routes) - HttpOnly for security
 */
export async function setServerAuthCookies(
  token: string,
  refreshToken: string,
  authData: AuthStorage
): Promise<void> {
  const cookieStore = await cookies();
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(STORAGE_KEYS.TOKEN, token, {
    httpOnly: true, // HttpOnly for security
    secure: isProduction,
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  cookieStore.set(STORAGE_KEYS.REFRESH, refreshToken, {
    httpOnly: true, // HttpOnly for security
    secure: isProduction,
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  // Auth state cookie can be non-HttpOnly as it's non-sensitive
  cookieStore.set(
    STORAGE_KEYS.AUTH,
    encodeURIComponent(JSON.stringify(authData)),
    {
      httpOnly: false, // Non-HttpOnly for client-side access
      secure: isProduction,
      sameSite: "lax",
      maxAge,
      path: "/",
    }
  );
}

/**
 * Server-side: Clear auth cookies
 */
export async function clearServerAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(STORAGE_KEYS.TOKEN);
  cookieStore.delete(STORAGE_KEYS.REFRESH);
  cookieStore.delete(STORAGE_KEYS.AUTH);
  cookieStore.delete(STORAGE_KEYS.EMAIL);
}



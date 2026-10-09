import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  normalizeLocale,
} from "./lib/i18n/locales";
import { addCSPHeaders } from "./lib/security/cspMiddleware";

// Rate limiting configuration
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || // Cloudflare
         request.headers.get('x-client-ip') || // Custom header
         'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }
  
  const requests = rateLimit.get(ip)!.filter((time: number) => time > windowStart);
  
  if (requests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  requests.push(now);
  rateLimit.set(ip, requests);
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    for (const [key, times] of rateLimit.entries()) {
      const validTimes = times.filter((time: number) => time > windowStart);
      if (validTimes.length === 0) {
        rateLimit.delete(key);
      } else {
        rateLimit.set(key, validTimes);
      }
    }
  }
  
  return true;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting for API endpoints
  if (pathname.startsWith("/api")) {
    const ip = getClientIP(request);
    
    if (!checkRateLimit(ip)) {
      const response = NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Window': (RATE_LIMIT_WINDOW / 1000).toString(),
          }
        }
      ); 
      return addCSPHeaders(request, response);
    }
    
    const response = NextResponse.next();
    return addCSPHeaders(request, response);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    const response = NextResponse.next();
    return addCSPHeaders(request, response);
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  const potentialLocale = pathSegments[0]?.toLowerCase();
  
  // Robustly check if the first segment is a supported locale
  const isSupportedLocale = 
    potentialLocale && 
    (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(potentialLocale);

  // 1. If we are on a locale path (e.g. /ar, /en)
  if (isSupportedLocale) {
    const response = NextResponse.next();
    const normalizedPathLocale = normalizeLocale(potentialLocale);
    
    // Get stored locale preference
    const storedCookie = request.cookies.get(LOCALE_STORAGE_KEY)?.value;
    const storedLocale = storedCookie ? normalizeLocale(storedCookie) : null;

    // Check if we need to update the cookie to match current path
    if (storedLocale !== normalizedPathLocale) {
      response.cookies.set(LOCALE_STORAGE_KEY, normalizedPathLocale, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        sameSite: "strict",
      });
    }

    return addCSPHeaders(request, response);
  }

  // 2. If we are on a non-locale path (e.g. /), redirect securely
  const normalizedPath = pathname === "/" ? "" : pathname;
  
  // Determine target locale: 
  // 1. Cookie preference
  // 2. Accept-Language header fallback
  // 3. Default locale
  const cookieValue = request.cookies.get(LOCALE_STORAGE_KEY)?.value;
  
  let targetLocale: string = DEFAULT_LOCALE;

  if (cookieValue && (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(cookieValue)) {
    targetLocale = normalizeLocale(cookieValue);
  } else {
    // Try to detect from Accept-Language header
    const acceptLanguage = request.headers.get("accept-language");
    if (acceptLanguage) {
      const preferredLocales = acceptLanguage
        .split(",")
        .map(lang => lang.split(";")[0].trim().toLowerCase());
      
      const matchedLocale = preferredLocales.find(lang => 
        (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(lang.split("-")[0])
      );
      
      if (matchedLocale) {
        targetLocale = normalizeLocale(matchedLocale.split("-")[0]);
      }
    }
  }

  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${targetLocale}${normalizedPath}`;
  
  // Preserve query parameters
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  return addCSPHeaders(request, response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths including API routes for rate limiting
     * Exclude:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (files in public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

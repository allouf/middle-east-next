/**
 * CSRF Protection Utilities
 * 
 * This module provides CSRF token generation and validation
 * to protect against Cross-Site Request Forgery attacks.
 */

import { cookies } from 'next/headers';
import { randomBytes, createHash } from 'crypto';

// CSRF token configuration
export const CSRF_CONFIG = {
  TOKEN_LENGTH: 32,          // Length of random bytes
  COOKIE_NAME: 'csrf_token', // Name of CSRF cookie
  HEADER_NAME: 'X-CSRF-Token', // Name of CSRF header
  MAX_AGE: 60 * 60 * 24,     // 24 hours
  HTTP_ONLY: false,          // Client needs to read the token
  SAME_SITE: 'strict' as const,
  SECURE: process.env.NODE_ENV === 'production',
} as const;

/**
 * Generate a secure CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(CSRF_CONFIG.TOKEN_LENGTH).toString('hex');
}

/**
 * Hash a CSRF token for secure storage
 */
export function hashCSRFToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Set CSRF token cookie (server-side)
 */
export async function setCSRFCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(CSRF_CONFIG.COOKIE_NAME, token, {
    httpOnly: CSRF_CONFIG.HTTP_ONLY,
    secure: CSRF_CONFIG.SECURE,
    sameSite: CSRF_CONFIG.SAME_SITE,
    maxAge: CSRF_CONFIG.MAX_AGE,
    path: '/',
  });
}

/**
 * Get CSRF token from cookie
 */
export async function getCSRFCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_CONFIG.COOKIE_NAME)?.value || null;
}

/**
 * Validate CSRF token against cookie
 */
export async function validateCSRFToken(
  requestToken: string | null
): Promise<{ isValid: boolean; error?: string }> {
  if (!requestToken) {
    return {
      isValid: false,
      error: 'CSRF token is missing',
    };
  }

  const cookieToken = await getCSRFCookie();
  
  if (!cookieToken) {
    return {
      isValid: false,
      error: 'CSRF cookie is missing',
    };
  }

  // Use timing-safe comparison to prevent timing attacks
  if (!timingSafeEqual(requestToken, cookieToken)) {
    return {
      isValid: false,
      error: 'Invalid CSRF token',
    };
  }

  return { isValid: true };
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Generate and set CSRF token for new sessions
 */
export async function initializeCSRF(): Promise<string> {
  const token = generateCSRFToken();
  await setCSRFCookie(token);
  return token;
}

/**
 * Check if request requires CSRF protection
 * GET, HEAD, OPTIONS requests are generally safe
 */
export function requiresCSRFProtection(method: string): boolean {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  return !safeMethods.includes(method.toUpperCase());
}

/**
 * Extract CSRF token from request
 */
export function extractCSRFToken(request: Request): string | null {
  // Check header first (recommended)
  const headerToken = request.headers.get(CSRF_CONFIG.HEADER_NAME);
  if (headerToken) {
    return headerToken;
  }

  // Fall back to form body (for form submissions)
  // This would need to be implemented in the specific API route
  return null;
}

/**
 * CSRF Protection Middleware Result
 */
export interface CSRFProtectionResult {
  isValid: boolean;
  token?: string;
  error?: string;
}

/**
 * Main CSRF protection function
 */
export async function protectFromCSRF(
  request: Request
): Promise<CSRFProtectionResult> {
  const method = request.method;

  // Skip CSRF protection for safe methods
  if (!requiresCSRFProtection(method)) {
    const token = await getCSRFCookie();
    return {
      isValid: true,
      token: token || undefined,
    };
  }

  // Extract and validate token for unsafe methods
  const token = extractCSRFToken(request);
  const validation = await validateCSRFToken(token);

  return {
    isValid: validation.isValid,
    error: validation.error,
  };
}

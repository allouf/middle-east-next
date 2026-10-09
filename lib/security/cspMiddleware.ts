import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate a cryptographically secure nonce for CSP
 * Works in Node.js, Edge Runtime, and Browser
 */
function generateNonce(): string {
  // Use the global crypto object (standard Web Crypto API)
  // This is available in Node.js 15+, Edge Runtime, and modern browsers
  const array = new Uint8Array(16);
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for extremely old environments (rare in Next.js)
    return Math.random().toString(36).substring(2, 15);
  }

  // btoa is available in all Edge Runtime and modern Node.js environments
  return btoa(String.fromCharCode(...array));
}

/**
 * Create CSP with nonce for the current request
 */
function createCSPWithNonce(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'sha256-IWn7Bdy87vPlTb92Toj/sxh8iUn70qrCc6WWrz575GY=' https://apis.google.com${isDevelopment ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https://api.mideastcom.net http://*.middleeastcommerce.net https://*.middleeastcommerce.net https://*.googleapis.com https://*.gstatic.com https://placehold.co",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' ws://localhost:* wss://*.middleeastcommerce.net https://api.mideastcom.net https://*.middleeastcommerce.net https://*.googleapis.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
}

/**
 * Middleware to add CSP headers with nonce
 */
export function addCSPHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const nonce = generateNonce();
  const cspValue = createCSPWithNonce(nonce);
  
  response.headers.set('Content-Security-Policy', cspValue);
  response.headers.set('x-nonce', nonce);
  
  return response;
}

import { NextRequest, NextResponse } from 'next/server';
import { getCSRFToken } from '@/lib/security/csrfMiddleware';

/**
 * CSRF Token Endpoint
 * 
 * GET /api/csrf/token
 * 
 * This endpoint provides a fresh CSRF token for client-side applications.
 * It should be called when the application loads or when the token expires.
 */
export async function GET(request: NextRequest) {
  return getCSRFToken();
}

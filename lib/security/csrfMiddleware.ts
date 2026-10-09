/**
 * CSRF Middleware for API Protection
 * 
 * This middleware provides CSRF protection for all API routes
 * that perform state-changing operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { protectFromCSRF, initializeCSRF, CSRF_CONFIG } from '@/lib/security/csrf';

/**
 * CSRF Protection Middleware
 * 
 * Apply this middleware to API routes that need CSRF protection.
 * It automatically handles token generation, validation, and error responses.
 */
export async function withCSRFProtection(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Check if CSRF protection is needed for this method
    const method = request.method;
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    
    if (safeMethods.includes(method)) {
      // For safe methods, ensure CSRF token exists and proceed
      const csrfResult = await protectFromCSRF(request);
      
      if (!csrfResult.token) {
        // Initialize CSRF token if it doesn't exist
        await initializeCSRF();
      }
      
      return handler(request);
    }

    // For unsafe methods (POST, PUT, DELETE, PATCH), validate CSRF token
    const csrfResult = await protectFromCSRF(request);
    
    if (!csrfResult.isValid) {
      return NextResponse.json(
        {
          error: 'CSRF validation failed',
          message: csrfResult.error || 'Invalid or missing CSRF token',
          code: 'CSRF_INVALID',
        },
        {
          status: 403,
          headers: {
            'X-CSRF-Error': csrfResult.error || 'CSRF validation failed',
          },
        }
      );
    }

    // CSRF validation passed, proceed with the request
    return handler(request);
    
  } catch (error) {
    console.error('CSRF middleware error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error during CSRF validation',
        message: 'Security validation failed',
        code: 'CSRF_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * CSRF Token Endpoint
 * 
 * This endpoint provides a fresh CSRF token for client-side applications.
 * It should be called when the application loads or when the token expires.
 */
export async function getCSRFToken(): Promise<NextResponse> {
  try {
    const token = await initializeCSRF();
    
    return NextResponse.json({
      csrfToken: token,
      headerName: CSRF_CONFIG.HEADER_NAME,
      cookieName: CSRF_CONFIG.COOKIE_NAME,
      maxAge: CSRF_CONFIG.MAX_AGE,
    });
    
  } catch (error) {
    console.error('CSRF token generation error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate CSRF token',
        message: 'Unable to initialize security token',
        code: 'CSRF_TOKEN_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * Validate CSRF Token Endpoint
 * 
 * This endpoint validates a CSRF token sent by the client.
 * Useful for debugging or token validation before form submission.
 */
export async function validateCSRFTokenEndpoint(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        {
          error: 'Token is required',
          valid: false,
        },
        { status: 400 }
      );
    }

    const csrfResult = await protectFromCSRF(request);
    
    return NextResponse.json({
      valid: csrfResult.isValid,
      error: csrfResult.error,
    });
    
  } catch (error) {
    console.error('CSRF validation endpoint error:', error);
    
    return NextResponse.json(
      {
        error: 'Validation failed',
        valid: false,
        message: 'Unable to validate CSRF token',
      },
      { status: 500 }
    );
  }
}

/**
 * Custom CSRF Error Response
 */
export function createCSRFErrorResponse(
  message: string = 'CSRF validation failed',
  code: string = 'CSRF_INVALID'
): NextResponse {
  return NextResponse.json(
    {
      error: 'CSRF validation failed',
      message,
      code,
      timestamp: new Date().toISOString(),
    },
    {
      status: 403,
      headers: {
        'X-CSRF-Error': message,
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}

/**
 * Check if request should bypass CSRF protection
 * 
 * Some endpoints might need to bypass CSRF protection
 * (e.g., webhooks, API callbacks, etc.)
 */
export function shouldBypassCSRF(request: NextRequest): boolean {
  const { pathname } = new URL(request.url);
  
  // List of endpoints that bypass CSRF protection
  const bypassEndpoints = [
    '/api/webhooks/',
    '/api/callbacks/',
    '/api/external/',
    '/api/csrf/token', // CSRF token endpoint itself
  ];
  
  return bypassEndpoints.some(endpoint => pathname.startsWith(endpoint));
}

/**
 * Enhanced CSRF Middleware with bypass support
 */
export async function withCSRFProtectionEnhanced(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Check if this request should bypass CSRF protection
  if (shouldBypassCSRF(request)) {
    return handler(request);
  }
  
  // Apply standard CSRF protection
  return withCSRFProtection(request, handler);
}

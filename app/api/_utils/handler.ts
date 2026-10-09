// API Route Handler Utilities

import { NextRequest, NextResponse } from 'next/server';
import { baseURL } from '@/shared/constants/data';
import { withCSRFProtectionEnhanced } from '@/lib/security/csrfMiddleware';

export interface ApiHandlerOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
}

/**
 * Generic API handler that proxies requests to the backend with CSRF protection
 */
export async function apiHandler(
  request: NextRequest,
  options: ApiHandlerOptions
): Promise<NextResponse> {
  return withCSRFProtectionEnhanced(request, async (req) => {
    try {
      const { method, endpoint, body, headers = {}, params } = options;

      // Get authorization token from request headers
      const authToken = req.headers.get('authorization') || 
                       req.cookies.get('token')?.value;

      // Build URL with query parameters
      let url = `${baseURL}${endpoint}`;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, String(value));
        });
        url += `?${searchParams.toString()}`;
      }

      // Prepare headers
      const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      };

      if (authToken) {
        requestHeaders['Authorization'] = authToken.startsWith('Bearer') 
          ? authToken 
          : `Bearer ${authToken}`;
      }

      // Get Accept-Language from request
      const acceptLanguage = req.headers.get('accept-language');
      if (acceptLanguage) {
        requestHeaders['Accept-Language'] = acceptLanguage;
      }

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method,
        headers: requestHeaders,
      };

      // Add body for POST, PUT, PATCH requests
      if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
        if (body instanceof FormData) {
          // Remove Content-Type for FormData (browser will set it with boundary)
          delete requestHeaders['Content-Type'];
          fetchOptions.body = body;
        } else {
          fetchOptions.body = JSON.stringify(body);
        }
      }

      // Make request to backend
      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      // Return response with same status code
      return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
      console.error('API Handler Error:', error);
      
      // Sanitize error messages based on environment
      const isProduction = process.env.NODE_ENV === 'production';
      const errorMessage = isProduction 
        ? 'Internal server error' 
        : error.message || 'Internal server error';
      
      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage,
        },
        { status: 500 }
      );
    }
  });
}

/**
 * Extract path parameters from Next.js dynamic route
 */
export function getPathParams(request: NextRequest, paramNames: string[]): Record<string, string> {
  const params: Record<string, string> = {};
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  
  // This is a simplified version - in actual routes, use Next.js params
  paramNames.forEach((name, index) => {
    // This will be handled by Next.js route params in actual implementation
    params[name] = '';
  });
  
  return params;
}

/**
 * Get query parameters from request
 */
export function getQueryParams(request: NextRequest): Record<string, string> {
  const params: Record<string, string> = {};
  const { searchParams } = new URL(request.url);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Parse request body
 */
export async function parseRequestBody(request: NextRequest): Promise<any> {
  const contentType = request.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return await request.json();
  }
  
  if (contentType?.includes('multipart/form-data')) {
    return await request.formData();
  }
  
  if (contentType?.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    const body: Record<string, any> = {};
    formData.forEach((value, key) => {
      body[key] = value;
    });
    return body;
  }
  
  return null;
}


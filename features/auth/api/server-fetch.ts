// Server-side authenticated fetch utility
import { getServerToken, getServerRefreshToken, getServerCountryCode, getServerRegion } from '@/lib/utils/auth-storage-server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.mideastcom.net/api/v1";

export interface ServerFetchOptions extends RequestInit {
  requireAuth?: boolean;
  locale?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
}

/**
 * Server-side authenticated fetch
 * Automatically attaches auth token from cookies
 */
export async function serverFetch<T = unknown>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<ApiResponse<T>> {
  const { requireAuth = false, locale = 'en', ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept-Language': locale,
    ...fetchOptions.headers,
  };

  // Attach location headers from cookies
  const countryCode = await getServerCountryCode();
  const region = await getServerRegion();
  if (countryCode) (headers as Record<string, string>)['X-Country-Code'] = countryCode;
  if (region) (headers as Record<string, string>)['X-Region'] = region;

  // Attach auth token if required or available
  if (requireAuth) {
    const token = await getServerToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  // Server-side logging for verification
  // console.log(`[Server API Request] ${options.method || 'GET'} ${endpoint}`, {
  //   'X-Country-Code': (headers as Record<string, string>)['X-Country-Code'],
  //   'X-Region': (headers as Record<string, string>)['X-Region'],
  //   hasAuth: !!(headers as Record<string, string>)['Authorization']
  // });

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}/${endpoint.replace(/^\//, '')}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ServerApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

/**
 * Server-side GET request
 */
export async function serverGet<T = unknown>(
  endpoint: string,
  options: Omit<ServerFetchOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
  return serverFetch<T>(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * Server-side POST request
 */
export async function serverPost<T = unknown>(
  endpoint: string,
  body?: unknown,
  options: Omit<ServerFetchOptions, 'method'> = {}
): Promise<ApiResponse<T>> {
  return serverFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Custom error class for server API errors
 */
export class ServerApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ServerApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Get authentication headers for server-side requests
 */
export async function getAuthHeaders(locale: string = 'en'): Promise<HeadersInit> {
  const token = await getServerToken();
  const countryCode = await getServerCountryCode();
  const region = await getServerRegion();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept-Language': locale,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  if (countryCode) {
    (headers as Record<string, string>)['X-Country-Code'] = countryCode;
  }
  
  if (region) {
    (headers as Record<string, string>)['X-Region'] = region;
  }

  // console.log(`[getAuthHeaders] Generated headers:`, {
  //   'X-Country-Code': (headers as Record<string, string>)['X-Country-Code'],
  //   'X-Region': (headers as Record<string, string>)['X-Region'],
  //   hasAuth: !!(headers as Record<string, string>)['Authorization']
  // });

  return headers;
}

/**
 * Check if user is authenticated on server
 */
export async function checkServerAuth(): Promise<{
  isAuthenticated: boolean;
  token: string | null;
}> {
  const token = await getServerToken();
  return {
    isAuthenticated: !!token,
    token,
  };
}


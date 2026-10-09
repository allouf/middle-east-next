/**
 * Client-side CSRF Token Management
 * 
 * This hook provides client-side utilities for managing CSRF tokens
 * and automatically including them in API requests.
 */

import React, { useState, useEffect, useCallback } from 'react';

// CSRF configuration (should match server-side config)
export const CSRF_CLIENT_CONFIG = {
  TOKEN_ENDPOINT: '/api/csrf/token',
  HEADER_NAME: 'X-CSRF-Token',
  COOKIE_NAME: 'csrf_token',
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

/**
 * Get CSRF token from cookie
 */
export const getCSRFCookie = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${CSRF_CLIENT_CONFIG.COOKIE_NAME}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

/**
 * Set CSRF token in cookie (for client-side token management)
 */
export const setCSRFCookie = (token: string, maxAge: number = 86400): void => {
  if (typeof window === 'undefined') return;
  
  const isProduction = process.env.NODE_ENV === 'production';
  const secure = isProduction ? '; Secure' : '';
  const sameSite = '; SameSite=Strict';
  
  document.cookie = `${CSRF_CLIENT_CONFIG.COOKIE_NAME}=${token}; path=/; max-age=${maxAge}${sameSite}${secure}`;
};

/**
 * Check if CSRF token needs refresh
 */
export const shouldRefreshToken = (tokenExpiry?: number): boolean => {
  if (!tokenExpiry) return true;
  
  const now = Date.now();
  return (tokenExpiry - now) < CSRF_CLIENT_CONFIG.REFRESH_THRESHOLD;
};

/**
 * Fetch fresh CSRF token from server
 */
export const fetchCSRFToken = async (): Promise<{
  token: string;
  headerName: string;
  cookieName: string;
  maxAge: number;
}> => {
  const response = await fetch(CSRF_CLIENT_CONFIG.TOKEN_ENDPOINT);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch CSRF token: ${response.status}`);
  }
  
  const data = await response.json();
  return {
    token: data.csrfToken,
    headerName: data.headerName,
    cookieName: data.cookieName,
    maxAge: data.maxAge,
  };
};

/**
 * CSRF Token Hook
 * 
 * Automatically manages CSRF tokens for the application.
 * Fetches tokens when needed and handles refresh.
 */
export const useCSRFToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  // Initialize CSRF token
  const initializeToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First check if we have a valid token in cookie
      const existingToken = getCSRFCookie();
      
      if (existingToken && !shouldRefreshToken(tokenExpiry || 0)) {
        setToken(existingToken);
        setLoading(false);
        return;
      }
      
      // Fetch fresh token
      const tokenData = await fetchCSRFToken();
      setToken(tokenData.token);
      setTokenExpiry(Date.now() + (tokenData.maxAge * 1000));
      
      // Token is already set in cookie by the server
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize CSRF token');
      console.error('CSRF token initialization failed:', err);
    } finally {
      setLoading(false);
    }
  }, [tokenExpiry]);

  // Refresh token manually
  const refreshToken = useCallback(async () => {
    setTokenExpiry(0); // Force refresh
    await initializeToken();
  }, [initializeToken]);

  // Auto-refresh token when needed
  useEffect(() => {
    if (shouldRefreshToken(tokenExpiry || 0)) {
      initializeToken();
    }
  }, [tokenExpiry, initializeToken]);

  // Initialize on mount
  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  return {
    token,
    loading,
    error,
    refreshToken,
    headerName: CSRF_CLIENT_CONFIG.HEADER_NAME,
  };
};

/**
 * Enhanced fetch function with CSRF protection
 * 
 * Automatically includes CSRF token in requests that need it.
 */
export const secureFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getCSRFCookie();
  
  // Add CSRF token to unsafe methods
  const method = options.method || 'GET';
  const unsafeMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  
  const headers: HeadersInit = {
    ...options.headers,
  };
  
  if (unsafeMethods.includes(method.toUpperCase()) && token) {
    (headers as Record<string, string>)[CSRF_CLIENT_CONFIG.HEADER_NAME] = token;
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * CSRF Provider Component
 * 
 * Wraps the application and ensures CSRF tokens are available.
 */
export const CSRFProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading, error } = useCSRFToken();
  
  // You could add error handling here, like showing a toast
  useEffect(() => {
    if (error) {
      console.error('CSRF protection error:', error);
      // You might want to show a user-friendly error message
    }
  }, [error]);
  
  if (loading && !token) {
    // You could show a loading spinner here
    return React.createElement('div', null, children); // Still render children while loading
  }
  
  return React.createElement(React.Fragment, null, children);
};

/**
 * Form submission helper with CSRF
 * 
 * Automatically includes CSRF token in form submissions.
 */
export const submitFormWithCSRF = async (
  url: string,
  formData: FormData | Record<string, any>,
  method: 'POST' | 'PUT' | 'PATCH' = 'POST'
): Promise<Response> => {
  const token = getCSRFCookie();
  
  const headers: Record<string, string> = {};
  
  if (token) {
    headers[CSRF_CLIENT_CONFIG.HEADER_NAME] = token;
  }
  
  const body = formData instanceof FormData ? formData : JSON.stringify(formData);
  
  if (!(formData instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  return fetch(url, {
    method,
    headers,
    body,
  });
};

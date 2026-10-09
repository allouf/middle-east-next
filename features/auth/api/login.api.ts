// Login API - Server-side authentication utilities
// This file should ONLY be imported in Server Components or API routes

import type { LoginRequest, LoginResponse } from '../types';
import { serverPost, serverGet, getAuthHeaders, ServerApiError } from './server-fetch';

/**
 * Server-side login API call
 * Used for server components or API routes
 */
export async function serverLogin(
  credentials: LoginRequest,
  locale: string = 'en'
): Promise<LoginResponse> {
  return serverPost<LoginResponse['data']>('login', credentials, { locale });
}

/**
 * Server-side: Get current user profile (requires auth)
 */
export async function serverGetProfile(locale: string = 'en') {
  return serverGet('profile', { requireAuth: true, locale });
}

/**
 * Server-side: Refresh access token
 */
export async function serverRefreshToken(refreshToken: string, locale: string = 'en') {
  return serverPost('refresh', { refresh_token: refreshToken }, { locale });
}

/**
 * Server-side: Verify account with OTP
 */
export async function serverVerifyAccount(
  contact: string, 
  code: string,
  locale: string = 'en'
) {
  return serverPost('verify-account', { contact, code }, { locale });
}

/**
 * Server-side: Request password reset
 */
export async function serverForgotPassword(contact: string, locale: string = 'en') {
  return serverPost('forgot-password', { contact }, { locale });
}

/**
 * Server-side: Reset password with new credentials
 */
export async function serverResetPassword(
  contact: string,
  newPassword: string,
  confirmPassword: string,
  locale: string = 'en'
) {
  return serverPost('reset-password', {
    contact,
    new_password: newPassword,
    new_password_confirmation: confirmPassword,
  }, { locale });
}

// Re-export server utilities
export { getAuthHeaders, ServerApiError };


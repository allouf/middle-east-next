// Auth API - Client-safe utilities (no server-only imports)

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.mideastcom.net/api/v1";

/**
 * Get Google OAuth URL for authentication
 * Safe to use in client components
 */
export function getGoogleAuthUrl(): string {
  return `${API_URL}/auth/google`;
}


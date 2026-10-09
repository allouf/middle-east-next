// Auth Feature - Server-Only Exports
// Import this file only in Server Components and API routes

// Server API utilities
export {
  serverFetch,
  serverGet,
  serverPost,
  checkServerAuth,
  getAuthHeaders,
  ServerApiError,
} from './api/server-fetch';

export type {
  ServerFetchOptions,
  ApiResponse,
} from './api/server-fetch';

// Server Auth APIs
export {
  serverLogin,
  serverGetProfile,
  serverRefreshToken,
  serverVerifyAccount,
  serverForgotPassword,
  serverResetPassword,
} from './api/login.api';


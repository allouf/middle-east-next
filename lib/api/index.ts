// api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { baseURL } from "../../shared/constants/data";

import { runLogoutHandler } from "./authHandler";
import useCompleteProfile from "../store/useCompleteProfile";
import {
  saveAuthToStorage,
  STORAGE_KEYS,
  getAuthFromStorage,
  getCookie,
  getLocationCookie,
} from "../utils/auth-storage";

let isRefreshing: boolean = false;

interface QueuedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const getCurrentLang = (): string => {
  if (typeof window === "undefined") return "en";
  const lang = getCookie("i18nextLng") || "en";
  return lang.split("-")[0];
};

interface RefreshTokens {
  access_token: string;
  refresh_token: string;
}

interface RefreshUser {
  email?: string;
  is_verified?: boolean;
  role?: string;
}

interface RefreshResponse {
  tokens: RefreshTokens;
  user?: RefreshUser;
}

const persistRefreshedAuth = (tokens: RefreshTokens, user?: RefreshUser): void => {
  if (typeof window === "undefined") return;

  const storedAuth = getAuthFromStorage();
  const emailFromStorage = getCookie(STORAGE_KEYS.EMAIL) || "";

  const normalizedUser = {
    email: user?.email || emailFromStorage,
    is_verified: user?.is_verified ?? storedAuth.isVerified ?? false,
    role: user?.role || storedAuth.role || "consumer",
  };

  saveAuthToStorage({ tokens, user: normalizedUser });
};

export const refreshAuthTokens = async (): Promise<RefreshResponse | null> => {
  if (typeof window === "undefined") return null;

  const refreshToken = getCookie(STORAGE_KEYS.REFRESH);
  if (!refreshToken) return null;

  const response = await axios.post(
    `${baseURL}/refresh`,
    { refresh_token: refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": getCurrentLang(),
      },
    }
  );

  const payload = (response?.data as any)?.data || (response?.data as any) || {};
  const tokens: RefreshTokens | undefined = payload.tokens;

  if (!tokens?.access_token) {
    throw new Error("No access token returned");
  }

  persistRefreshedAuth(tokens, payload.user);

  return { tokens, user: payload.user };
};

const getAllowedOrigins = (): string[] => {
  const origins = [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'https://uat.middleeastcommerce.net',
    'https://beta.mideastcom.net',
    'https://uat.mideastcom.net',
    'https://www.middleeastcommerce.net',
  ];
  
  if (process.env.NODE_ENV === 'development') {
    origins.push('http://localhost:3000', 'http://localhost:3001');
  }
  
  return origins.filter(Boolean);
};

const getOriginForRequest = (): string => {
  if (typeof window === 'undefined') {
    return getAllowedOrigins()[0];
  }
  
  const currentOrigin = window.location.origin;
  const allowedOrigins = getAllowedOrigins();
  
  return allowedOrigins.includes(currentOrigin) ? currentOrigin : allowedOrigins[0];
};

const api: AxiosInstance = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
    "Access-Control-Allow-Origin": getOriginForRequest(),
    "Accept-Language": getCurrentLang(),
  },
});

// ✅ Attach access token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = getCookie(STORAGE_KEYS.TOKEN);
      const locationStored = getLocationCookie();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (locationStored) {
        const parsedLocation = locationStored;
        const countryCode = parsedLocation?.country?.shortName || parsedLocation?.country?.id;
        const region = parsedLocation?.region?.name;

        if (countryCode && config.headers) {
          config.headers["X-Country-Code"] = String(countryCode);
        }
        if (region && config.headers) {
          config.headers["X-Region"] = String(region);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // No response → network error or other issue
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // 🔁 If token expired → attempt refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window === "undefined") {
        return Promise.reject(error);
      }

      // Get refresh token from cookies
      const refreshToken = getCookie(STORAGE_KEYS.REFRESH);
      const isAuthEndpoint = originalRequest.url?.includes("login") || originalRequest.url?.includes("register");

      if (!refreshToken) {
        if (!isAuthEndpoint) {
          runLogoutHandler();
        }
        return Promise.reject(error);
      }

      // Handle parallel refresh requests safely
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers["Authorization"] = "Bearer " + token;
            }
            return token ? api(originalRequest) : Promise.reject(error);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshed = await refreshAuthTokens();
        const access_token = refreshed?.tokens?.access_token;

        if (!access_token) {
          throw new Error("No access token returned");
        }

        processQueue(null, access_token);

        // Update headers and retry the original request
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = "Bearer " + access_token;
        }
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        runLogoutHandler();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 🔴 Handle 400 errors with toast
    if (status === 400) {
      const message = (data as any)?.message || "Bad Request";
     // toast.error(message);
    }
    // 🔴 Handle custom error 475
    if (status === 475) {
      useCompleteProfile.getState().setIsCompleteProfile(true);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;

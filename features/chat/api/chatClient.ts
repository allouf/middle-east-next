import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { getCookie, STORAGE_KEYS } from "@/lib/utils/auth-storage";
import { refreshAuthTokens } from "@/lib/api";
import { runLogoutHandler } from "@/lib/api/authHandler";

const getCurrentLang = (): string => {
  if (typeof window === "undefined") return "en";
  const lang = getCookie("i18nextLng") || "en";
  return lang.split("-")[0];
};

const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || "https://apiuat-nest.middleeastcommerce.net/api/v1/user";

const chatClient: AxiosInstance = axios.create({
  baseURL: typeof window !== "undefined" ? "/api/chat-proxy" : chatApiUrl,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Accept-Language": getCurrentLang(),
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

chatClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = getCookie(STORAGE_KEYS.TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

chatClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window === "undefined") {
        return Promise.reject(error);
      }

      const refreshToken = getCookie(STORAGE_KEYS.REFRESH);
      if (!refreshToken) {
        runLogoutHandler();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return chatClient(originalRequest);
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

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return chatClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        runLogoutHandler();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default chatClient;

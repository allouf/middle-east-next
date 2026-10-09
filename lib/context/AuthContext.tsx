'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api, { refreshAuthTokens } from "../api";
import useCartStore from "../store/useCartStore";
import useCompareStore from "../store/useCompareStore";
import { setLogoutHandler } from "../api/authHandler";
import {
  saveAuthToStorage,
  clearAuthStorage,
  getAuthFromStorage,
  updateAuthStorage,
  STORAGE_KEYS,
  getCookie,
} from "../utils/auth-storage";

interface User {
  email: string;
  is_verified: boolean;
  role: string;
}

interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface AuthData {
  tokens: Tokens;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  setRole: (role: string | null) => void;
  updateRole: (newRole: string) => void;
  isVerified: boolean;
  login: (contact: string, password: string) => Promise<any>;
  googleLogin: (googleToken: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  setAuthData: (data: AuthData) => void;
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Hook
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

interface AuthStorage {
  role: string;
  isAuthenticated: boolean;
  isVerified: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ✅ Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const initialAuth = getAuthFromStorage();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAuth.isAuthenticated
  );
  const [role, setRole] = useState<string | null>(initialAuth.role);
  const [isVerified, setIsVerified] = useState<boolean>(initialAuth.isVerified);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  // ✅ Set Auth Data
  const setAuthData = useCallback(({ tokens, user }: AuthData): void => {
    saveAuthToStorage({ tokens, user });
    setIsAuthenticated(true);
    setRole(user.role);
    setIsVerified(user.is_verified);
  }, []);

  // ✅ Logout
  const logout = useCallback(async (): Promise<void> => {
    clearAuthStorage();
    setRole(null);

    // Clear cart data on logout
    const clearCart = useCartStore.getState().clear;
    clearCart();

    // Clear compare data on logout
    const clearCompare = useCompareStore.getState().clear;
    clearCompare();

    setIsAuthenticated(false);
    setIsVerified(false);
    window.location.replace('/');

  }, []);

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  // ✅ Refresh token
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshPromise = (async () => {
      try {
        const refreshed = await refreshAuthTokens();
        const accessToken = refreshed?.tokens?.access_token;

        if (!accessToken || !refreshed?.tokens) {
          logout();
          return null;
        }

        // Get email from cookie instead of localStorage
        const storedEmail = getCookie(STORAGE_KEYS.EMAIL) || "";

        const userData: User = {
          email: refreshed.user?.email || storedEmail,
          is_verified:
            refreshed.user?.is_verified ?? isVerified ?? false,
          role: refreshed.user?.role || role || "consumer",
        };

        setAuthData({ tokens: refreshed.tokens, user: userData });
        return accessToken;
      } catch (err: any) {
        console.error("Refresh failed:", err?.response?.data || err?.message);
        logout();
        return null;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  }, [isVerified, logout, role, setAuthData]);

  // ✅ Check auth on mount (no infinite redirects)
  useEffect(() => {
    const auth = getAuthFromStorage();

    if (auth.isAuthenticated) {
      setIsAuthenticated(true);
      setRole(auth.role);
      setIsVerified(auth.isVerified);
    } else {
      setIsAuthenticated(false);
    }

    setLoadingAuth(false);
  }, []);

  // ✅ Login
  const login = async (contact: string, password: string): Promise<void> => {
    try {
      const res = await api.post("login", { contact, password });
      const { user, tokens } = res.data.data;

      if (!user) throw new Error("User data not found in response");

      // ✅ Save minimal data (even if tokens are null)
      const userData: User = {
        email: user.email,
        is_verified: user.is_verified,
        role: user.role || "consumer",
      };

      // If tokens are missing, create temporary placeholders
      const safeTokens: Tokens = tokens || {
        access_token: "",
        refresh_token: "",
      };

      setAuthData({ tokens: safeTokens, user: userData });
      // console.log("11user.is_verified", user.is_verified);

      // Clear compare data on login
      const clearCompare = useCompareStore.getState().clear;
      clearCompare();

      return user;
    } catch (err: any) {
      const responseMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";

      // Avoid noisy console errors triggering overlays; log as warning in dev
      if (process.env.NODE_ENV === "development") {
        console.warn("Login failed:", responseMessage, err?.response?.data || err);
      }

      // Preserve response info for callers that inspect it
      const wrappedError: any = new Error(responseMessage);
      if (err?.response) {
        wrappedError.response = err.response;
      }
      throw wrappedError;
    }
  };

  // ✅ Google Login
  const googleLogin = async (googleToken: string): Promise<void> => {
    try {
      const res = await api.post("google-login", { token: googleToken });
      const { tokens, user } = res.data.data;
      setAuthData({ tokens, user });
    } catch (err: any) {
      console.error("Google login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  const updateRole = (newRole: string): void => {
    setRole(newRole);
    updateAuthStorage({ role: newRole });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        setRole,
        updateRole,
        isVerified,
        login,
        googleLogin,
        logout,
        refreshAccessToken,
        setAuthData,
        loadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

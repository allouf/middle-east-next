"use client";

import React, { createContext, useContext, useState } from "react";
import { useSecureGoogleMaps } from "@/hooks/useSecureGoogleMaps";
import { useTranslation } from "@/lib/i18n/useTranslation";

const MAP_LIBRARIES: ("places" | "marker")[] = ["places", "marker"];

// Store the initial locale globally to prevent re-initialization
let initialLocale: string | null = null;

interface GoogleMapsContextValue {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue>({
  isLoaded: false,
  loadError: undefined,
});

export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    __GOOGLE_MAPS_LANGUAGE__?: string;
  }
}

export default function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const { locale } = useTranslation();
  const [initialLocale] = useState(() => {
    if (typeof window !== "undefined") {
      if (!window.__GOOGLE_MAPS_LANGUAGE__) {
        window.__GOOGLE_MAPS_LANGUAGE__ = locale;
      }
      return window.__GOOGLE_MAPS_LANGUAGE__;
    }
    return locale;
  });

  const { isLoaded, loadError } = useSecureGoogleMaps();

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

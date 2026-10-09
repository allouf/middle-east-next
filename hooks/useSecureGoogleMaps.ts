'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

const MAP_LIBRARIES: ("places" | "marker")[] = ["places", "marker"];

interface UseSecureGoogleMapsReturn {
  isLoaded: boolean;
  loadError: Error | undefined;
}

/**
 * Secure Google Maps loader that fetches API key from server endpoint
 * This prevents exposing the API key in the client-side bundle
 */
export function useSecureGoogleMaps(): UseSecureGoogleMapsReturn {
  const { locale } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>();

  useEffect(() => {
    // Skip if already loaded
    if (isLoaded || (window as any).google?.maps) {
      setIsLoaded(true);
      return;
    }

    const loadGoogleMaps = async () => {
      try {
        // Load the Google Maps script through our secure API proxy
        const proxyUrl = `/api/maps?${new URLSearchParams({
          libraries: MAP_LIBRARIES.join(','),
          language: locale,
          callback: 'initGoogleMaps',
          loading: 'async'
        })}`;

        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = proxyUrl;

        // Set up the callback
        (window as any).initGoogleMaps = () => {
          setIsLoaded(true);
        };

        script.onerror = () => {
          setLoadError(new Error('Failed to load Google Maps API'));
        };

        document.head.appendChild(script);

      } catch (error) {
        setLoadError(error instanceof Error ? error : new Error('Unknown error loading Google Maps'));
      }
    };

    loadGoogleMaps();
  }, [locale, isLoaded]);

  return { isLoaded, loadError };
}

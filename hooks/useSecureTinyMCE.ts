'use client';

import { useState, useEffect } from 'react';

interface UseSecureTinyMCEReturn {
  apiKey: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Secure TinyMCE API key hook
 * Fetches the API key from our secure server endpoint
 */
export function useSecureTinyMCE(): UseSecureTinyMCEReturn {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tinymce');
        
        if (!response.ok) {
          throw new Error('Failed to fetch TinyMCE API key');
        }
        
        const data = await response.json();
        setApiKey(data.apiKey || '');
        setError(null);
      } catch (err) {
        console.error('TinyMCE API key fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setApiKey('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  return { apiKey, isLoading, error };
}

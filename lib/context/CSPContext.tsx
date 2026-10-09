'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface CSPContextType {
  nonce: string | null;
}

const CSPContext = createContext<CSPContextType>({ nonce: null });

export function CSPProvider({ children }: { children: React.ReactNode }) {
  const [nonce, setNonce] = useState<string | null>(null);

  useEffect(() => {
    // Get nonce from server-side headers or client-side storage
    const getNonce = () => {
      // Try to get from meta tag first (server-side)
      const metaTag = document.querySelector('meta[name="x-nonce"]');
      if (metaTag) {
        return metaTag.getAttribute('content');
      }
      
      // Fallback to headers (client-side)
      return null; // Headers not accessible from client-side
    };

    const nonceValue = getNonce();
    if (nonceValue) {
      setNonce(nonceValue);
    }
  }, []);

  return (
    <CSPContext.Provider value={{ nonce }}>
      {children}
    </CSPContext.Provider>
  );
}

export function useCSPNonce() {
  const context = useContext(CSPContext);
  if (!context) {
    throw new Error('useCSPNonce must be used within a CSPProvider');
  }
  return context;
}

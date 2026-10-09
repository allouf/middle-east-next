'use client';

import { createContext, useState, useContext, useRef, ReactNode } from "react";

interface LoadingContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loading, setLoadingState] = useState<boolean>(false);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MIN_LOADING_TIME = 5000; // ⏳ 5 seconds fixed minimum

  const setLoading = (value: boolean): void => {
    if (value) {
      // Start loading
      setLoadingState(true);
      startTimeRef.current = Date.now();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      // Try to stop — ensure minimum time has passed
      const elapsed = Date.now() - (startTimeRef.current || 0);
      const remaining = MIN_LOADING_TIME - elapsed;

      if (remaining > 0) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setLoadingState(false), remaining);
      } else {
        setLoadingState(false);
      }
    }
  };

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

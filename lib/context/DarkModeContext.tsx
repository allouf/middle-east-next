'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | null>(null);

// Hook to use dark mode
export const useDarkMode = (): DarkModeContextType => {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used within DarkModeProvider");
  return ctx;
};

// Provider component
interface DarkModeProviderProps {
  children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize dark mode on client side only
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        setIsDarkMode(saved === "true");
      } else {
        // Fallback to system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem("darkMode", newValue.toString());
      }
      return newValue;
    });
  };

  // Set dark mode explicitly
  const setDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem("darkMode", value.toString());
    }
  };

  // Apply dark mode class to document root
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode, mounted]);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (typeof window !== 'undefined' && localStorage.getItem("darkMode") === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted]);

  return (
    <DarkModeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
      }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};


"use client";

import { ThemeProvider } from "next-themes";
import { LoadingProvider } from "@/lib/context/LoadingContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { DarkModeProvider } from "@/lib/context/DarkModeContext";
import { AlertProvider } from "@/lib/context/AlertProvider";

import { ReactNode } from "react";
import AntdRegistry from "@/providers/AntdRegistry";
import GoogleMapsProvider from "@/providers/GoogleMapsProvider";

export function Providers({ children, locale, nonce }: { children: ReactNode; locale?: string; nonce?: string }) {
  return (
    <AntdRegistry locale={locale} nonce={nonce}>
      {/* <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="darkMode"
      > */}
        <DarkModeProvider>
          <LoadingProvider>
            <AuthProvider>
              <AlertProvider>
                <GoogleMapsProvider>
                  {children}
                </GoogleMapsProvider>
              </AlertProvider>
            </AuthProvider>
          </LoadingProvider>
        </DarkModeProvider>
      {/* </ThemeProvider> */}
    </AntdRegistry>
  );
}


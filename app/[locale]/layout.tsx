import type { Metadata } from "next";
import "../../styles/globals.css";
import { Providers } from "../providers";
import { I18nProvider } from "@/providers/I18nProvider";
import ConditionalLayout from "@/components/layouts/ConditionalLayout";
import { DEFAULT_LOCALE, Locale, normalizeLocale } from "@/lib/i18n/locales";
import localFont from "next/font/local";
import { LocaleHtmlAttributes } from "@/components/shared/LocaleHtmlAttributes";
import Script from "next/script";
import { headers } from "next/headers";

const somar = localFont({
  src: [
    {
      path: "../../assets/fonts/SomarSans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/SomarSans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/SomarSans-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../assets/fonts/SomarSans-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-somar",
  display: "swap",
});

const somarSansExpanded = localFont({
  src: [
    { path: "../../assets/fonts/SomarSans-ExtraLightExpanded.otf", weight: "200", style: "normal" },
    { path: "../../assets/fonts/SomarSans-LightExpanded.otf", weight: "300", style: "normal" },
    { path: "../../assets/fonts/SomarSans-MediumExpanded.otf", weight: "500", style: "normal" },
    { path: "../../assets/fonts/SomarSans-SemiBoldExpanded.otf", weight: "600", style: "normal" },
    { path: "../../assets/fonts/SomarSans-BoldExpanded.otf", weight: "700", style: "normal" },
    { path: "../../assets/fonts/SomarSans-ExtraBoldExpanded.otf", weight: "800", style: "normal" },
  ],
  variable: "--font-somar-sans-expanded",
  display: "swap",
});
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const locale: Locale = normalizeLocale(resolvedParams?.locale || DEFAULT_LOCALE);
  const localizedPath = `/${locale}`;

  return {
    title: {
      default: "Middle East - Your Platform for Jobs, Ads, Community & More",
      template: "%s | Middle East",
    },
    description:
      "Join Middle East platform for job opportunities, classified ads, community engagement, auctions, and e-commerce. Connect with professionals across the Middle East region.",
    keywords: [
      "Middle East",
      "jobs",
      "classified ads",
      "community",
      "auctions",
      "e-commerce",
      "Middle East region",
    ],
    authors: [{ name: "Middle East Platform" }],
    creator: "Middle East Platform",
    publisher: "Middle East Platform",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: localizedPath,
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar" : "en_US",
      url: localizedPath,
      siteName: "Middle East Platform",
      title: "Middle East - Your Platform for Jobs, Ads, Community & More",
      description:
        "Join Middle East platform for job opportunities, classified ads, community engagement, auctions, and e-commerce.",
      images: [
        {
          url: "/logo.svg",
          width: 1200,
          height: 630,
          alt: "Middle East Platform",
        },
      ],
    },
    icons: {
      icon: [
        { url: "/favicon.svg", sizes: "any" },
        { url: "/favicon.svg", sizes: "32x32", type: "image/x-icon" },
      ],
      apple: [{ url: "/favicon.svg", sizes: "180x180" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Middle East - Your Platform for Jobs, Ads, Community & More",
      description:
        "Join Middle East platform for job opportunities, classified ads, community engagement, auctions, and e-commerce.",
      images: ["/logo.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Add your verification codes here
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const resolvedParams = await params;
  const locale: Locale = normalizeLocale(resolvedParams?.locale || DEFAULT_LOCALE);
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Get nonce from headers
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <meta name="x-nonce" content={nonce} />
      </head>
      <body id="root" className={`${somar.variable} ${somarSansExpanded.variable} font-sans antialiased`} dir={dir}>
        <>
          {/* <Script
            id="locale-bootstrap"
            strategy="beforeInteractive"
            nonce={nonce || undefined}
          >
            {`
            (() => {
              try {
                const key = "i18nextLng";
                const supported = ["en", "ar"];
                const segments = window.location.pathname.split("/").filter(Boolean);
                const maxAge = 30 * 24 * 60 * 60;
                
                // Get current cookie value
                const getCookie = (name) => {
                  const value = "; " + document.cookie;
                  const parts = value.split("; " + name + "=");
                  if (parts.length === 2) return parts.pop().split(";").shift();
                  return null;
                };
                
                const existing = getCookie(key);
                const pathLocale = segments.length > 0 && supported.includes(segments[0]) ? segments[0] : null;
                
                // If we found a path locale, sync the cookie immediately
                if (pathLocale) {
                  document.cookie = key + "=" + pathLocale + "; path=/; max-age=" + maxAge + "; SameSite=Lax";
                }

                // If cookie has a different preference than the current path segment, redirect once.
                if (existing && pathLocale && existing !== pathLocale && supported.includes(existing)) {
                  const newPathname = window.location.pathname.replace("/" + pathLocale, "/" + existing);
                  window.location.replace(newPathname + window.location.search + window.location.hash);
                  return;
                }

                if (!pathLocale) return;

                const dir = pathLocale === "ar" ? "rtl" : "ltr";
                document.documentElement.lang = pathLocale;
                document.documentElement.dir = dir;
                if (document.body) {
                  document.body.dir = dir;
                }
              } catch (_) {
                /* ignore bootstrap errors */
              }
            {/* })();
          `} */}
          {/* </Script> */} 
          <I18nProvider locale={locale}>
            <Providers locale={locale} nonce={nonce}>
              <LocaleHtmlAttributes locale={locale} />
              <ConditionalLayout>{children}</ConditionalLayout>
            </Providers>
          </I18nProvider>
        </>
      </body>
    </html>
  );
}

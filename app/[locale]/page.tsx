import { Metadata } from "next";
import {
  TopOffers,
  BestSellers,
  SuggestedProducts,
  FreeShippingProducts,
  DiscountedProducts,
  RecommendedProducts,
  FeaturedSection,
  HomeHeaderBanner,
  PopularCategories,
  PromoBanner,
  UsedMarketBanner,
  FreeZoneBanner,
} from "@/features/home";
import SponsoredProducts_server from "@/features/home/components/SponsoredProducts_server";
import HighlightCards from "@/features/home/components/HighlightCards.server";
import { hasAvailableProducts } from "@/features/home/api/productAvailability";
import HomeEmptyState from "@/features/home/components/HomeEmptyState";
import { DEFAULT_LOCALE, Locale, normalizeLocale } from "@/lib/i18n/locales";
import { getT } from "@/lib/i18n/server";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale: Locale = normalizeLocale(resolvedParams?.locale || DEFAULT_LOCALE);
  const t = await getT(locale);
  const translatedTitle = t("home.meta.title");
  const translatedDescription = t("home.meta.description");
  const translatedOgTitle = t("home.meta.ogTitle");
  const translatedOgDescription = t("home.meta.ogDescription");
  const translatedSiteName = t("home.meta.siteName");
  const translatedKeywords = t("home.meta.keywords");

  const fallbackTitle = "Home - Middle East Platform";
  const fallbackDescription =
    "Discover the best deals, job opportunities, classified ads, and community features in the Middle East. Shop products, find jobs, connect with your community, and participate in auctions.";
  const fallbackOgTitle = "Middle East Platform - Your Gateway to Opportunities";
  const fallbackOgDescription =
    "Discover the best deals, job opportunities, classified ads, and community features in the Middle East.";
  const fallbackSiteName = "Middle East Platform";
  const fallbackKeywords = [
    "Middle East",
    "e-commerce",
    "jobs",
    "classified ads",
    "community",
    "auctions",
    "shopping",
    "Middle East region",
  ];

  const title =
    translatedTitle && translatedTitle !== "home.meta.title"
      ? translatedTitle
      : fallbackTitle;

  const description =
    translatedDescription && translatedDescription !== "home.meta.description"
      ? translatedDescription
      : fallbackDescription;

  const ogTitle =
    translatedOgTitle && translatedOgTitle !== "home.meta.ogTitle"
      ? translatedOgTitle
      : title || fallbackOgTitle;

  const ogDescription =
    translatedOgDescription && translatedOgDescription !== "home.meta.ogDescription"
      ? translatedOgDescription
      : description || fallbackOgDescription;

  const siteName =
    translatedSiteName && translatedSiteName !== "home.meta.siteName"
      ? translatedSiteName
      : fallbackSiteName;

  const keywords =
    translatedKeywords && translatedKeywords !== "home.meta.keywords"
      ? translatedKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean)
      : fallbackKeywords;
  const localizedPath = `/${locale}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: localizedPath,
      siteName,
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "Middle East Platform",
        },
      ],
      locale: locale === "ar" ? "ar" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ["/logo.png"],
    },
    alternates: {
      canonical: localizedPath,
      languages: {
        en: "/en",
        ar: "/ar",
      },
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
  };
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const locale = resolvedParams?.locale || "en";
  const searchParamsProps = resolvedSearchParams ?? {};

  const availability = await hasAvailableProducts(locale);

  if (availability.error || !availability.hasProducts) {
    return <HomeEmptyState isError={availability.error} />;
  }

  return (
    <>
      <HomeHeaderBanner locale={locale} />
      <TopOffers locale={locale} />
      <PopularCategories locale={locale} />
      <BestSellers locale={locale} />
      <FeaturedSection locale={locale} />
      <SuggestedProducts locale={locale} />
      <FreeZoneBanner />
      <SponsoredProducts_server
        locale={locale}
        searchParams={searchParamsProps}
      />
      <PromoBanner locale={locale} />
      <RecommendedProducts locale={locale} />
      <DiscountedProducts locale={locale} />

      <PromoBanner locale={locale} />
      <HighlightCards locale={locale} />
      <FreeShippingProducts locale={locale} />
      <UsedMarketBanner />
    </>
  );
}

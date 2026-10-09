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
} from "@/features/home";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Home - Middle East Platform",
    description:
      "Discover the best deals, job opportunities, classified ads, and community features in the Middle East. Shop products, find jobs, connect with your community, and participate in auctions.",
    keywords: [
      "Middle East",
      "e-commerce",
      "jobs",
      "classified ads",
      "community",
      "auctions",
      "shopping",
      "Middle East region",
    ],
    openGraph: {
      title: "Middle East Platform - Your Gateway to Opportunities",
      description:
        "Discover the best deals, job opportunities, classified ads, and community features in the Middle East.",
      url: "/en",
      siteName: "Middle East Platform",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "Middle East Platform",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Middle East Platform - Your Gateway to Opportunities",
      description:
        "Discover the best deals, job opportunities, classified ads, and community features in the Middle East.",
      images: ["/logo.png"],
    },
    alternates: {
      canonical: "/en",
      languages: {
        en: "/en",
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

export default async function Home() {
  const locale = "en";

  return (
    <>
      <HomeHeaderBanner locale={locale} />
      <TopOffers locale={locale} />
      <PopularCategories locale={locale} />
      <BestSellers locale={locale} />
      <FeaturedSection locale={locale} />
      <SuggestedProducts locale={locale} />
      <RecommendedProducts locale={locale} />
      <PromoBanner locale={locale} />
      <DiscountedProducts locale={locale} />
      <FreeShippingProducts locale={locale} />
      <UsedMarketBanner />
    </>
  );
}

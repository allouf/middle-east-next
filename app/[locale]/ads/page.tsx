import AdsPage from "@/features/ads/components/AdsPage";
import CategoriesSkeleton from "@/features/category/components/CategoriesSkeleton";
import { AdSearchParams } from "@/features/ads/types/type";
import { Metadata } from "next";
import { Suspense } from "react";


export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? `الإعلانات - منصة الشرق الأوسط`
      : `Ads - Middle East Platform`,
    description: isArabic
      ? `تصفح جميع الإعلانات المتاحة`
      : `Browse all available ads`,
    keywords: ["ads", "classifieds", "marketplace", "Middle East"],
    openGraph: {
      title: isArabic
        ? `الإعلانات - منصة الشرق الأوسط`
        : `Ads - Middle East Platform`,
      description: isArabic
        ? `تصفح جميع الإعلانات المتاحة`
        : `Browse all available ads`,
      url: `/${locale}/ads`,
      siteName: "Middle East Platform",
      locale: isArabic ? "ar_SA" : "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AdsRoutePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<AdSearchParams>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams ?? {};

  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <AdsPage searchParams={resolvedSearchParams} locale={locale} />
    </Suspense>
  );
}



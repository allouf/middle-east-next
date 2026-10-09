import ServicesPage from "@/features/services/components/ServicesPage";
import CategoriesSkeleton from "@/features/category/components/CategoriesSkeleton";
import { ServiceSearchParams } from "@/features/services/types/type";
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
      ? `الخدمات - منصة الشرق الأوسط`
      : `Services - Middle East Platform`,
    description: isArabic
      ? `تصفح جميع الخدمات المتاحة`
      : `Browse all available services`,
    keywords: ["services", "professionals", "freelance", "Middle East"],
    openGraph: {
      title: isArabic
        ? `الخدمات - منصة الشرق الأوسط`
        : `Services - Middle East Platform`,
      description: isArabic
        ? `تصفح جميع الخدمات المتاحة`
        : `Browse all available services`,
      url: `/${locale}/services`,
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

export default async function ServicesRoutePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ServiceSearchParams>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams ?? {};

  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <ServicesPage searchParams={resolvedSearchParams} locale={locale} />
    </Suspense>
  );
}

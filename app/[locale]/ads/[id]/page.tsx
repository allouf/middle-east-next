import { Metadata } from "next";

import AdDetailsPageServer from "@/features/ads/components/AdDetailsPageServer";
import { Suspense } from "react";
import LoaderPage from "@/components/shared/LoaderPage";
import AdDetailsSkeleton from "@/features/ads/components/AdDetailsSkeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? `تفاصيل الإعلان - منصة الشرق الأوسط`
      : `Ad Details - Middle East Platform`,
    description: isArabic ? `عرض تفاصيل الإعلان` : `View Ad Details`,
  };
}

export default async function AdDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id ,locale } = await params;
  return <Suspense fallback={<AdDetailsSkeleton />}>
    <AdDetailsPageServer adId={id} locale={locale}/>
  </Suspense>
}

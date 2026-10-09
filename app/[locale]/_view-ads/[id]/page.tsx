import { Metadata } from "next";
import ViewAds from "@/pages/Ads/ViewAds";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? `عرض الإعلان - منصة الشرق الأوسط`
      : `View Ad - Middle East Platform`,
    description: isArabic
      ? `عرض الإعلان`
      : `View ad`,
  };
}

export default async function ViewAdsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <ViewAds adId={id} />;
}



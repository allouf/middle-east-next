import { Metadata } from "next";
import AddAds from "@/pages/Ads/AddAds";

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
      ? "إضافة إعلان - منصة الشرق الأوسط"
      : "Add Ad - Middle East Platform",
    description: isArabic
      ? "أضف إعلان جديد"
      : "Add a new ad",
  };
}

export default async function AddAdsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <AddAds />;
}



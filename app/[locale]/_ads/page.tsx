import { Metadata } from "next";
import Ads from "@/pages/Ads/Ads";

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
    title: isArabic ? "الإعلانات - منصة الشرق الأوسط" : "Ads - Middle East Platform",
    description: isArabic
      ? "تصفح الإعلانات المتاحة"
      : "Browse available ads",
  };
}

export default async function AdsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <Ads />;
}

import { Metadata } from "next";
import AdsDetail from "@/pages/SignalAds/AdsDetail";

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
      ? `تفاصيل الإعلان - منصة الشرق الأوسط`
      : `Ad Details - Middle East Platform`,
    description: isArabic
      ? `عرض تفاصيل الإعلان`
      : `View ad details`,
  };
}

export default async function AdDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <AdsDetail adId={id} />;
}



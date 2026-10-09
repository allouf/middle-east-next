import { Metadata } from "next";
import Auction from "@/pages/Auction";

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
      ? "المزادات - منصة الشرق الأوسط"
      : "Auctions - Middle East Platform",
    description: isArabic
      ? "تصفح المزادات المتاحة"
      : "Browse available auctions",
  };
}

export default async function AuctionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <Auction />;
}



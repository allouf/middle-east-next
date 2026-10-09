import { Metadata } from "next";
import AuctionDetails from "@/pages/Auction/AuctionDetails";

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
      ? `تفاصيل المزاد - منصة الشرق الأوسط`
      : `Auction Details - Middle East Platform`,
    description: isArabic
      ? `عرض تفاصيل المزاد`
      : `View auction details`,
  };
}

export default async function AuctionDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <AuctionDetails auctionId={id} />;
}



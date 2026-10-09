import { Metadata } from "next";
import ShowAuction from "@/pages/Auction/ShowAuction";

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
      ? `عرض المزاد - منصة الشرق الأوسط`
      : `View Auction - Middle East Platform`,
    description: isArabic
      ? `عرض المزاد`
      : `View auction`,
  };
}

export default async function ShowAuctionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <ShowAuction auctionId={id} />;
}



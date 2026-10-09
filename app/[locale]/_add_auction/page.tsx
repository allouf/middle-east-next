import { Metadata } from "next";
import AddAuction from "@/pages/Auction/AddAuction";

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
      ? "إضافة مزاد - منصة الشرق الأوسط"
      : "Add Auction - Middle East Platform",
    description: isArabic
      ? "أضف مزاد جديد"
      : "Add a new auction",
  };
}

export default async function AddAuctionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <AddAuction />;
}



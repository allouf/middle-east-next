import { Metadata } from "next";
import Invitation from "@/pages/E-Commerce/Invitation";

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
      ? "دعوة المتجر - منصة الشرق الأوسط"
      : "Store Invitation - Middle East Platform",
    description: isArabic
      ? "قبول دعوة المتجر"
      : "Accept store invitation",
  };
}

export default async function StoreInvitationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <Invitation />;
}



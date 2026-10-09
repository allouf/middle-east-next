import { Metadata } from "next";
import ReelsPage from "@/pages/Community/Components/reels";

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
      ? `ريل - منصة الشرق الأوسط`
      : `Reel - Middle East Platform`,
    description: isArabic
      ? `عرض الريل`
      : `View reel`,
  };
}

export default async function ReelsPageRoute({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <ReelsPage reelId={id} />;
}



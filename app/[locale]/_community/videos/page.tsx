import { Metadata } from "next";
import Videos from "@/pages/Community/Components/videos/videos";

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
      ? "الفيديوهات - منصة الشرق الأوسط"
      : "Videos - Middle East Platform",
    description: isArabic
      ? "تصفح الفيديوهات"
      : "Browse videos",
  };
}

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <Videos />;
}



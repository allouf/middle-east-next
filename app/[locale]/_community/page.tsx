import { Metadata } from "next";
import Community from "@/pages/Community";

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
      ? "المجتمع - منصة الشرق الأوسط"
      : "Community - Middle East Platform",
    description: isArabic
      ? "انضم إلى المجتمع"
      : "Join the community",
  };
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <Community />;
}



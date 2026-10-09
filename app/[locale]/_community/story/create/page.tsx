import { Metadata } from "next";
import Create from "@/pages/Community/Components/create/create";

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
      ? "إنشاء قصة - منصة الشرق الأوسط"
      : "Create Story - Middle East Platform",
    description: isArabic
      ? "أنشئ قصة جديدة"
      : "Create a new story",
  };
}

export default async function CreateStoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <Create />;
}



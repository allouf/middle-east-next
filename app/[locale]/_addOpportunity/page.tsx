import { Metadata } from "next";
import NewOpportunity from "@/pages/Jobs/NewOpportunity";

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
      ? "إضافة فرصة عمل - منصة الشرق الأوسط"
      : "Add Job Opportunity - Middle East Platform",
    description: isArabic
      ? "أضف فرصة عمل جديدة"
      : "Add a new job opportunity",
  };
}

export default async function AddOpportunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <NewOpportunity />;
}



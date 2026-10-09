import { Metadata } from "next";
import { JobDetailsServerPage, JobDetailsSkeleton } from "@/features/jobsServices";
import { Suspense } from "react";

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
      ? `تفاصيل الوظيفة - منصة الشرق الأوسط`
      : `Job Details - Middle East Platform`,
    description: isArabic
      ? `عرض تفاصيل الوظيفة`
      : `View job details`,
  };
}
export const dynamicParams = true;

export default async function Page({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = await params;
  return (
    <Suspense fallback={<JobDetailsSkeleton />}>
      <JobDetailsServerPage locale={locale} id={id} />
    </Suspense>
  );
}



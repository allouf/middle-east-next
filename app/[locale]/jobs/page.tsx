import { JobsPage, JobsPageSkeleton } from "@/features/jobsServices";
import { Metadata } from "next";
import { Suspense } from "react";

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
    title: isArabic ? "الوظائف - منصة الشرق الأوسط" : "Jobs - Middle East Platform",
    description: isArabic
      ? "تصفح الوظائف المتاحة"
      : "Browse available jobs",
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  await params;
  return (
    <Suspense fallback={<JobsPageSkeleton />}>
      <JobsPage params={await params} searchParams={await searchParams} />
    </Suspense>
  );
}



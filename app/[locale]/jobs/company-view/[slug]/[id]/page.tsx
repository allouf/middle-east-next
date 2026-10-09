import { Metadata } from "next";
import { CompanyProfile, CompanyProfileSkeleton } from "@/features/jobsServices";
import { Suspense } from "react";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
   params: { locale: string; slug: string; id: string };
}): Promise<Metadata> {
 const { locale, slug, id } = await params;
   const isArabic = locale === "ar";

  // ممكن لاحقاً تجيب بيانات الشركة من API باستخدام slug
  const companyName = slug?.replace(/-/g, " ");

  return {
    title: isArabic
      ? `${companyName} | ملف الشركة - منصة الشرق الأوسط`
      : `${companyName} | Company Profile - Middle East Platform`,

    description: isArabic
      ? `تعرّف على شركة ${companyName}، وظائفها، معلومات التواصل، والتفاصيل الكاملة عبر منصة الشرق الأوسط.`
      : `Explore ${companyName} profile, available jobs, company information and full details on Middle East Platform.`,

    openGraph: {
      title: isArabic
        ? `${companyName} | ملف الشركة`
        : `${companyName} | Company Profile`,
      description: isArabic
        ? `اكتشف معلومات شركة ${companyName} والوظائف المتاحة لديها.`
        : `Discover ${companyName} company information and job opportunities.`,
      type: "website",
      locale: isArabic ? "ar_AR" : "en_US",
    },

    alternates: {
      canonical: `/${locale}/companies/${slug}`,
      languages: {
        en: `/en/companies/${slug}`,
        ar: `/ar/companies/${slug}`,
      },
    },
  };
}

export const dynamicParams = true;

export default async function Page({
  params,
}: {
  params: { locale: string; id: string };
}) {
  return (
    <Suspense fallback={<CompanyProfileSkeleton />}>
      <CompanyProfile params={params} />
    </Suspense>
  );
}

import { Metadata } from "next";
import { Suspense } from "react";
import LoaderPage from "@/components/shared/LoaderPage";
import ServiceDetailsPageServer from "@/features/services/components/details/ServiceDetailsPageServer";
import ServiceDetailsSkeleton from "@/features/services/components/details/ServiceDetailsSkeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? `تفاصيل الخدمة - منصة الشرق الأوسط`
      : `Service Details - Middle East Platform`,
    description: isArabic ? `عرض تفاصيل الخدمة` : `View Service Details`,
  };
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await params;
  
  return (
    <Suspense fallback={<ServiceDetailsSkeleton />}>
      <ServiceDetailsPageServer serviceId={id} locale={locale} />
    </Suspense>
  );
}

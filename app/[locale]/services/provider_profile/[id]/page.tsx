import { Metadata } from "next";
import ProviderProfilePublicPage from "@/features/services/components/providerProfile/ProviderProfilePublicPage";
import ProviderProfilePublicPage_server from "@/features/services/components/providerProfile/ProviderProfilePublicPage_server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? `ملف المزود - منصة الشرق الأوسط`
      : `Provider Profile - Middle East Platform`,
    description: isArabic ? `عرض ملف المزود` : `View Provider Profile`,
  };
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await params;
  
  return (
    <ProviderProfilePublicPage_server id={id} locale={locale}/>
  );
}

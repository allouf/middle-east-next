import { Metadata } from "next";
import { StoreManagement } from "@/features/stores";

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
      ? `إدارة المتجر - منصة الشرق الأوسط`
      : `Store Management - Middle East Platform`,
    description: isArabic
      ? `إدارة متجرك`
      : `Manage your store`,
  };
}

export default async function StoreManagementPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <StoreManagement storeId={id} />;
}



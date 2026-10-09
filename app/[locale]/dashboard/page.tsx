import { getServerAuth } from "@/lib/utils/auth-storage-server";
import { redirect } from "next/navigation";
import ProfilePage_server from "@/features/profile/components/ProfilePage_server";
import { Metadata } from "next";

type DashboardPageParams = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ tab?: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: DashboardPageParams): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? "لوحة التحكم - منصة الشرق الأوسط"
      : "Dashboard - Middle East Platform",
    description: isArabic
      ? "لوحة التحكم الخاصة بك"
      : "Your dashboard",
  };
}

export default async function DashboardPage({ params, searchParams }: DashboardPageParams) {
  const { locale } = await params;
  const normalizedParams = await searchParams;

  return <ProfilePage_server searchParams={normalizedParams} locale={locale} pageType="dashboard" />
}

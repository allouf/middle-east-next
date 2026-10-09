import { Profile } from "@/features/profile";
import { Metadata } from "next";
import { ProfileApiResponse } from "@/features/profile/types";

type ProfilePageParams = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ tab?: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: ProfilePageParams): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? "الحساب - منصة الشرق الأوسط"
      : "Profile - Middle East Platform",
    description: isArabic
      ? "ادارة الحساب"
      : "Manage your profile",
  };
}

export default async function ProfilePage({ params,searchParams }: ProfilePageParams) {
  const { locale } = await params;
  const normalizedParams = await searchParams;



  return <Profile  searchParams={normalizedParams} locale={locale} pageType="profile"/>
}

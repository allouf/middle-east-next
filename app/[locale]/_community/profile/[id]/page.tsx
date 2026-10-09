import { Metadata } from "next";
import Profile from "@/pages/Community/Components/Profile/profile";

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
      ? `الملف الشخصي - منصة الشرق الأوسط`
      : `Profile - Middle East Platform`,
    description: isArabic
      ? `عرض الملف الشخصي`
      : `View profile`,
  };
}

export default async function CommunityProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <Profile profileId={id} />;
}



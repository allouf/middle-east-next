import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth-storage-server";
import StripeOnboardingRefresh from "@/features/seller/stripeOnboarding/Refresh";

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
    title: isArabic ? "تجديد رابط الدفع" : "Refreshing Onboarding Link",
    description: isArabic ? "إنشاء رابط ربط جديد" : "Generating a fresh onboarding link",
  };
}

export default async function StripeOnboardingRefreshPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const token = await getServerToken();
  if (!token) redirect("/login");
  return <StripeOnboardingRefresh />;
}

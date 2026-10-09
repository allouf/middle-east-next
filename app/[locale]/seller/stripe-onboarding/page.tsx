import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth-storage-server";
import StripeOnboardingMain from "@/features/seller/stripeOnboarding/Main";

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
    title: isArabic ? "إعداد الدفع" : "Payment onboarding",
    description: isArabic ? "ربط حساب Stripe لاستقبال المدفوعات" : "Connect Stripe to receive payments",
  };
}

export default async function StripeOnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const token = await getServerToken();
  if (!token) redirect("/login");
  return <StripeOnboardingMain />;
}

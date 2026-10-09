import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth-storage-server";
import StripeOnboardingReturn from "@/features/seller/stripeOnboarding/Return";

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
    title: isArabic ? "تأكيد ربط الدفع" : "Confirming Onboarding",
    description: isArabic ? "تأكيد حالة حساب Stripe" : "Verifying your Stripe account status",
  };
}

export default async function StripeOnboardingReturnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const token = await getServerToken();
  if (!token) redirect("/login");
  return <StripeOnboardingReturn />;
}

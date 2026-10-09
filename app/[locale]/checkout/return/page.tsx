import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth-storage-server";
import CheckoutReturn from "@/features/checkout/Return";

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
    title: isArabic ? "تأكيد الدفع" : "Confirming Payment",
    description: isArabic ? "نتحقق من حالة الدفع" : "Confirming your payment",
  };
}

export default async function CheckoutReturnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const token = await getServerToken();
  if (!token) redirect("/login");

  return <CheckoutReturn />;
}

import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth-storage-server";
import CheckoutCancel from "@/features/checkout/Cancel";

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
    title: isArabic ? "تم إلغاء الدفع" : "Payment Cancelled",
    description: isArabic ? "تم إلغاء عملية الدفع" : "The payment was cancelled",
  };
}

export default async function CheckoutCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const token = await getServerToken();
  if (!token) redirect("/login");

  return <CheckoutCancel />;
}

import { Checkout } from "@/features/checkout";
import { getServerToken } from "@/lib/utils/auth-storage-server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

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
    title: isArabic
      ? "الدفع - منصة الشرق الأوسط"
      : "Checkout - Middle East Platform",
    description: isArabic
      ? "إتمام عملية الشراء"
      : "Complete your purchase",
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

      const token = await getServerToken();
    
      if (!token) {
        redirect('/login');
      }
  return <Checkout />;
}



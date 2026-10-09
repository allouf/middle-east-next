import { Metadata } from "next";
import { RegisterPage } from "@/features/auth";

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
    title: isArabic ? "التسجيل - منصة الشرق الأوسط" : "Register - Middle East Platform",
    description: isArabic
      ? "أنشئ حساب جديد"
      : "Create a new account",
  };
}

import { headers } from "next/headers";

export default async function Register({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const headerList = await headers();
  const defaultCountry = headerList.get("x-country-code") || undefined;
  const defaultRegion = headerList.get("x-region-name") || undefined;

  return <RegisterPage defaultCountry={defaultCountry} defaultRegion={defaultRegion} />;
}



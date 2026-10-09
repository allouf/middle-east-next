import { Metadata } from "next";
import { LoginPage } from "@/features/auth";

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
    title: isArabic ? "تسجيل الدخول - منصة الشرق الأوسط" : "Login - Middle East Platform",
    description: isArabic
      ? "سجل الدخول إلى حسابك"
      : "Sign in to your account",
  };
}

export default async function Login({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <LoginPage />;
}



import { Metadata } from "next";
import { ForgotPasswordPage } from "@/features/auth";

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
      ? "U+O3USO¦ UŸU,U.Oc OU,U.OñU^Oñ - U.U+OæOc OU,O'OñU, OU,OœU^O3Oú"
      : "Forgot Password - Middle East Platform",
    description: isArabic
      ? "OO3O¦O1OO_Oc UŸU,U.Oc OU,U.OñU^Oñ"
      : "Reset your password",
  };
}

export default async function ForgetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <ForgotPasswordPage />;
}

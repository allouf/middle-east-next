import { Metadata } from "next";
import { ResetPasswordPage } from "@/features/auth";

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
      ? "OO1OO_Oc O¦O1USUSU+ UŸU,U.Oc OU,U.OñU^Oñ - U.U+OæOc OU,O'OñU, OU,OœU^O3Oú"
      : "Reset Password - Middle East Platform",
    description: isArabic
      ? "OO1OO_Oc O¦O1USUSU+ UŸU,U.Oc OU,U.OñU^Oñ OU,OrOOæOc O\"UŸ"
      : "Reset your password",
  };
}

export default async function ResetPassword({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <ResetPasswordPage />;
}

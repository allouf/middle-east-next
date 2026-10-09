import { Metadata } from "next";
import { VerificationCodePage } from "@/features/auth";

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
      ? "OñU.Oý OU,O¦O-U,U, - U.U+OæOc OU,O'OñU, OU,OœU^O3Oú"
      : "Verification Code - Middle East Platform",
    description: isArabic
      ? "OœO_OrU, OñU.Oý OU,O¦O-U,U,"
      : "Enter verification code",
  };
}

export default async function VerificationCode({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <VerificationCodePage />;
}

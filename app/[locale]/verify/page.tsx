import { Metadata } from "next";
import { VerifyAccountPage } from "@/features/auth";

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
    title: isArabic ? "OU,O¦O-U,U, - U.U+OæOc OU,O'OñU, OU,OœU^O3Oú" : "Verify - Middle East Platform",
    description: isArabic
      ? "O¦O-U,U, U.U+ O-O3OO\"UŸ"
      : "Verify your account",
  };
}

export default async function Verify({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <VerifyAccountPage />;
}

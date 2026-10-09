import { Metadata } from "next";
import { LoginCallbackPage } from "@/features/auth";

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
      ? "O¦O3OªUSU, OU,O_OrU^U, - U.U+OæOc OU,O'OñU, OU,OœU^O3Oú"
      : "Login Success - Middle East Platform",
    description: isArabic
      ? "O¦U. O¦O3OªUSU, OU,O_OrU^U, O\"U+OªOO-"
      : "Login successful",
  };
}

export default async function LoginSuccess({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <LoginCallbackPage />;
}

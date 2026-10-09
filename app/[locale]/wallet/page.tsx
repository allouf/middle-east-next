import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/utils/auth-storage-server";
import WalletMain from "@/features/wallet/Main";

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
    title: isArabic ? "محفظتي" : "My Wallet",
    description: isArabic
      ? "إدارة رصيد المحفظة وعرض المعاملات"
      : "Manage your wallet balance and view transactions",
  };
}

export default async function WalletPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const token = await getServerToken();
  if (!token) redirect("/login");
  return <WalletMain />;
}

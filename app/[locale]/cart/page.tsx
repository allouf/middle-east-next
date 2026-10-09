import { Cart } from "@/features/cart";
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
    title: isArabic ? "السلة - منصة الشرق الأوسط" : "Cart - Middle East Platform",
    description: isArabic
      ? "عرض سلة التسوق"
      : "View shopping cart",
  };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

    const token = await getServerToken();
  
    if (!token) {
      redirect('/login');
    }
  return <Cart />;
}



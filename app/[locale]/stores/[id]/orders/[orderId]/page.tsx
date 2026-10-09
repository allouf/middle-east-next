import { Metadata } from "next";
import OrderDetailsWithLayout from "@/features/stores/components/Orders/OrderDetailsWithLayout";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string; orderId: string }>;
}): Promise<Metadata> {
  const { locale, orderId } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? `Order Details` : `Order Details - Middle East Platform`,
    description: isArabic
      ? `View full details for this order`
      : `View details for order ${orderId}`,
  };
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; orderId: string }>;
}) {
  const { id, orderId, locale } = await params;
  return <OrderDetailsWithLayout storeId={id} orderId={orderId} locale={locale} />;
}

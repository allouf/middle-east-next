import { Metadata } from "next";

import CouponsManagement from "@/features/stores/components/Coupons/CouponsManagement";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string; couponId: string }>;
}): Promise<Metadata> {
  const { locale, couponId } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? `تفاصيل الكوبون - منصة الشرق الأوسط`
      : `Coupon Details - Middle East Platform`,
    description: isArabic
      ? `عرض تفاصيل الكوبون`
      : `View coupon details`,
  };
}

export default async function CouponDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; couponId: string }>;
}) {
  const { id, couponId } = await params;
  return <CouponsManagement />;
}



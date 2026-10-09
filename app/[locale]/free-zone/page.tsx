import { Metadata } from "next";
import { Suspense } from "react";
import { DEFAULT_LOCALE, Locale, normalizeLocale } from "@/lib/i18n/locales";
import { getT } from "@/lib/i18n/server";
import { FreeZoneSearchParams } from "@/features/free-zone-market/types/type";
import FreeZoneMarket from "@/features/free-zone-market/components/FreeZoneMarket";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<FreeZoneSearchParams>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale: Locale = normalizeLocale(
    resolvedParams?.locale || DEFAULT_LOCALE
  );
  const t = await getT(locale);

  return {
    title: `${t("freeZoneMarket.market.title")} | ${t("middleEast")}`,
    description: t("freeZoneMarket.banner.description"),
  };
}

export default async function FreeZoneMarketPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFDFD]" />}>
      <FreeZoneMarket locale={locale} searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

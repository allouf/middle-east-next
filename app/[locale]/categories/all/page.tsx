import { Metadata } from "next";
import { Suspense } from "react";

import { CategorySearchParams } from "@/features/category/types/type";
import CategoriesPage from "@/features/category/components/CategoriesPage";
import CategoriesSkeleton from "@/features/category/components/CategoriesSkeleton";
import AllCategoriesPage from "@/features/category/components/AllCategoriesPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
  searchParams:Promise <CategorySearchParams>;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const { locale, id } = params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? `OU,U?OÝOc - U.U+OæOc OU,O'OñU, OU,OœU^O3Oú`
      : `Category - Middle East Platform`,
    description: isArabic
      ? `O¦OæU?O- OU,U.U+O¦OªOO¦ U?US UØOøUØ OU,U?OÝOc`
      : `Browse products in this category`,
    keywords: ["category", "products", "e-commerce", "Middle East"],
    openGraph: {
      title: isArabic
        ? `OU,U?OÝOc - U.U+OæOc OU,O'OñU, OU,OœU^O3Oú`
        : `Category - Middle East Platform`,
      description: isArabic
        ? `O¦OæU?O- OU,U.U+O¦OªOO¦ U?US UØOøUØ OU,U?OÝOc`
        : `Browse products in this category`,
      url: `/${locale}/category/${id}`,
      siteName: "Middle East Platform",
      locale: isArabic ? "ar_SA" : "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { id, locale } = await params;
  const resolvedSearchParams = await searchParams ?? {};

  // Default category to the route param when not provided in the query
  const newParams = resolvedSearchParams ;



  return (
    <AllCategoriesPage searchParams={newParams} locale={locale}/>
  );
}

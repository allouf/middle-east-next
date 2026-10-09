import CategoriesPage from "@/features/category/components/CategoriesPage";
import CategoriesSkeleton from "@/features/category/components/CategoriesSkeleton";
import { CategorySearchParams } from "@/features/category/types/type";
import Products from "@/features/product/components/Products";
import { Metadata } from "next";
import { Suspense } from "react";


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
      ? `المنتجات - منصة الشرق الأوسط`
      : `Products - Middle East Platform`,
    description: isArabic
      ? `تصفح جميع المنتجات المتاحة`
      : `Browse all available products`,
    keywords: ["products", "e-commerce", "shopping", "Middle East"],
    openGraph: {
      title: isArabic
        ? `المنتجات - منصة الشرق الأوسط`
        : `Products - Middle East Platform`,
      description: isArabic
        ? `تصفح جميع المنتجات المتاحة`
        : `Browse all available products`,
      url: `/${locale}/products`,
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

export default async function ProductsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams:Promise <CategorySearchParams>;
}) {
  const {  locale } =await params;
  const resolvedSearchParams = await searchParams ?? {};

  // Default category to the route param when not provided in the query
  const newParams = resolvedSearchParams ;


    console.log("search ",searchParams)
    // console.log("id",id)
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <CategoriesPage searchParams={newParams} locale={locale} />
    </Suspense>
  );

}



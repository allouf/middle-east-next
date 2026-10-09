import { Metadata } from "next";
import ProductDetails from "@/features/product/components/ProductDetails";
import { fetchProductDetails } from "@/features/product/api/getProductDetails";
import { ProductDetailsData } from "@/features/product/types/type";
import ProductErrorPage from "@/features/product/components/ProductErrorPage";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const localeValue = String(locale);
  const idValue = String(id);
  const isArabic = localeValue === "ar";

  return {
    title: isArabic
      ? `تفاصيل المنتج - منصة الشرق الأوسط`
      : `Product Details - Middle East Platform`,
    description: isArabic
      ? `عرض تفاصيل المنتج`
      : `View product details`,
    keywords: ["product", "details", "e-commerce", "Middle East"],
    openGraph: {
      title: isArabic
        ? `تفاصيل المنتج - منصة الشرق الأوسط`
        : `Product Details - Middle East Platform`,
      description: isArabic
        ? `عرض تفاصيل المنتج`
        : `View product details`,
      url: `/${localeValue}/products/${idValue}`,
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

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await params;
  const idValue = String(id);
  const numericId = Number(idValue);
  const localeValue = String(locale);

  if (Number.isNaN(numericId)) {
    console.error("Invalid product id", id);
    return <ProductErrorPage />;
  }

  let productRes: ProductDetailsData | null = null;
  let error: Error | null = null;

  try {
    productRes = await fetchProductDetails("", numericId, localeValue);
  } catch (err) {
    console.error("Error fetching product details:", err);
    error = err instanceof Error ? err : new Error("Failed to fetch product details");
  }

  // Handle error case
  if (error || !productRes) {
    return <ProductErrorPage />;
  }

  return <ProductDetails productId={id} resData={productRes} />;
}



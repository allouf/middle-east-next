import { fetchFreeShippingProducts } from "../api/freeShipping.api";
import FreeShippingProductsClient from "./FreeShippingProducts.client";
import { getT } from "@/lib/i18n/server";
import { TFunction } from "i18next";

 function mapFreeShippingProducts(products: any[], t: TFunction) {
  return products.map((product: any) => {
    const priceBeforeDiscount = product.price_before_discount || product.price;
    const currentPrice = product.price;
    let badge = null;

    if (priceBeforeDiscount > currentPrice && priceBeforeDiscount > 0) {
      const discountPercentage = Math.round(
        ((priceBeforeDiscount - currentPrice) / priceBeforeDiscount) * 100
      );
      if (discountPercentage > 0) badge = t("topOffers.off", { value: discountPercentage });
    }

    return {
      id: product.id,
      title: product.name,
      name: product.name,
      image: product.gallery?.[0]?.file_path ?? "/dummy/prod21.png",
      price: product.price,
      newPrice: product.price,
      oldPrice: priceBeforeDiscount,
      rating: product.avg_rating ?? 0,
      badge,
      originalProduct: product,
      is_favorited: product.is_favorited ?? false,
      category: product.category?.name ?? t("freeShipping.defaultCategory"),
      categoryId: product.category?.id ?? null,
      stock: product.total_left_in_stock ?? 0,
    };
  });
}

// Server component
export default async function FreeShippingProducts({ locale }: { locale: string }) {
  const t = await getT(locale);
  const products = await fetchFreeShippingProducts(locale);

  if (!products.length) return null;

  return <FreeShippingProductsClient products={mapFreeShippingProducts(products, t)} />;
}

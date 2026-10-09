

import { fetchDiscountedProducts } from "../api/discounted.api";
import DiscountedProductsClient from "./DiscountedProducts.client";
import { getT } from "@/lib/i18n/server";
import { TFunction } from "i18next";

const formatPrice = (value: number | string | undefined, currencySymbol: string) => {
  const numericValue =
    typeof value === "string" ? Number.parseFloat(value) : Number(value ?? 0);
  return `${currencySymbol}${Number.isFinite(numericValue) ? numericValue : 0}`;
};

const resolveCurrencySymbol = (t: TFunction) => {
  const currency = t("currency");
  return currency && currency !== "currency" ? currency : "$";
};

const mapDiscountedProducts = (products: any[], t: TFunction, currencySymbol: string) => {

  return products.map((product, index) => ({
    id: product.id || `product-${index}`,
    name: product.name || "",
    title: product.name || "",
    company: product.store?.name || t("discountedProducts.companyName"),
    category: product.category?.name || t("discountedProducts.defaultCategory"),
    price: formatPrice(product.price, currencySymbol),
    price_before_discount: product.price_before_discount
      ? formatPrice(product.price_before_discount, currencySymbol)
      : null,
    rating: product.avg_rating || 0,
    reviews: product.number_of_buys || 0,
    discount:
      product.discount_value && product.discount_value > 0
        ? product.discount_type === "percentage"
          ? t("topOffers.off", { value: product.discount_value })
          : t("bestSellers.discountAmount", { value: product.discount_value })
        : null,
    stock:
      product.total_left_in_stock > 0
        ? `${product.total_left_in_stock} ${t("discountedProducts.leftInStock")}`
        : t("discountedProducts.outOfStock"),
    image:
      product.gallery && product.gallery.length > 0
        ? product.gallery[0].file_path
        : "/dummy/prod21.png",
    deliveryTime: "6 hrs 18 mins",
    originalProduct: product,
  }));
}



export default async function DiscountedProducts({ locale }: { locale: string }) {
  const t = await getT(locale);
  const currencySymbol = resolveCurrencySymbol(t);
  const products = await fetchDiscountedProducts(locale);

  if (!products.length) return null;

  return <DiscountedProductsClient products={mapDiscountedProducts(products, t, currencySymbol)} />
};

import { fetchSuggestedProducts } from "../api/suggested.api";
import SuggestedProductsClient from "./suggestedProducts.client";
import { BaseProduct } from "../type";
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

// Transform API data for client
function mapSuggestedProducts(products: BaseProduct[], t: TFunction, currencySymbol: string) {
  return products.map((product, index) => ({
    id: String(product.id ?? `product-${index}`),
    title: String(product.name ?? ""),
    name: String(product.name ?? ""),
    company: product.store?.name ?? t("suggestedProducts.companyName"),
    category: product.category?.name ?? t("suggestedProducts.defaultCategory"),
    price: formatPrice(product.price, currencySymbol),
    price_before_discount: product.price_before_discount
      ? formatPrice(product.price_before_discount, currencySymbol)
      : null,
    rating: Number(product.avg_rating ?? 0),
    reviews: Number(product.number_of_buys ?? 0),
    discount:
      product.discount_value && product.discount_value > 0
        ? product.discount_type === "percentage"
          ? t("suggestedProducts.discountPercentage", { value: product.discount_value })
          : t("suggestedProducts.discountAmount", { value: product.discount_value })
        : null,
    stock:
      product.total_left_in_stock > 0
        ? t("suggestedProducts.inStock", { value: product.total_left_in_stock })
        : t("suggestedProducts.outOfStock"),
    image: product.gallery?.[0]?.file_path ?? "/dummy/prod21.png",
    originalProduct: product,
  }));
}

// Server component
export default async function SuggestedProducts({ locale }: { locale: string }) {
  const t = await getT(locale);
  const currencySymbol = resolveCurrencySymbol(t);
  const products = await fetchSuggestedProducts(locale);

  if (!products.length) return null;

  return <SuggestedProductsClient products={mapSuggestedProducts(products, t, currencySymbol)} />;
}

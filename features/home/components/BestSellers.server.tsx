
import BestSellersClient from "./BestSellers.client";
import { fetchBestSellers } from "../api/bestSellers.api";
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

function mapBestSellers(products: any[], t: TFunction, currencySymbol: string) {
  return products.map((product) => ({
    id: String(product.id),
    title: String(product.name ?? ""),
    company: product.store?.name ?? t("bestSellers.companyName"),
    category: product.category?.name ?? t("bestSellers.defaultCategory"),
    price: formatPrice(product.price, currencySymbol),
    price_before_discount: product.price_before_discount
      ? formatPrice(product.price_before_discount, currencySymbol)
      : null,
    rating: Number(product.avg_rating ?? 0),
    reviews: Number(product.number_of_buys ?? 0),
    discount:
      product.discount_value && product.discount_value > 0
        ? product.discount_type === "percentage"
          ? t("bestSellers.discountPercentage", {
            value: product.discount_value,
          })
          : t("bestSellers.discountAmount", {
            value: product.discount_value,
          })
        : null,
    stock:
      product.total_left_in_stock > 0
        ? t("bestSellers.inStock", { value: product.total_left_in_stock })
        : t("bestSellers.outOfStock"),
    image: product.gallery?.[0]?.file_path ?? "/dummy/prod21.png",
    originalProduct: product,
  }));
}

export default async function BestSellers({ locale }: { locale: string }) {
  const t = await getT(locale);
  const currencySymbol = resolveCurrencySymbol(t);
  const products = await fetchBestSellers(locale);

  if (!products.length) return null;

  return <BestSellersClient products={mapBestSellers(products, t, currencySymbol)} />;
}

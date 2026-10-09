import { fetchFeaturedSection } from "../api/featuredSection";
import { BaseProduct } from "../type";
import FeaturedSectionClient from "./FeaturedSection.client";
import { getT } from "@/lib/i18n/server";
import { TFunction } from "i18next";

function getDiscountBadge(priceBeforeDiscount: number, currentPrice: number, t: TFunction) {
  if (priceBeforeDiscount > currentPrice && priceBeforeDiscount > 0) {
    const discountPercentage = Math.round(
      ((priceBeforeDiscount - currentPrice) / priceBeforeDiscount) * 100
    );
    if (discountPercentage > 0) {
      return t("topOffers.off", { value: discountPercentage });
    }
  }
  return null;
}

function mapFeaturedProducts(product: BaseProduct, t: TFunction) {

  const priceBeforeDiscount = product.price_before_discount || product.price;
  const currentPrice = product.price;
  const badge = getDiscountBadge(priceBeforeDiscount, currentPrice, t);

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    priceBeforeDiscount: priceBeforeDiscount,
    image: product.gallery && product.gallery.length > 0
      ? product.gallery[0].file_path
      : "/dummy/prod21.png",
    category: product.category?.name || t("topOffers.defaultCategory"),
    badge,
    originalProduct: product,
  };
}
function mapCarouselProducts(products: BaseProduct[], t: TFunction) {
  return products.map((product: BaseProduct) => {
    const priceBeforeDiscount = product.price_before_discount || product.price;
    const currentPrice = product.price;
    const badge = getDiscountBadge(priceBeforeDiscount, currentPrice, t);

    return {
      id: product.id,
      title: product.name,
      name: product.name,
      image:
        product.gallery && product.gallery.length > 0
          ? product.gallery[0].file_path
          : "/dummy/prod21.png",
      price: product.price,
      newPrice: product.price,
      oldPrice: priceBeforeDiscount,
      rating: product.avg_rating || 0,
      badge,
      originalProduct: product,
      is_favorited: product.is_favorited || false,
      category: product.category?.name || t("topOffers.defaultCategory"),
      stock: product.total_left_in_stock || 0,
    }
  });
}

export default async function FeaturedSection({ locale }: { locale: string }) {
  const t = await getT(locale);
  const data = await fetchFeaturedSection(locale);

  if (!data || !data.featured || !data.carousel) {
    return null;
  }

  return (
    <FeaturedSectionClient
      featuredProduct={mapFeaturedProducts(data.featured, t)}
      carouselProducts={mapCarouselProducts(data.carousel ?? [], t)}
    />
  );
}


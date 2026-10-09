import { fetchTopOffers } from "../api/topOffers.api";
import { BaseProduct, MappedProdcut } from "../type";
import TopOffersClient from "./TopOffers.client";


function mapTopOffers(products: BaseProduct[]): MappedProdcut[] {
  return products.map((product) => {
    const oldPrice =
      product.price_before_discount || product.price;

    const discount =
      oldPrice > product.price
        ? Math.round(
          ((oldPrice - product.price) / oldPrice) * 100
        )
        : null;

    return {
      id: product.id,
      title: product.name,
      name: product.name,
      image: product.gallery?.[0]?.file_path ?? "/dummy/prod21.png",
      price: product.price,
      newPrice: product.price,
      oldPrice,
      price_before_discount: oldPrice,
      rating: product.avg_rating ?? 0,
      badge: discount,
      is_favorited: product.is_favorited ?? false,
      category: product.category?.name ?? "",
      stock: product.total_left_in_stock ?? 0,
      originalProduct: product,
    };
  });
}

export default async function TopOffers({
  locale,
}: {
  locale: string;
}) {
  const products = await fetchTopOffers(locale);

  if (!products.length) return null;

  return (
    <TopOffersClient products={mapTopOffers(products)} />
  );
}

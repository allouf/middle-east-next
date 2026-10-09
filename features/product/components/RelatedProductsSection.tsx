import React, { useMemo } from "react";

import { Product, ProductCardData, RelatedProduct, SuggestedProduct } from "@/features/product/types/type";
import { useTranslation } from "@/lib/i18n/useTranslation";
import ProductCard from "@/components/cards/product/ProductCard";

interface RelatedProductsSectionProps {
  products?: (RelatedProduct | SuggestedProduct)[];
  title?: string;
}

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({
  products = [],
  title,
}: RelatedProductsSectionProps) => {
  const {t} = useTranslation();
  const sectionTitle = title || t('product.relatedProducts');


  
  const transformedProducts = useMemo<Product[]>(() => {
    if (!Array.isArray(products)) return [];
  
    return products.map((product: RelatedProduct | SuggestedProduct) => {
      const priceBeforeDiscount =
        product.price_before_discount ?? product.price;
  
      const discount =
        priceBeforeDiscount > product.price
          ? Math.round(
              ((priceBeforeDiscount - product.price) / priceBeforeDiscount) * 100
            )
          : undefined;
  
      return {
        id: product.id,
        name: product.name,
        title: product.name,
  
        price: product.price,
        newPrice: product.price,
        oldPrice: priceBeforeDiscount,
        price_before_discount: priceBeforeDiscount,
  
        avg_rating: product.avg_rating ?? 0,
        rating: product.avg_rating ?? 0,
  
        number_of_buys: product.number_of_buys ?? 0,
        reviews:  product.number_of_buys ?? 0,
  
        discount,
        discount_value: product.discount_value,
        discount_type: product.discount_type ?? undefined,
  
        gallery: product.gallery,
        image: product.gallery?.[0]?.file_path ?? "/dummy/prod21.png",
  
        category: product.category
          ? {
              id: product.category.id,
              name: product.category.name,
              icon: product.category.icon ?? null,
            }
          : undefined,
  
        stock: product.total_left_in_stock ?? 0,
  
        badge: discount ? `${discount}% OFF` : undefined,
  
        originalProduct: String(product.id),
      };
    });
  }, [products]);
  
  

  if (transformedProducts.length === 0) return null;

  return (
    <div className="mb-8">
      <h2
        className="text-xl sm:text-2xl md:text-3xl text-blueSite font-bold mb-6"
     
      >
        {sectionTitle}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {transformedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selectable={false}
            showCartIcon={false}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsSection;

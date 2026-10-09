'use client';

import React, { useState, useMemo } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { motion } from "framer-motion";
import ProductCard from "../../../components/cards/product/ProductCard";
import HeaderHome from "../../../components/shared/HeaderHome";
import useGetData from "@/lib/api/useGetData";
import LoaderPage from "../../../components/shared/LoaderPage";
import { DiscountProductsResponse } from "../types/type";

interface DiscountedProductsProps {
  data:DiscountProductsResponse
}

interface SelectedProduct {
  id: any;
  value: boolean;
}

const DiscountedProducts: React.FC<DiscountedProductsProps> = ({ data }) => {
  const { t } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // const shouldFetch = enabled && Boolean(url);

  // const { data, loading, error } = useGetData({
  //   url: url || "",
  //   enabled: shouldFetch,
  // });

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const apiProducts = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    // if (Array.isArray(data.data?.products)) return data.data.products;
    return [];
  }, [data]);

  const transformedProducts = useMemo(() => {
    if (!apiProducts || !apiProducts.length) return [];
    return apiProducts
      .map((product, index) => {
        if (!product) return null;
        return {
          id: product.id || `product-${index}`,
          name: product.name || "",
          title: product.name || "",
          company: product.store?.name || t("discountedProducts.companyName"),
          category: product.category?.name || "Electronic",
          price: `$${product.price || 0}`,
          price_before_discount: product.price_before_discount
            ? `$${product.price_before_discount}`
            : null,
          rating: product.avg_rating || 0,
          reviews: product.number_of_buys || 0,
          discount:
            product.discount_value && product.discount_value > 0
              ? product.discount_type === "percentage"
                ? `${product.discount_value}% OFF`
                : `$${product.discount_value} OFF`
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
        };
      })
      .filter(Boolean);
  }, [apiProducts, t]);

  const toggleProduct = (id: number | string) => {
    setSelectedProducts((prev) =>
      prev.some((item) => item.id === id)
        ? prev.filter((item) => item.id !== id)
        : [...prev, { id, value: true }]
    );
  };

  // if (!shouldFetch) return null;

  // if (loading) {
  //   return (
  //     <section className="py-10">
  //       <div className="mx-auto">
  //         <HeaderHome text={t("discountedProducts.title")} to="#" />
  //         <div className="container mx-auto">
  //           <LoaderPage type="products" />
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  // if (error && !transformedProducts.length) return null;
  if (!transformedProducts.length) return null;

  return (
    <section className="py-10">
      <div className="mx-auto">
        <HeaderHome
          text={t("discountedProducts.title")}
          url="/products?attr=discounted"
        />

        {transformedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5 gap-4">
            {transformedProducts.map((item, index) => (
              <motion.div
                key={item?.id}
                className="relative bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <ProductCard
                  product={item}
                  toggleProduct={toggleProduct}
                  selected={selectedProducts}
                  selectable={false}
                  showCartIcon={true}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-textColor">
            {t("discountedProducts.noProducts")}
          </div>
        )}
      </div>
    </section>
  );
};

export default DiscountedProducts;

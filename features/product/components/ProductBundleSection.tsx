"use client";
// Cache busting comment to force HMR refresh
import ProductRate from "@/components/cards/product/ProductRate";
import useCartApi from "@/features/cart/hook/useCartApi";
import { ProductPackage } from "@/features/product/types/type";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useCartStore from "@/lib/store/useCartStore";
import useApp from "antd/es/app/useApp";
import Image from "next/image";
import React, { useMemo, useState } from "react";
//@ts-ignore
import "./ProductBundleSection.css";

interface ProductBundleSectionProps {
  packages?: ProductPackage[];
}

const ProductBundleSection: React.FC<ProductBundleSectionProps> = ({
  packages = [],
}) => {
  const { message } = useApp();
  const { addToCart, fetchCart } = useCartApi();
  const setCart = useCartStore((s) => s.setCart);
  const { t } = useTranslation();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [processedId, setProcessedId] = useState<number | null>(null);

  const handleAddToCart = async (pkg_id: number) => {
    setIsAddingToCart(true);
    setProcessedId(pkg_id);
    try {
      // Add package to cart
      const packageId = pkg_id;
      if (!packageId) {
        message.error(t("product:packageIdNotFound"));
        return;
      }
      await addToCart(
        {
          package_id: packageId,
          quantity: 1,
        },
        {
          showMessage: false,
          onSuccess: async () => {
            // Refresh cart after adding
            message.success(t("product:addedToCart"));
            const cartResponse = await fetchCart();
            if (cartResponse.status && cartResponse.data) {
              setCart(cartResponse.data as any);
            }
          },
        },
        true,
      );
    } catch (err) {
      console.error("Failed to add to cart:", err);
      message.error(t("product:failedToAddToCart"));
    } finally {
      setIsAddingToCart(false);
      setProcessedId(null);
    }
  };

  // Process each package to include main product and items
  const processedPackages = useMemo(() => {
    return packages.map((pkg) => {
      const mainProductItem = {
        id: `main-${pkg.product.id}`,
        package_id: pkg.id,
        product_id: pkg.product.id,
        variant_id: null,
        quantity: 1,
        product: {
          ...pkg.product,
          price: pkg.product.price || 0,
          avg_rating: pkg.product.avg_rating || 0,
          reviews: pkg.product.reviews || 0,
        },
        variant: null,
        image: pkg.product.image || "/dummy/prod21.png",
        item_total_price: pkg.product.price || 0,
        isMainProduct: true,
      };

      const allItems = [
        mainProductItem,
        ...pkg.items.map((item) => ({
          ...item,
          // Ensure product and variant are present for consistent access
          product: item.product || {},
          variant: item.variant || null,
        })),
      ];

      return {
        ...pkg,
        allItems,
      };
    });
  }, [packages]);

  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-12 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <h2 className="text-xl md:text-2xl font-bold leading-tight text-blueSite">
          {t("product.bundleOffer") ||
            "All users buy the product to take advantage of this offer :"}
        </h2>
      </div>

      {processedPackages.map((pkg) => {
        const packagePrice = pkg.total_price;

        return (
          <div key={pkg.id} className="mb-12 w-full p-2">
            <h2 className="text-xl md:text-2xl font-bold leading-tight text-blueSite mb-2 ms-5">
              {pkg.title}
            </h2>
            <div className="flex items-center justify-start gap-4 lg:gap-6 overflow-x-auto custom-scrollbar">
              <div className="flex justify-start items-center gap-4 flex-grow min-w-max">
                {pkg.allItems.map((item: any, index) => {
                  const product = item.product || {};
                  const variant = item.variant;

                  const discountPercent =
                    pkg.discount_type === "percent" && pkg.discount_percent! > 0
                      ? pkg.discount_percent
                      : null;

                  const imageUrl =
                    item?.image ||
                    variant?.image ||
                    product.image ||
                    "/dummy/prod21.png";
                  const displayPrice = variant?.price || product?.price || 0;

                  return (
                    <React.Fragment key={item.id}>
                      <div className="bundle-card-wrapper pb-6">
                        <div
                          className={`relative bg-white border rounded-lg p-5 w-full lg:w-[320px] transition-all duration-300 hover:shadow-md border-gray-200`}
                        >
                          {/* Badge */}
                          {item.isMainProduct ? (
                            <div className="absolute top-3 left-0 bg-[#D1394B] text-white px-3 py-0.5 text-[10px] font-bold uppercase rounded-r-sm z-10">
                              HOT
                            </div>
                          ) : discountPercent ? (
                            <div className="absolute top-3 left-0 bg-[#EFD33D] text-[#323232] px-3 py-0.5 text-[10px] font-bold uppercase rounded-r-sm z-10">
                              {discountPercent}% OFF
                            </div>
                          ) : null}

                          {/* Product Image */}
                          <div className="w-full h-[150px] mb-4 flex items-center justify-center relative">
                            <Image
                              src={imageUrl}
                              alt={product.name || ""}
                              fill
                              className="object-contain p-2"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/dummy/prod21.png";
                              }}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              <ProductRate
                                rating={product.avg_rating || 0}
                                size={14}
                                hideText={true}
                              />
                              <span className="text-[12px] text-[#77878F]">
                                ({product?.reviews || 0})
                              </span>
                            </div>

                            <h3 className="text-[13px] font-normal line-clamp-2 min-h-[32px] text-gray-800 leading-snug">
                              {product?.title || product.name}
                            </h3>

                            <div className="text-lg font-bold text-blueSite">
                              ${displayPrice.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Plus Sign */}
                      {index < pkg.allItems.length - 1 && (
                        <div className="flex items-center justify-center text-2xl font-medium text-blueSite">
                          +
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Equals Sign */}
              <div className="flex items-center justify-center text-2xl font-medium text-blueSite">
                =
              </div>

              {/* Summary Section */}
              <div className="flex flex-col items-start gap-4 ml-2 w-[250px] shrink-0">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Total Price :
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-blueSite">
                    ${packagePrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(pkg.id);
                  }}
                  disabled={isAddingToCart && processedId === pkg.id}
                  className="bg-blueSite text-white font-bold px-8 py-3 rounded-md hover:opacity-90 transition-opacity text-sm"
                >
                  {isAddingToCart && processedId === pkg.id
                    ? t("common.loading")
                    : t("product.addToCart")}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductBundleSection;

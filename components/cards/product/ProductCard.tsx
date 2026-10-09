'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ensureHttps, storageURL } from "@/shared/constants/data";
import ProductRate from "./ProductRate";
import { FaRegHeart, FaHeart, FaRegEye } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import useCartStore from "@/lib/store/useCartStore";
import useWishlistStore from "@/lib/store/useWishlistStore";
import useWishlistApi from "@/lib/api/useWishlistApi";
import { Product } from '@/features/product/types/type';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { message } from 'antd';
import useCartApi from '@/features/cart/hook/useCartApi';
import CartProductDetails from './CartProductDetails';
interface ProductCardProps {
  product: Product;
  toggleProduct?: (id: Product["id"]) => void;
  selected?: Array<{ id: Product["id"]; value?: boolean }>;
  selectable?: boolean;
  isDark?: boolean;
  showCartIcon?: boolean;
  isSecondary?: boolean;
  defaultBadge?: string;
}
const ProductCard = ({
  product,
  toggleProduct,
  selected = [],
  selectable = false,
  isDark = false,
  // Control visibility of the cart icon on hover (used to hide it on home page)
  showCartIcon = false,
  isSecondary = false,
  defaultBadge
}: ProductCardProps) => {
  const router = useRouter();

  // console.log("inside Card",product)
  // Destructure product attributes matching BestSellers format
  const {
    id,
    name,
    title = name,
    company = "Company name",
    category = "Electronic",
    price,
    price_before_discount,
    oldPrice,
    newPrice,
    rating = 0,
    reviews = 0,
    discount,
    discount_type,
    stock,
    image,
    badge,
    originalProduct,
  } = product || {};
  const { t } = useTranslation();

  // Helper to extract numeric value from price string (e.g., "$235.04" -> 235.04)
  const parsePrice = (priceValue) => {
    if (typeof priceValue === "number") return priceValue;
    if (typeof priceValue === "string") {
      const cleaned = priceValue.replace(/[^0-9.]/g, "");
      return parseFloat(cleaned) || 0;
    }
    return 0;
  };

  // Calculate prices - support both formats (old: oldPrice/newPrice, new: price/price_before_discount)
  const currentPrice = newPrice || parsePrice(price) || 0;
  const previousPrice = oldPrice || parsePrice(price_before_discount) || 0;
  const hasDiscount = previousPrice > 0 && previousPrice > currentPrice;

  // Use discount badge if available, otherwise use badge prop
  const displayBadge = discount || defaultBadge || badge;

  // Format display badge for percentage discounts
  const formatDisplayBadge = (badgeValue: any) => {
    if (!badgeValue) return badgeValue;

    // Check if discount_type is percentage and badge contains a number
    if (originalProduct?.discount_type === 'percentage') {
      const numValue = typeof badgeValue === 'number' ? badgeValue : parseFloat(badgeValue.toString());
      if (!isNaN(numValue)) {
        return `${numValue}%off`;
      }
    }

    return badgeValue;
  };

  const formattedBadge = formatDisplayBadge(displayBadge);


  const addItem = useCartStore((s) => s.addItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(id));
  const getWishlistItemId = useWishlistStore((s) => s.getWishlistItemId);
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);
  const updateWishlistItemId = useWishlistStore((s) => s.updateWishlistItemId);
  const { addToWishlist, removeFromWishlist } = useWishlistApi();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [optimisticWishlist, setOptimisticWishlist] = useState(isInWishlist);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [openModalCart, setOpenModalCart] = useState(false);
  const { addToCart, fetchCart } = useCartApi();
  const [messageApi, contextHolder] = message.useMessage()

  const resolveSrc = (src?: string): string => {
    if (!src) return "";

    if (src.startsWith("data:")) return src;
    if (src.startsWith("http://")) return ensureHttps(src);
    if (src.startsWith("https://")) return src;
    if (src.startsWith("/")) return src;

    // Check if the src looks like a page URL (contains common page patterns)
    if (src.includes("/ar") || src.includes("/en") || src.includes("localhost:3000")) {
      return "";
    }

    const cleaned = src.replace(/^\/+/, "");
    return `${storageURL}/${cleaned}`;
  };

  const [imgSrc, setImgSrc] = useState(() => resolveSrc(image));
  const [usedHttpFallback, setUsedHttpFallback] = useState(false);

  // Keep optimistic state in sync with store changes (e.g., bulk updates)
  useEffect(() => {
    setOptimisticWishlist(isInWishlist);
  }, [isInWishlist, id]);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    setImgSrc(resolveSrc(image));
    setUsedHttpFallback(false);
  }, [image]);

  const handleAddToCart = async () => {
    setOpenModalCart(true)
  };


  const handleToggleWishlist = async () => {
    if (isTogglingWishlist) return;
    const inWishlist = isInWishlist;
    setIsTogglingWishlist(true);
    try {
      if (inWishlist) {
        // Remove from wishlist
        const wishlistItemId = getWishlistItemId(product?.id);
        if (wishlistItemId) {
          await removeFromWishlist(wishlistItemId, {
            showMessage: false,
            onSuccess: () => {
              removeWishlistItem(product?.id);
              // toast.info(t('product:removedFromWishlist', { name: product?.name }), {
              //   autoClose: 2000,
              // });
            },
            onError: (err) => {
              const errorMessage =
                err.response?.data?.message || err.message || "Failed to add item to wishlist";
              messageApi.error(errorMessage);
            }
          });
        } else {
          // Fallback: remove from local state only
          removeWishlistItem(product?.id);
          // toast.info(t('product:removedFromWishlist', { name: product?.name }), {
          //   autoClose: 2000,
          // });
        }
      } else {
        // Add to wishlist
        await addToWishlist(
          product?.id, // Pass product_id directly (will be converted to FormData)
          {
            showMessage: false,
            onSuccess: () => {
              // Add to local state
              addWishlistItem({
                id: product?.id,
                wishlistItemId: product?.id, // Use product ID (same as product ID based on API response)
                title: product?.name,
                categoryPath: product?.category
                  ? [product.category.name]
                  : ["Electronic"],
                company: product?.store?.name || "Company name",
                verified: true,
                options: {},
                price: Number(product?.price || 0),
                newPrice: Number(product?.price || 0),
                image:
                  product?.gallery && product?.gallery.length > 0
                    ? product?.gallery[0].file_path
                    : "",
                badge:
                  product?.discount_value && product?.discount_value > 0
                    ? "SALE"
                    : undefined,
                stock: product?.status === "active" ? 12 : 0,
                rating: product?.avg_rating || 0,
              });
              // Update wishlist item ID
              updateWishlistItemId(product?.id, product?.id);
              // toast.success(t('product:addedToWishlist', { name: product?.name }), {
              //   autoClose: 2000,
              // });
            },
            onError: (err) => {
              console.log("wishList error", err)
              if (err.status === 401) {
                messageApi.error(t('messages.unauthorized'));
                // console.log("clicked")
                router.push("/login")
              } else {
                const errorMessage =
                  err.response?.data?.message || err.message || "Failed to add item to wishlist";
                messageApi.error(errorMessage);
              }

            }
          }
        );
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    } finally {
      setIsTogglingWishlist(false);
    }
  };


  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      // Navigate to product detail page - data will be fetched from API
      router.push(`/products/${id}`);
    }
  };

  const isSelected = selectable
    ? selected.find((item) => item.id === id)
    : {};

  const previousPriceClasses = `${isDark ? "text-gray-200" : "text-textColor"} line-through sm:text-[18px] text-[14px]`;
  const currentPriceClasses = `${isDark ? "text-[#e9f2ef]" : "text-blueSite"} font-semibold sm:text-[18px] text-[14px]`;

  // Determine badge color based on label
  const getLabelColor = (label?: unknown): string => {
    if (typeof label !== "string") {
      return "bg-[#EFD33D] text-[#323232]";
    }

    switch (label.toLowerCase()) {
      case "hot":
        return "bg-[#D02F44] text-[#fff]";
      case "sale":
        return "bg-[#4CAF50] text-[#fff]";
      case "offer":
        return "bg-[#EFD33D] text-[#323232]";
      case "sponsored":
        return "bg-[#D6EF3D] text-[#323232]"
      default:
        return "bg-[#EFD33D] text-[#323232]";
    }
  };

  return (
    <div
      key={id}
      className={`relative lg:min-w-[300px] sm:min-w-[200px] min-w-[150px] ${isDark ? "bg-[#FFFFFF33]/20" : "border border-gray-300"
        } rounded-[10px] sm:p-3 p-[6px] group hover:shadow-lg transition-all duration-300`}
    >
      {contextHolder}
      {/* Label Badge (HOT / SALE / OFFER / Discount) */}
      {formattedBadge && (
        <div
          className={`absolute top-2 left-2 ${getLabelColor(
            formattedBadge
          )} text-xs font-semibold px-4 py-1 rounded-sm uppercase z-10`}
        >
          {formattedBadge}
        </div>
      )}
      <CartProductDetails open={openModalCart} setOpen={setOpenModalCart} id={id} />
      {/* Checkbox */}
      {selectable && (
        <input
          type="checkbox"
          checked={isSelected?.value}
          onChange={() => toggleProduct(id)}
          className="absolute top-2 right-2 w-4 h-4 accent-blueSite z-10"
        />
      )}

      {/* Product Image */}
      <div
        className={`w-full relative ${isDark ? "bg-white rounded-[10px]" : ""}`}
      >
        {imgSrc && (
          <div className="relative w-full sm:h-[200px] h-[140px]">
            <Image
              src={imgSrc}
              alt={title}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, (max-width: 1440px) 26vw, 320px"
              className="mx-auto object-contain transition-all duration-300"
              unoptimized
              loading="eager"
              onError={() => {
                // If original was http and https failed, retry with http once
                if (image?.startsWith("http://") && !usedHttpFallback) {
                  setUsedHttpFallback(true);
                  setImgSrc(image);
                  return;
                }
                // If imgSrc is empty or invalid, hide the image
                if (!imgSrc || imgSrc.includes("localhost:3000")) {
                  setImgSrc("");
                  return;
                }
              }}
              priority={false}
            />
          </div>
        )}

        {/* Hover Icons */}
        <div className={`absolute inset-0 hidden group-hover:flex sm:flex-row flex-col bg-[#00000033] bg-opacity-20 backdrop-blur-[2px] sm:items-center items-end justify-center gap-2 rounded-[5px] transition-all duration-300 p-2 ${!imgSrc ? 'sm:h-[200px] h-[140px]' : ''}`}>
          <button
            className="sm:p-4 p-2 rounded-full bg-white cursor-pointer text-subTitleColor disabled:opacity-50"
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist || !hasHydrated}
            aria-label={isInWishlist ? t("wishlist.remove") : t("wishlist.add")}
            title={isInWishlist ? t("wishlist.remove") : t("wishlist.add")}
          >
            {
              isInWishlist ? (
                <FaHeart className="text-red-500 sm:text-[22px] text-[12px]" />
              ) : (
                <FaRegHeart className="sm:text-[22px] text-[12px]" />
              )}
          </button>
          {showCartIcon && (
            <button
              className="sm:p-4 p-2 rounded-full bg-white cursor-pointer text-subTitleColor"
              onClick={handleAddToCart}
              aria-label={t("product.addToCart")}
              title={t("product.addToCart")}
            >
              <MdOutlineShoppingCart className="sm:text-[22px] text-[12px]" />
            </button>
          )}
          <button
            className="sm:p-4 p-2 rounded-full bg-blueIcons cursor-pointer hover:bg-blueSiteHover transition"
            onClick={handleViewDetails}
            title="View Details"
            aria-label={t("product.viewDetails")}
          >
            <FaRegEye className="text-textWhiteColor sm:text-[22px] text-[12px]" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-2">
        {/* Rating */}
        {!isSecondary &&
          <>
            <div className="flex items-center justify-start text-yellow-400 mt-1">
              <ProductRate rating={rating} size={18} isDark={true} />
            </div>
            <p
              className={`
              font-sans font-normal
              text-[12px] sm:text-[16px]
              mt-2 leading-snug
              line-clamp-1
              min-h-[30px] sm:min-h-[50px]
              ${isDark ? "text-textWhiteColor" : "text-black"}
            `}
            >
              {t("category")} :{" "}
              <span
                className={`font-semibold ${isDark ? "text-textWhiteColor" : "text-subTitleColor"
                  }`}
              >
                {category?.name || category}
              </span>
            </p>
          </>}

        {/* Title (truncate + ellipsis) */}
        <p
          className={`sm:text-[16px] text-[12px] font-semibold mt-2 line-clamp-1 leading-snug sm:min-h-[50px] min-h-[30px] ${isDark ? "text-textWhiteColor" : "text-subTitleColor"
            }`}
        >
          {title || name}
        </p>

        {/* Price */}
        <div className="flex justify-start items-center gap-2 mt-2">
          {hasDiscount && previousPrice > currentPrice && (
            <span className={previousPriceClasses}>
              {typeof price_before_discount === "string"
                ? price_before_discount
                : `$${previousPrice.toLocaleString()}`}
            </span>
          )}
          <span className={currentPriceClasses}>
            {typeof price === "string" ? price : `$${currentPrice.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

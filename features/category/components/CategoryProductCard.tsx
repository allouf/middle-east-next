'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaRegEye } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import useCartStore from "@/lib/store/useCartStore";
import useWishlistStore from "@/lib/store/useWishlistStore";
import useWishlistApi from "@/lib/api/useWishlistApi";
import { useAlert } from "@/lib/context/AlertProvider";
import { Product } from '@/features/product/types/type';
import { useTranslation } from '@/lib/i18n/useTranslation';
import ProductRate from '@/components/cards/product/ProductRate';
interface ProductCardProps {
  product: Product;
  toggleProduct?: (id: Product["id"]) => void;
  selected?: Array<{ id: Product["id"]; value?: boolean }>;
  selectable?: boolean;
  isDark?: boolean;
  showCartIcon?: boolean;
}
const CategoryProductCard = ({
  product,
  toggleProduct,
  selected = [],
  selectable = false,
  isDark = false,
  // Control visibility of the cart icon on hover (used to hide it on home page)
  showCartIcon = false,
}: ProductCardProps) => {
  const router = useRouter();
  
  // console.log("inside Card",product)
  // Destructure product attributes matching new API format
  const {
    id,
    name,
    slug,
    price,
    price_before_discount,
    discount_value,
    discount_type,
    avg_rating = 0,
    number_of_buys = 0,
    total_left_in_stock,
    availability_status,
    gallery,
    is_favorited,
    favorited_at,
    category: categoryObj,
    
    // Legacy fields for backward compatibility
    title = name,
    company = "Company name",
    oldPrice,
    newPrice,
    rating = avg_rating,
    reviews = number_of_buys,
    discount = discount_value,
    stock = total_left_in_stock,
    image = gallery?.[0]?.file_path,
    badge,
    originalProduct,
  } = product || {};

  // console.log("image",image)
  
  // Extract category name for backward compatibility
  const category = categoryObj?.name || "Electronic";
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
  const displayBadge = discount > 0 ? `${discount}%` : badge;

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
  const { message } = useAlert();

  // Keep optimistic state in sync with store changes (e.g., bulk updates)
  useEffect(() => {
    setOptimisticWishlist(isInWishlist);
  }, [isInWishlist, id]);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const handleAddToCart = () => {
    // Allow adding to cart if product has originalProduct (from API)
    if (originalProduct) {
      // TODO: Implement add to cart for API products
      message.info("Add to cart functionality coming soon");
      return;
    }
    // Disable add to cart for static products (home page products)
    message.warning(
      "This product is for display only. Please browse the categories to add real products to cart."
    );
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
              message.error(errorMessage);
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
                    : "/dummy/prod21.png",
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
            onError: (err: any) => {
              console.log("wishList error", err);
              if (err.status === 401) {
                message.error(t('messages.unauthorized'));
                router.push("/login");
              } else {
                const errorMessage =
                  err.response?.data?.message || err.message || "Failed to add item to wishlist";
                message.error(errorMessage);
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
      {/* Label Badge (HOT / SALE / OFFER / Discount) */}
      {displayBadge && (
        <div
          className={`absolute top-2 left-2 ${getLabelColor(
            displayBadge
          )} text-xs font-semibold px-4 py-1 rounded-sm uppercase z-10`}
        >
          {displayBadge}
        </div>
      )}

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
        <div className="relative w-full sm:h-[200px] h-[113px]">
          <Image
            src={image || "/dummy/prod21.png"}
            alt={title}
            fill
            className="object-contain transition-all duration-300"
            onError={(e) => {
              // Fallback to dummy image on error
              (e.target as HTMLImageElement).src = "/dummy/prod21.png";
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>

        {/* Hover Icons */}
        <div className="absolute inset-0 hidden group-hover:flex sm:flex-row flex-col bg-[#00000033] bg-opacity-20 backdrop-blur-[2px] sm:items-center items-end justify-center gap-2 rounded-[5px] transition-all duration-300 p-2">
          <button
            className="sm:p-4 p-2 rounded-full bg-white cursor-pointer text-subTitleColor disabled:opacity-50"
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist || !hasHydrated}
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
            >
              <MdOutlineShoppingCart className="sm:text-[22px] text-[12px]" />
            </button>
          )}
          <button
            className="sm:p-4 p-2 rounded-full bg-blueIcons cursor-pointer hover:bg-blueSiteHover transition"
            onClick={handleViewDetails}
            title="View Details"
          >
            <FaRegEye className="text-textWhiteColor sm:text-[22px] text-[12px]" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-2">
        {/* Rating */}
        <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between text-blueSite mt-1">
          <ProductRate rating={rating} size={14} isDark={true} />

        <div className="self-end flex justify-start items-center gap-2 mt-2">
          {hasDiscount && previousPrice > currentPrice && (
            <span className="text-textColor line-through sm:text-[18px] text-[14px]">
              {typeof price_before_discount === "string"
                ? price_before_discount
                : `$${previousPrice.toLocaleString()}`}
            </span>
          )}
          <span className="text-blueSite font-semibold sm:text-[18px] text-[14px]">
            {typeof price === "string" ? price : `$${currentPrice.toLocaleString()}`}
          </span>
        </div>
        </div>

  

        {/* Title (truncate + ellipsis) */}
        <h2
          className={`sm:text-[16px] text-[12px] font-semibold mt-2 line-clamp-1 leading-snug sm:min-h-[50px] min-h-[30px] ${isDark ? "text-textWhiteColor" : "text-subTitleColor"
            }`}
        >
          {title || name}
        </h2>


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
            className={`font-semibold ${isDark ? "text-textWhiteColor" : "text-blueSite"
              }`}
          >
            {category}
          </span>
        </p>



        {/* Price */}
        
      </div>
    </div>
  );
};

export default CategoryProductCard;

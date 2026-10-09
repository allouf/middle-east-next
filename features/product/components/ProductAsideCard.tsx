'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import ProductRate from "@/components/cards/product/ProductRate";
import { FaRegHeart, FaHeart, FaRegEye } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import useCartStore from "@/lib/store/useCartStore";
import useWishlistStore from "@/lib/store/useWishlistStore";
import useWishlistApi from "@/lib/api/useWishlistApi";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Product } from '../types/type';
import useMessage from 'antd/es/message/useMessage';
import CartProductDetails from '@/components/cards/product/CartProductDetails';
interface ProductCardProps {
  product: Product;
  toggleProduct?: (id: Product["id"]) => void;
  selected?: Array<{ id: Product["id"]; value?: boolean }>;
  selectable?: boolean;
  isDark?: boolean;
  showCartIcon?: boolean;
}
const ProductAsideCard = ({
  product,
  toggleProduct,
  selected = [],
  selectable = false,
  isDark = false,
  // Control visibility of the cart icon on hover (used to hide it on home page)
  showCartIcon = false,
}:ProductCardProps) => {
  const { t } = useTranslation();
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
    stock,
    image,
    badge,
    originalProduct,
  } = product || {};



  // console.log("aside Card",product)

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
  const displayBadge = discount ? discount + "%" : badge;

  const addItem = useCartStore((s) => s.addItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(id));
  const getWishlistItemId = useWishlistStore((s) => s.getWishlistItemId);
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);
  const updateWishlistItemId = useWishlistStore((s) => s.updateWishlistItemId);
  const { addToWishlist, removeFromWishlist } = useWishlistApi();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [optimisticWishlist, setOptimisticWishlist] = useState(isInWishlist);
  const [messageApi, contextHolder] = useMessage();
  const [openModalCart, setOpenModalCart] = useState(false);

  // Keep optimistic state in sync with store changes (e.g., bulk updates)
  useEffect(() => {
    setOptimisticWishlist(isInWishlist);
  }, [isInWishlist, id]);

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
            onError: (err) => {
              console.log("wishList error",err)
              if(err.status === 401) {
                messageApi.error(t('messages.unauthorized'));
              }else{
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
      className={`relative max-w-full sm:max-w-[250px] md:max-w-[300px] 2xl:max-w-[350px] h-full ${
        isDark ? "bg-[#FFFFFF33]/20" : "border border-gray-300"
      } rounded-lg sm:p-3 p-[6px] group hover:shadow-lg transition-all duration-300 flex flex-col`}
    >
      {contextHolder}
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

       <CartProductDetails open={openModalCart} setOpen={setOpenModalCart} id={id} />

      {/* Product Image */}
      <div
        className={`flex-1 w-full relative max-h-[350px] ${isDark ? "bg-white rounded-[10px]" : ""}`}
      >
        <img
          src={image || "/dummy/prod21.png"}
          alt={title}
          className="mx-auto w-full h-full max-h-[350px] object-contain transition-all duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/dummy/prod21.png";
          }}
        />
      </div>

      {/* Product Details */}
      <div className="pt-2 flex-1 flex flex-col justify-between">
        {/* Rating */}
        <div className='flex flex-col justify-start gap-3'>
            <div className="flex items-center justify-start gap-3 mt-1">
                <ProductRate rating={rating} size={14} isDark={true} hideText={true}/>
                <span className='text-textGrayColor'>( {reviews} )</span>
            </div>

            {/* Title (truncate + ellipsis) */}
            <p
            className={`sm:text-[18px] text-[14px] font-medium  line-clamp-1 leading-snug sm:min-h-[50px] min-h-[30px] ${
                isDark ? "text-textWhiteColor" : "text-subTitleColor"
            }`}
            >
            {title || name}
            </p>

            {/* Price */}
            <div className="flex justify-start items-center gap-2 mt-2 font-bold">
            {hasDiscount && previousPrice > currentPrice && (
                <span className="text-textGrayColor  line-through sm:text-[18px] text-[14px]">
                {typeof price_before_discount === "string"
                    ? price_before_discount
                    : `$${previousPrice.toLocaleString()}`}
                </span>
            )}
            <span className="text-blueSite  sm:text-[18px] text-[14px]">
                {typeof price === "string" ? price : `$${currentPrice.toLocaleString()}`}
            </span>
            </div>

            <p
            className={`sm:text-[16px] text-[12px] font-medium sm:mt-4 mt-2 line-clamp-1 leading-snug sm:min-h-[50px] min-h-[30px] ${
                isDark ? "text-textWhiteColor" : "text-textGrayColor"
            }`}
            >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto quae asperiores, 
            </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row  items-center gap-2 mt-4">
          {/* Wishlist Button */}
          <button
            className="p-2 rounded border border-gray-300 cursor-pointer text-subTitleColor hover:bg-gray-50 transition"
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
          >
            {
             optimisticWishlist ? (
              <FaHeart className="text-red-500 text-[18px]" />
            ) : (
                <FaRegHeart className="text-[18px]" />
            )}
          </button>
          
          {/* Add to Cart Button */}
          {showCartIcon && (
            <button
              className="flex-1 bg-blueSite text-white px-4 py-2 rounded cursor-pointer hover:bg-blueSiteHover transition flex items-center justify-center gap-2 font-medium"
              onClick={handleAddToCart}
            >
              <MdOutlineShoppingCart className="text-[18px]" />
              {t("categories.addToCart")}
            </button>
          )}
          
          {/* View Details Button */}
          <button
            className="p-2 rounded border border-gray-300 cursor-pointer text-subTitleColor hover:bg-gray-50 transition"
            onClick={handleViewDetails}
            title={t("categories.viewDetails")}
          >
            <FaRegEye className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductAsideCard;

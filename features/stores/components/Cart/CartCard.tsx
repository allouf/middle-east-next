"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useHydrationSafeAnimation } from "@/lib/hooks/useHydrationSafeAnimation";
import {
  FaHeart,
  FaRegHeart,
  FaRegTrashAlt,
} from "react-icons/fa";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import ShareActions from "@/features/cart/components/ShareActions";
const CartCard = ({
  item,
  toggleSelect,
  selectedIds,
  isEditing,
  handleDelete,
  handleAddToWishlist,
  addingToWishlist,
  isInWishlist,
  formatMoney,
  updateQty,
  localQuantities,
  updatingItems,
}: {
  item: any;
  toggleSelect: (id: string) => void;
  selectedIds: string[];
  isEditing: boolean;
  handleDelete: (id: string) => void;
  handleAddToWishlist: (item: any) => void;
  addingToWishlist: Set<string>;
  isInWishlist: (id: string) => boolean;
  formatMoney: (n: number) => string;
  updateQty: (id: number, qty: number) => void;
  localQuantities: Record<string, number>;
  updatingItems: Set<number>;
}) => {
  const { t } = useTranslation();
  const { getInitial } = useHydrationSafeAnimation();
  return (
    <motion.div
      key={item?.id}
      layout
      initial={getInitial({ opacity: 0, y: 10 })}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="py-4  flex flex-row justify-between gap-4"
    >
      <div className={` md:col-span-10 flex flex-row gap-6`}>
        <div className={` relative`}>
          <div className="w-full relative md:max-w-[160px] md:max-h-[140px] 2xl:max-w-[210px] 2xl:max-h-[170px]  aspect-[236/188] bg-gray-100 rounded-lg overflow-hidden">
            <Link href={`/products/${item?.product?.id || ""}`}>
              <Image
                src={item.product?.image || "/dummy/prod21.png"}
                alt={item?.variant?.product?.name || t("cart.product")}
                fill
                className="object-cover"
              />
            </Link>
            {isEditing && (
              <div className="absolute inset-0 bg-gray-100 opacity-30 p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="w-6 h-6 bg-blueSite"
                />
              </div>
            )}
          </div>

          {item.variant?.product?.discount_value && (
            <div className="absolute top-2 left-2 bg-[#EFD33D] text-[#323232] text-xs font-semibold px-2 py-0.5 rounded">
              {item.variant.product.discount_type === "percentage"
                ? `${item.variant.product.discount_value}% OFF`
                : `$${item.variant.product.discount_value} OFF`}
            </div>
          )}
        </div>

        <div className={`space-y-2`}>
          <Link href={`/products/${item.product.id}`}>
            <div className="text-subTitleColor font-semibold leading-snug text-[20px]">
              {item.variant?.product?.name || t("cart.product")}
            </div>
          </Link>
          <div className="flex flex-row gap-2">
            <span className="text-blueSite text-[18px]">
              {t("cart.electronic")}
            </span>{" "}
            /
            <span className="text-blueSite text-[18px]">
              {t("cart.laptop")}
            </span>
          </div>
          {/* <div className="text-sm text-blueSite">SKU: {item.variant?.sku || "N/A"}</div> */}
          <div className="text-sm  flex items-center gap-2">
            <span className="text-subTitleColor text-[20px]">
              {t("cart.companyName")}
            </span>
            <span className="inline-flex items-center gap-1 text-[#0B5C8E] text-xs">
              (
              <RiVerifiedBadgeFill size={16} />
              <span className="text-[16px] text-blueSiteHover">
                {t("cart.verifiedSeller")}
              </span>
              )
            </span>
          </div>
          <div className="text-sm text-textColor flex flex-row gap-2">
            <span>
              {t("cart.color")} :{t("cart.yellow")}{" "}
            </span>{" "}
            /<span>{t("cart.size")} : M</span>
          </div>

          {!isEditing && (
            <div className="w-full flex items-center gap-4 pt-4">
              <Button
                unstyled
                scale={1.05}
                onClick={() => handleDelete(item.id)}
                className="text-[#D02F44] underline underline-offset-2 text-sm flex flex-row items-center gap-1"
              >
                <span>
                  <FaRegTrashAlt />
                </span>{" "}
                {t("buttons.delete")}
              </Button>
              <button
                onClick={() => handleAddToWishlist(item)}
                disabled={addingToWishlist.has(item.variant?.product?.id)}
                className="text-subTitleColor text-sm disabled:opacity-50 disabled:cursor-not-allowed flex flex-row items-center gap-2"
              >
                <span>
                  {isInWishlist(item.variant?.product?.id) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                </span>
                {addingToWishlist.has(item.variant?.product?.id)
                  ? t("cart.updating")
                  : isInWishlist(item.variant?.product?.id)
                    ? t("wishlist.remove")
                    : t("wishlist.add")}
              </button>
              <ShareActions
                title={t("cart.product")}
                description={t("cart.shareDescription")}
              />

            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-2 space-y-3">
        <div className="text-right">
          <div className="text-blueSiteHover text-[22px] font-bold">
            ${formatMoney(item.subtotal)}
          </div>
          <div
            className={`text-[18px] font-semibold ${(item.variant?.stock || 0) <= 5
                ? "text-[#D02F44]"
                : "text-green-600"
              }`}
          >
            {t("product.stockLeft", { count: item.variant?.stock || 0 })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 border border-blueLight rounded-md">
          <button
            onClick={() => updateQty(item.id, -1)}
            disabled={(localQuantities[String(item.id)] ?? item.quantity) <= 1}
            className="w-8 h-8  border-e border-blueLight text-subTitleColor disabled:opacity-50"
          >
            -
          </button>
          <div className="w-8 text-center text-subTitleColor flex items-center justify-center gap-1">
            {localQuantities[String(item.id)] ?? item.quantity}
            {updatingItems.has(item.id) && (
              <span className="w-3 h-3 border border-blueSite border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <button
            onClick={() => updateQty(item.id, 1)}
            disabled={
              (localQuantities[String(item.id)] ?? item.quantity) >=
              (item.variant?.stock || 0)
            }
            className="w-8 h-8  border-s border-blueLight text-subTitleColor disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartCard;

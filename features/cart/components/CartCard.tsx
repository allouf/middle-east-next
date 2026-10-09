"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaHeart, FaRegHeart, FaRegTrashAlt } from "react-icons/fa";

import Button from "@/components/ui/Button";
import ShareActions from "@/features/cart/components/ShareActions";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { CartItem, Id } from "../type";
import Image from "next/image";
import { Dropdown, MenuProps } from "antd";

type Props = {
  item: CartItem;

  toggleSelect: (id: Id) => void;
  selectedIds: Id[];
  isEditing: boolean;

  handleDelete: (id: Id) => void;

  handleAddToWishlist: (item: CartItem) => void;
  addingToWishlist: Set<Id>;
  isInWishlist: (productId: Id) => boolean;

  formatMoney: (n: number | null | undefined) => string;

  updateQty: (id: Id, delta: number) => void;
  localQuantities: Record<string, number>;
  updatingItems: Set<Id>;
};

const CartCard: React.FC<Props> = ({
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
}) => {
  const { t } = useTranslation();

  const pkg = item.package;
  const packageId = item.package_id;

  const product = item.variant?.product ?? item.product;
  const productId = product?.id;

  const productHref = productId ? `/products/${productId}` : "/products";
  const imageSrc = product?.image;
  const title = pkg?.title || product?.name || t("cart.product");
  const packageTotalItems = useMemo(() => {
    if (!pkg?.items) return 0;
    return pkg.items.reduce((sum, it: any) => sum + (it.quantity ?? 1), 0);
  }, [pkg]);
  const packageDisplayedCount = packageTotalItems > 0 ? (packageTotalItems * (item.quantity ?? 1)) - 1 : 0;

  const stock = pkg?.stock ?? item.variant?.stock ?? 0;

  const quantity = useMemo(() => {
    const key = String(item.id);
    return localQuantities[key] ?? item.quantity ?? 1;
  }, [item.id, item.quantity, localQuantities]);

  const isSelected = selectedIds.includes(item.id);
  const isWishlistBusy = productId != null && addingToWishlist.has(productId);
  const inWishlist = productId != null ? isInWishlist(productId) : false;
  const companyName =
    pkg?.store?.name ??
    product?.store?.name ??
    (pkg?.items?.[0] as any)?.product?.store?.name ??
    t("common.unknownCompany");
  const catName = product?.category?.name ?? (pkg?.items?.[0] as any)?.product?.category?.name ?? "";
  const discountValue = product?.discount_value ?? pkg?.discount_percent ?? pkg?.fixed_discount ?? 0;
  const discountType = pkg?.discount_percent ? "percentage" : product?.discount_type;

  const disableMinus = quantity <= 1;
  const disablePlus = stock >= 0 ? quantity >= stock : false;

  const packageMenuItems: MenuProps["items"] = useMemo(() => {
    if (!pkg?.items) return [];
    return pkg.items.map((pkgItem: any) => ({
      key: pkgItem.id,
      label: (
        <Link href={`/products/${pkgItem.product?.id}`} className="block group/item">
          <div className="flex items-center gap-3 py-2 px-1 min-w-[250px]">
            <div className="relative size-12 shrink-0 bg-gray-50 rounded border border-gray-100 overflow-hidden">
              {pkgItem.product?.image ? (
                <Image
                  src={pkgItem.product.image}
                  alt={pkgItem.product.name}
                  fill
                  className="object-contain transition-transform group-hover/item:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                  No Img
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-subTitleColor truncate group-hover/item:text-blueSite transition-colors">
                {pkgItem.product?.name}
              </div>
              <div className="text-xs text-textColor flex items-center justify-between mt-1">
                <span>{t("cart.qty")}: {pkgItem.quantity}</span>
                <span className="font-bold text-blueSite">
                  ${formatMoney(pkgItem.product?.price)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ),
    }));
  }, [pkg, t, formatMoney]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="
        py-4 md:py-3 
        flex flex-col gap-4
        md:flex-row md:items-start md:justify-between
      "
    >
      {/* LEFT SIDE (image + info) */}
      <div className="flex flex-col sm:flex-row gap-6 flex-1 min-w-0">
        {/* Image */}
        <div className="relative shrink-0">
          <div
            className="
              relative
              w-full
              max-w-[220px]
              sm:max-w-[160px]
              md:max-w-[160px]
              2xl:max-w-[210px]
              aspect-[236/188]
              rounded-lg
            "
          >
            {pkg ? (
              <div className="relative w-full h-full">
                {/* Stacked background images */}
                {pkg.items?.slice(1, 4).map((item, index) => (
                  <div
                    key={`stack-${index}`}
                    className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden border border-white/40 shadow-sm transition-transform duration-300"
                    style={{
                      transform: `rotate(${index % 2 === 0 ? (index + 1) * 7 : (index + 1) * -7}deg) translate(${index + 4}px, -${index + 4}px)`,
                      zIndex: 3 - index,
                      opacity: 0.8 - index * 0.2,
                    }}
                  >
                    <Image
                      src={(item as any).product?.image}
                      alt=""
                      fill
                      className="w-full h-full object-contain blur-[1px]"
                    />
                  </div>
                ))}

                {/* Main front image */}
                <Link
                  href={productHref}
                  className="relative z-10 block w-full h-full"
                >
                  <div className="w-full md:w-40 p-1 h-full bg-gray-100 rounded-lg overflow-hidden border border-white/60 shadow-md transition-transform hover:scale-[1.02]">
                    <Image
                      src={(pkg.items?.[0] as any)?.product?.image || (item as any).product?.image}
                      alt={typeof title === "string" ? title : t("cart.product")}
                      className="w-full h-full object-contain"
                      fill
                    />
                  </div>
                </Link>
              </div>
            ) : (
              <div className="w-full md:w-40 h-full bg-gray-100 rounded-lg overflow-hidden">
                <Link href={productHref}>
                  <Image
                    src={(item as any).product?.image}
                    alt={typeof title === "string" ? title : t("cart.product")}
                    className="w-full h-full object-contain transition-transform hover:scale-[1.05]"
                    fill
                  />
                </Link>
              </div>
            )}

            {/* Selection overlay (editing) */}
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 p-3 flex items-start justify-start z-30 rounded-lg">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(item.id)}
                  className="size-5 accent-blueSite"
                  aria-label="Select item"
                />
              </div>
            )}
          </div>

          {/* Discount badge */}
          {discountValue > 0 && (
            <div className="absolute top-2 left-2 bg-[#EFD33D] text-[#323232] text-xs font-semibold px-2 py-0.5 rounded z-20">
              {discountType === "percentage"
                ? `${discountValue}% OFF`
                : `$${discountValue} OFF`}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2 min-w-0">
          {pkg ? (
            <Dropdown
              menu={{ items: packageMenuItems }}
              trigger={["hover", "click"]}
              placement="bottomLeft"
              overlayClassName="package-dropdown-overlay"
            >
              <div className="flex flex-col gap-1 cursor-pointer group">
                <div className="text-subTitleColor font-bold leading-snug text-[18px] md:text-[20px] line-clamp-2 group-hover:text-blueSite transition-colors">
                  {title}
                  <div className="inline-flex flex-wrap items-center ms-1 gap-2 mb-1">
                    <span className="bg-blueSite/10 text-blueSite text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border border-blueSite/60">
                      {t("cart.package")}
                    </span>
                    {packageDisplayedCount > 0 && (
                      <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        +{packageDisplayedCount} {t("cart.more_items")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Dropdown>
          ) : (
            <Link href={productHref}>
              <div className="flex flex-col gap-1">
                <div className="text-subTitleColor font-bold leading-snug text-[18px] md:text-[20px] line-clamp-2 hover:text-blueSite transition-colors">
                  {title}
                </div>
              </div>
            </Link>
          )}

          {/* Category */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px]">
            <span className="text-blueSite font-medium truncate">
              {catName}
            </span>
          </div>

          {/* Company + Verified */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className="
      text-subTitleColor
      font-semibold
      text-[15px]
      sm:text-[16px]
      md:text-[18px]
      lg:text-[20px]
      leading-tight
      truncate
    "
            >
              {companyName}
            </span>

            <span className="inline-flex items-center gap-1 text-blueSite shrink-0">
              <span className="text-[12px] sm:text-[13px] md:text-[14px]">(</span>

              <RiVerifiedBadgeFill
                className="text-blueSite"
                size={14}
              />

              <span className="text-[12px] sm:text-[13px] md:text-[14px] text-blueSiteHover font-medium">
                {t("cart.verifiedSeller")}
              </span>

              <span className="text-[12px] sm:text-[13px] md:text-[14px]">)</span>
            </span>
          </div>


          {item.variant?.option_values && item.variant.option_values.length > 0 && (
            <div className="
                  text-textColor
                  flex
                  flex-wrap
                  items-center
                  gap-1.5
                  sm:gap-2
                  text-[12px]
                  sm:text-[13px]
                  md:text-[14px]
                  lg:text-[16px]
                ">
              {item.variant.option_values.map((ov: any, idx) => (
                <React.Fragment key={ov.id}>
                  <span className="whitespace-nowrap">
                    {ov.option?.name} : {ov.value}
                  </span>
                  {idx < (item.variant?.option_values?.length ?? 0) - 1 && (
                    <span className="text-gray-300 hidden sm:inline">/</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}


          {/* Actions (hide in edit) */}
          {!isEditing && (
            <div className="w-full flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 pt-3">
              <Button
                unstyled
                scale={1.05}
                onClick={() => handleDelete(item.id)}
                className="text-[#D02F44]  underline-offset-2 text-xs md:text-sm flex flex-row items-center gap-1 w-fit"
              >
                <span>
                  <FaRegTrashAlt />
                </span>
                {t("buttons.delete")}
              </Button>

              <button
                type="button"
                onClick={() => handleAddToWishlist(item)}
                disabled={productId == null || isWishlistBusy}
                className={`text-xs md:text-sm disabled:opacity-50  disabled:cursor-not-allowed flex flex-row items-center gap-2 w-fit ${inWishlist ? "text-lightGreen font-somar-bold" : "text-subTitleColor"}`}
              >
                <span>{inWishlist ? <FaHeart /> : <FaRegHeart />}</span>
                {isWishlistBusy
                  ? t("cart.updating")
                  : inWishlist
                    ? t("wishlist.remove")
                    : t("wishlist.add")}
              </button>
              {item?.product && <div className="lg:ml-auto">
                <ShareActions
                  title={title}
                  description={t("cart.shareDescription")}
                  productId={item.product.id}
                />
              </div>}

            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE (price + qty) */}
      <div
        className="
          w-full
          md:w-[220px]
          flex
          md:flex-col
          items-center
          md:items-end
          justify-between
          gap-3
        "
      >
        {/* Price + stock */}
        <div className="text-left md:text-right">
          <div className="text-blueSiteHover text-[20px] md:text-[22px] font-bold">
            ${formatMoney(item.subtotal ?? 0)}
          </div>

          <div
            className={[
              "text-[16px] md:text-[18px] font-semibold",
              stock <= 5 ? "text-[#D02F44]" : "text-green-600",
            ].join(" ")}
          >
            {t("product.stockLeft", { count: stock })}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-center gap-2 border border-blueLight rounded-md">
          <button
            type="button"
            onClick={() => updateQty(item.id, -1)}
            disabled={disableMinus}
            className="w-8 h-8 border-e border-blueLight text-subTitleColor disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            -
          </button>

          <div className="w-10 text-center text-subTitleColor flex items-center justify-center gap-1">
            {quantity}
            {updatingItems.has(item.id) && (
              <span className="w-3 h-3 border border-blueSite border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          <button
            type="button"
            onClick={() => updateQty(item.id, 1)}
            disabled={disablePlus}
            className="w-8 h-8 border-s border-blueLight text-subTitleColor disabled:opacity-50"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartCard;

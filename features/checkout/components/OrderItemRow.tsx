"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatMoney } from "@/lib/utils/format";
import Image from "next/image";
import React from "react";

type Props = {
  item: any;
  qty: number;
  isUpdating: boolean;
  onMinus: () => void;
  onPlus: () => void;
};

export const OrderItemRow: React.FC<Props> = ({
  item,
  qty,
  isUpdating,
  onMinus,
  onPlus,
}) => {
  const { t } = useTranslation();

  const pkg = item.package;
  const packageCount = pkg?.items?.length ? pkg.items.length - 1 : 0;

  const itemPrice = item.price || item.variant?.price || 0;
  const itemImage = item.image || item.product?.image || "";
  const itemName = pkg ? pkg.items?.[0].product?.name : (item.product.name || item.variant?.product?.name || t("cart.product"));
  const firstLetter = itemName?.charAt(0)?.toUpperCase() || "?";

  // ✅ stock from variant (fallback to Infinity if not provided)
  const stock = Number(item?.variant?.stock ?? item?.stock ?? Infinity);
  const maxQty = Number.isFinite(stock) && stock > 0 ? stock : 99;

  const disablePlus = isUpdating || qty >= maxQty;
  const disableMinus = isUpdating || qty <= 1;

  return (
    <div className="flex items-start gap-3">
      <div className="w-[114px] h-[107px] rounded bg-gray-100 flex-shrink-0 relative">
        {pkg ? (
          <div className="relative w-full h-full">
            {/* Stacked background images */}
            {pkg.items?.slice(1, 4).map((subItem: any, index: number) => (
              <div
                key={`stack-${index}`}
                className="absolute inset-0 bg-gray-100 rounded overflow-hidden border border-white/20 shadow-sm transition-transform duration-300"
                style={{
                  transform: `rotate(${index % 2 === 0 ? (index + 1) * 7 : (index + 1) * -7}deg) translate(${index + 4}px, -${index + 4}px)`,
                  zIndex: 3 - index,
                  opacity: 0.8 - index * 0.2,
                }}
              >
                <Image
                  src={subItem.product?.image || "/dummy/prod21.png"}
                  alt=""
                  fill
                  sizes="114px"
                  className="w-full h-full object-contain blur-[1px]"
                />
              </div>
            ))}

            {/* Main front image */}
            <div className="relative z-10 w-full h-full bg-gray-100 rounded overflow-hidden border border-white/40 shadow-md">
              <Image
                src={itemImage || "/dummy/prod21.png"}
                alt={itemName}
                fill
                sizes="114px"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ) : itemImage ? (
          <div className="w-full h-full rounded overflow-hidden relative">
            <Image
              src={itemImage}
              alt={itemName}
              sizes="114px"
              fill
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blueSiteHover text-3xl font-bold rounded">
            {firstLetter}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[#323232] text-sm font-semibold leading-snug">
          {itemName}
          {pkg && (
            <div className="inline-flex flex-wrap items-center ms-1 gap-1">
              <span className="bg-blueSite/10 text-blueSite text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full border border-blueSite/20">
                {t("cart.package")}
              </span>
              {packageCount > 0 && (
                <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  +{packageCount} {t("cart.more_items")}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#807D7E] mt-1">
          <span>
            {t("checkout.sku")}: {item.variant?.sku || "-"}
          </span>
        </div>

        <div className="text-blueSiteHover font-semibold mt-1">
          ${formatMoney(itemPrice)}
        </div>

        <div className="inline-flex items-center gap-3 border border-blue-100 rounded-md px-3 py-1 text-[#323232] text-sm mt-2">
          <button
            onClick={onMinus}
            className="text-lg font-bold hover:text-blueSiteHover transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disableMinus}
          >
            -
          </button>

          <span className="min-w-[20px] text-center font-medium flex items-center justify-center gap-1">
            {qty}
            {isUpdating && (
              <span className="w-3 h-3 border border-blueSite border-t-transparent rounded-full animate-spin" />
            )}
          </span>

          <button
            onClick={onPlus}
            className="text-lg font-bold hover:text-blueSiteHover transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disablePlus}
            title={qty >= maxQty ? t("checkout.outOfStock") : undefined}
          >
            +
          </button>
        </div>

        {/* ✅ optional message when reaching stock */}
        {Number.isFinite(stock) && stock >= 0 && qty >= maxQty && (
          <div className="mt-1 text-xs text-[#807D7E]">
            {t("checkout.maxAvailable")}: {maxQty}
          </div>
        )}
      </div>
    </div>
  );
};

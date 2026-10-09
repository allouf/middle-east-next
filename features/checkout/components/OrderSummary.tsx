"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { OrderItemRow } from "./OrderItemRow";
import { formatMoney } from "@/lib/utils/format";
import { useTranslation } from "@/lib/i18n/useTranslation";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { ORDERS_ENDPOINT } from "@/shared/constants/urls";
import { App } from "antd";

type Props = {
  items: any[];
  localQuantities: Record<string, number>;
  updatingItems: Set<number>;
  onChangeQty: (item: any, delta: number) => void;

  subtotal: number;
  shippingCost: number;

  /** current discount/total from parent */
  discount: number;
  total: number;

  orderLoading: boolean;
  canPlaceOrder: boolean;
  onPlaceOrder: () => void;

  /** parent callbacks */
  onCouponApplied?: (payload: {
    coupon_code: string;
    discount?: number;
    total?: number;
    raw?: any;
  }) => void;

  onCouponCleared?: () => void;
};

export const OrderSummary: React.FC<Props> = ({
  items,
  localQuantities,
  updatingItems,
  onChangeQty,
  subtotal,
  shippingCost,
  discount,
  total,
  orderLoading,
  canPlaceOrder,
  onPlaceOrder,
  onCouponApplied,
  onCouponCleared,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [discountValue, setDiscountValue] = useState<number | null>(null);

  const { formData, handleChange, handleAddError, errors } = useFormData({
    coupon_code: "",
  });

  const { postData, loading: checking } = usePostData<any>(
    ORDERS_ENDPOINT.checkCoupon
  );

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // ✅ base total before coupon (includes shipping)
  const baseTotal = useMemo(() => {
    return Math.max(0, Number(subtotal || 0) + Number(shippingCost || 0));
  }, [subtotal, shippingCost]);

  // ✅ total after coupon but WITHOUT shipping
  const totalAfterCouponWithoutShipping = useMemo(() => {
    return Math.max(0, Number(subtotal || 0) - Number(discount || 0));
  }, [subtotal, discount]);

  const hasCouponEffect = useMemo(() => Number(discount || 0) > 0, [discount]);

  // ✅ build items payload (for coupon check)
  const couponItems = useMemo(() => {
    return (items || []).map((it) => {
      const qty = localQuantities[String(it.id)] ?? it.quantity ?? it.qty ?? 1;
      return {
        id: it?.id,
        product_variant_id:
          it?.product_variant_id ?? it?.variant_id ?? it?.variant?.id,
        quantity: qty,
      };
    });
  }, [items, localQuantities]);

  // ✅ clear applied coupon if user clears input
  useEffect(() => {
    const code = String(formData?.coupon_code ?? "").trim();
    if (!code && appliedCoupon) {
      setAppliedCoupon(null);
      onCouponCleared?.();
    }
  }, [formData?.coupon_code, appliedCoupon, onCouponCleared]);

  const canApply = useMemo(() => {
    const code = String(formData?.coupon_code ?? "").trim();
    return code.length > 0 && !checking;
  }, [formData?.coupon_code, checking]);

  const handleApplyCoupon = useCallback(async () => {
    const code = String(formData?.coupon_code ?? "").trim();

    if (!code) {
      handleAddError?.(
        "coupon_code",
        t("checkout.coupon_required") || "Coupon is required"
      );
      messageApi.warning(t("checkout.coupon_required") || "Coupon is required");
      return;
    }

    const payload = {
      coupon_code: code,
      items: couponItems,
      subtotal,
      shipping_cost: shippingCost,
    };

    await postData(payload, {
      showMessage: false,
      onSuccess: (res: any) => {
        const ok = Boolean(res?.status) && Boolean(res?.data?.valid);

        if (!ok) {
          messageApi.error(
            res?.message ||
            t("checkout.invalid_coupon") ||
            "Invalid coupon"
          );
          return;
        }

        // ✅ your API: data.total_discount
        const totalDiscount = Number(res?.data?.total_discount ?? 0) || 0;
        setDiscountValue(Number(res?.data?.coupon.discount_value ?? 0) || 0);

        // ✅ total includes shipping
        const nextTotal = Math.max(0, baseTotal - totalDiscount);

        setAppliedCoupon(code);

        onCouponApplied?.({
          coupon_code: code,
          discount: totalDiscount,
          total: nextTotal,
          raw: res,
        });

        messageApi.success(
          res?.message || t("checkout.coupon_applied") || "Coupon applied"
        );
      },
      onError: (err: any) => {
        messageApi.error(
          err?.response?.data?.message ||
          err?.message ||
          t("checkout.coupon_check_failed") ||
          "Failed to check coupon"
        );
      },
    });
  }, [
    formData?.coupon_code,
    couponItems,
    subtotal,
    shippingCost,
    postData,
    onCouponApplied,
    t,
    handleAddError,
    messageApi,
    baseTotal,
  ]);

  return (
    <section className="bg-white rounded-lg p-5 shadow-sm">

      <div className="text-blueSite text-lg font-semibold mb-4">
        {t("checkout.orderSummaryTitle")}
      </div>

      <div className="space-y-4">
        {items.map((it) => {
          const qty = localQuantities[String(it.id)] ?? it.quantity ?? it.qty ?? 1;
          const isUpdating = updatingItems.has(it.id);

          return (
            <OrderItemRow
              key={it.id}
              item={it}
              qty={qty}
              isUpdating={isUpdating}
              onMinus={() => onChangeQty(it, -1)}
              onPlus={() => onChangeQty(it, 1)}
            />
          );
        })}
      </div>

      <div className="mt-6 border-t pt-4 space-y-3 text-sm">

        {!hasCouponEffect && (
          <>
            {/* Subtotal */}
            <div className="flex items-center justify-between text-[#A1A1A1]">
              <span>{t("checkout.subtotal")}</span>
              <span className="text-[#020F18] font-medium">
                ${formatMoney(subtotal)} USD
              </span>
            </div>
          </>
        )}
        {/* ✅ Before coupon → after coupon (WITHOUT shipping) */}
        {hasCouponEffect && (
          <>
            {/* Discount */}
            <div className="flex items-center justify-between text-[#A1A1A1]">
              <span>{t("checkout.discount")}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#020F18] font-medium">
                  ${formatMoney(discount)} USD
                </span>
                <span className="text-blueSiteHover font-medium">({discountValue} %)</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A1A1A1]">
                {t("checkout.total", { defaultValue: "Total" })}
              </span>

              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-semibold line-through">
                  ${formatMoney(subtotal)} USD
                </span>
                <span className="text-gray-500 font-semibold">→</span>
                <span className="text-blueSite font-semibold">
                  ${formatMoney(totalAfterCouponWithoutShipping)} USD
                </span>
              </div>
            </div>
          </>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between text-[#A1A1A1]">
          <span>{t("checkout.shipping")}</span>
          <span className="text-[#020F18] font-medium">
            ${formatMoney(shippingCost)} USD
          </span>
        </div>

        {/* ✅ Final total (after coupon + shipping) */}
        <div className="flex items-center justify-between">
          <span className="text-[#323232] font-medium">
            {t("checkout.totalAfterCoupon", { defaultValue: "Total after coupon" })}
          </span>
          <span className="text-blueSite font-semibold">
            ${formatMoney(total)} USD
          </span>
        </div>

        {/* ✅ Coupon input */}
        <div className="flex flex-col items-start w-full gap-2 pt-2">
          <div className="flex items-center w-full gap-2 pt-2">
            <div className="flex w-full">
              <InputField
                id="coupon_code"
                type="text"
                placeholder={t("checkout.couponCodePlaceholder")}
                value={formData.coupon_code}
                onChange={handleChange("coupon_code")}
                unstyled
                className="h-11 rounded-md border border-gray-200 px-3 text-[#323232] placeholder-gray-400 focus:outline-none w-full"
              />



            </div>
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={!canApply}
              className="h-11 px-4 rounded-md bg-blueSiteHover text-white font-medium whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checking ? t("checkout.checkingCoupon") : t("checkout.applyCoupon")}
            </button>
          </div>
          {!!errors?.coupon_code && (
            <p className="mt-1 text-[12px] text-red-500">
              {String(errors.coupon_code)}
            </p>
          )}
          {!!appliedCoupon && (
            <p className="mt-1 text-[12px] text-green-600">
              {t("checkout.couponApplied", { defaultValue: "Applied" })}:{" "}
              {appliedCoupon}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Button
          unstyled
          onClick={onPlaceOrder}
          // disabled={orderLoading || !canPlaceOrder}
          className="w-full bg-blueBtn text-textWhiteColor py-3 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {orderLoading ? t("checkout.processing") : t("checkout.placeOrder")}
        </Button>
      </div>
    </section >
  );
};

"use client";

import React, { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";

import Button from "@/components/ui/Button";
import useCartStore from "@/lib/store/useCartStore";
import useAddressApi from "@/lib/api/useAddressApi";
import useOrderApi from "@/lib/api/useOrderApi";
import useCartApi from "@/features/cart/hook/useCartApi";
import useFormData from "@/lib/Hooks/useFormData";
import { useOptimisticCartQuantities } from "../hooks/useOptimisticCartQuantities";
import { useAddresses } from "../hooks/useAddresses";
import { CheckoutBreadcrumb } from "./CheckoutBreadcrumb";
import { ShippingAddressSection } from "./ShippingAddressSection";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ShippingMethodsSection } from "./ShippingMethodsSection";
import { OrderSummary } from "./OrderSummary";
import { useTranslation } from "@/lib/i18n/useTranslation";
import AddAddressModal from "./AddAddressModal";
import { useCartPage } from "@/features/cart/hook/useCartPage";
import checkCircle from "@/assets/icons/CheckCircle.svg";
import { SiEbox } from "react-icons/si";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import { message } from "antd";
import { scrollToTop } from "@/lib/utils/helper";

export default function Checkout() {
  const { t } = useTranslation();

  const { loading } = useCartPage();
  const items = useCartStore((s) => s.items);
  const setCart = useCartStore((s) => s.setCart);

  const [isSubmited, setIsSubmited] = useState(false);
  const { updateCartItem, fetchCart, clearCart } = useCartApi();
  const { fetchAddresses } = useAddressApi();
  const { createOrder, loading: orderLoading, contextHolder: contextHolderOrder } = useOrderApi();

  const [messageApi, contextHolder] = message.useMessage();

  const [shippingMethod, setShippingMethod] = useState<"express" | "standard">("express");

  // ✅ coupon state
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [totalOverride, setTotalOverride] = useState<number | null>(null); // optional from backend


  const {
    formData: personalInfo,
    handleChange,
    errors: formErrors,
    handleAddError,
    isValid,
  } = useFormData({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const addressesState = useAddresses(fetchAddresses);

  const { localQuantities, updatingItems, changeQuantity, subtotal } = useOptimisticCartQuantities({
    items,
    updateCartItem,
    fetchCart,
    setCart,
    debounceMs: 500,
  });

  const shippingCost = shippingMethod === "standard" ? 0 : 50;

  // ✅ totals
  const computedTotal = useMemo(() => {
    const base = Number(subtotal || 0) + Number(shippingCost || 0);
    return Math.max(0, base - Number(couponDiscount || 0));
  }, [subtotal, shippingCost, couponDiscount]);

  const discount = couponDiscount;
  const total = totalOverride ?? computedTotal;

  const canPlaceOrder = useMemo(() => {
    if (orderLoading) return false;
    if (!addressesState.selectedAddressId) return false;
    if (!items?.length) return false;

    const p = personalInfo;
    if (!p.first_name || !p.last_name || !p.phone || !p.email) return false;

    return true;
  }, [addressesState.selectedAddressId, items?.length, orderLoading, personalInfo]);

  const handleCouponApplied = useCallback(
    (payload: { coupon_code: string; discount?: number; total?: number; raw?: any }) => {
      setCouponCode(payload.coupon_code || null);

      const d = Number(payload.discount ?? 0) || 0;
      setCouponDiscount(d);

      // لو backend رجّع total (اختياري)
      if (typeof payload.total === "number" && !Number.isNaN(payload.total)) {
        setTotalOverride(payload.total);
      } else {
        setTotalOverride(null);
      }
    },
    []
  );

  const handleCouponCleared = useCallback(() => {
    setCouponCode(null);
    setCouponDiscount(0);
    setTotalOverride(null);
  }, []);

  const handlePlaceOrder = async () => {
    const p = personalInfo; // ✅ كان ناقص عندك

    if (!isValid || !addressesState.selectedAddressId) {
      setIsSubmited(true);
      scrollToTop();

      if (!addressesState.selectedAddressId) {
        return messageApi.error(t("checkout.please_select_delivery_address"));
      }
      if (!items?.length) {
        return messageApi.error(t("checkout.cart_empty"));
      }
      return messageApi.error(
        t("checkout.fix_form_errors", {
          defaultValue: "Please fix the form errors",
        }),
      );
    }

    const orderData: any = {
      user_address_id: addressesState.selectedAddressId,
      first_name: p.first_name,
      last_name: p.last_name,
      phone: p.phone,
      email: p.email,
      items: items
        .filter((it) => it.product_variant_id || it.variant?.id)
        .map((it) => ({
          product_variant_id: it.product_variant_id || it.variant?.id,
          quantity:
            localQuantities[String(it.id)] ?? it.quantity ?? it.qty ?? 1,
        })),
      packages: items
        .filter((pkg) => pkg.package_id || pkg.package?.id)
        .map((pkg) => ({
          package_id: pkg.package_id || pkg.package?.id,
          quantity:
            localQuantities[String(pkg.id)] ?? pkg.quantity ?? pkg.qty ?? 1,
        })),
      payment_method: "cod",
      shipping_method: shippingMethod,

      // ✅ send coupon (لو API يدعمه)
      coupon_code: couponCode || undefined,
    };

    try {
      await createOrder(orderData, {
        onSuccess: () => {
          useCartStore.getState().clear();
          clearCart();
          handleCouponCleared(); // ✅ reset coupon after success
          // router.push("/");
        },
      });
    } catch (e) {
      console.error("Failed to create order:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="size-14 border-4 border-[#005D48]/20 border-t-[#005D48] rounded-full animate-spin" />
      </div>
    );
  }

  // Empty cart UI
  if (!items || items.length === 0) {
    return (
      <motion.div
        className="p-4 sm:p-6 lg:p-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {contextHolder}
        {contextHolderOrder}
        <CheckoutBreadcrumb />

        <div className="flex flex-col items-center py-8 sm:py-12 lg:py-16 space-y-4 sm:space-y-6 max-w-[500px] sm:max-w-[600px] mx-auto text-center">
          <div className="relative">
            <Image 
              src={checkCircle} 
              width={100} 
              height={100}
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
              alt="checkout placed" 
            />
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-subTitleColor">
              {t("checkout.order_successful")}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-textGrayColor leading-relaxed px-4">
              {t("checkout.order_success_description")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md">
            <Button
              to="/"
              scale={1.03}
              unstyled
              className="w-full sm:w-auto bg-transparent text-base sm:text-lg lg:text-xl font-bold text-blueSite px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 border border-blueSite rounded-md hover:opacity-90 flex items-center justify-center gap-2 sm:gap-3 transition-all hover:bg-blueSite/5"
            >
              <SiEbox className="text-blueSite w-4 h-4 sm:w-5 sm:h-5" /> 
              <span>{t("checkout.go_to_home")}</span>
            </Button>

            <Button
              to="/profile?tab=orders"
              scale={1.03}
              unstyled
              className="w-full sm:w-auto bg-blueBtn text-base sm:text-lg lg:text-xl font-bold text-textWhiteColor px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-md hover:opacity-90 flex items-center justify-center gap-2 sm:gap-3 transition-all hover:bg-blueBtn/90"
            >
              <span>{t("checkout.view_order")}</span>
              <FaArrowRightLong className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-4 md:p-10"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <CheckoutBreadcrumb />
      {contextHolder}
      {contextHolderOrder}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ShippingAddressSection
            addressQuery={addressesState.addressQuery}
            setAddressQuery={addressesState.setAddressQuery}
            showSuggestions={addressesState.showSuggestions}
            setShowSuggestions={addressesState.setShowSuggestions}
            shouldShowList={addressesState.shouldShowList}
            addressMatches={addressesState.addressMatches}
            selectedAddressId={addressesState.selectedAddressId}
            selectedAddress={addressesState.selectedAddress}
            onSelectAddress={addressesState.selectAddress}
            isSubmited={isSubmited}
            onOpenAddModal={() => {
              addressesState.setShowSuggestions(false);
              addressesState.setShowModal(true);
            }}
          />

          <PersonalInfoSection
            personalInfo={personalInfo}
            handleChange={handleChange}
            formErrors={formErrors}
            handleAddError={handleAddError}
            isSubmited={isSubmited}
          />

          <ShippingMethodsSection shippingMethod={shippingMethod} setShippingMethod={setShippingMethod} />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            localQuantities={localQuantities}
            updatingItems={updatingItems}
            onChangeQty={changeQuantity}
            subtotal={subtotal}
            shippingCost={shippingCost}
            discount={discount}
            total={total}
            orderLoading={orderLoading}
            canPlaceOrder={canPlaceOrder}
            onPlaceOrder={handlePlaceOrder}
            onCouponApplied={handleCouponApplied}
            onCouponCleared={handleCouponCleared}
          />
        </div>
      </div>

      <AddAddressModal
        isOpen={addressesState.showModal}
        onClose={() => addressesState.setShowModal(false)}
        onSuccess={addressesState.onAddressAdded}
      />
    </motion.div>
  );
}

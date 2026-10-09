"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BadgeDollarSign, CreditCard, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import GoBackButton from "../OrderDetails/GoBackButton";
import PaymentMethodCard from "./PaymentMethodCard";
import { Field, Input } from "./PaymentField";
import OrderSummaryCard from "./OrderSummaryCard";
import { useQuotationPayment } from "../../../hooks/useQuotationPayment";
import { PaymentMethod, PaymentFormData } from "../../../types/Payment";
import { images } from '@/shared/constants/images';

interface QuotationPaymentProps {
  onClose?: () => void;
  onComplete?: () => void;
}

export default function QuotationPaymentPage({ onClose, onComplete }: QuotationPaymentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "";
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [formData, setFormData] = useState<PaymentFormData>({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    method: "card",
  });

  const {
    loading,
    error,
    paymentOrder,
    paymentState,
    processPayment,
    initializePayment,
    resetPaymentState,
  } = useQuotationPayment(orderId);

  useEffect(() => {
    initializePayment();
  }, [initializePayment]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, method }));
  }, [method]);

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmPayment = async () => {
    try {
      const result = await processPayment({
        showMessage: true,
        onSuccess: (data) => {
          resetPaymentState();
          if (onComplete) {
            onComplete();
          }
          // Redirect to order page or payment success page
          router.push("/profile?tab=service_market&subTab=my_orders");
        },
      });
      return result;
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const isFormValid = () => {
    if (method === "card") {
      return (
        formData.cardholderName.trim() !== "" &&
        formData.cardNumber.trim() !== "" &&
        formData.expiryDate.trim() !== "" &&
        formData.cvv.trim() !== ""
      );
    }
    return true; // For Apple/Google Pay, validation handled by their SDKs
  };

  if (!paymentOrder && loading) {
    return (
      <section className="w-full bg-[#FAFCFB] p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blueSite mx-auto mb-4"></div>
            <p className="text-[#667085]">Loading payment details...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!paymentOrder) {
    return (
      <section className="w-full bg-[#FAFCFB] p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load payment details</p>
            {error && <p className="text-blueSite text-sm">{error}</p>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#FAFCFB] p-4 md:p-6">
      <div className="mb-5">
        {onClose && <GoBackButton onClick={onClose} />}
      </div>

      <div>
        <div className="mb-3 flex items-center gap-3">
          <span className="h-8 w-[5px] rounded-full bg-blueSite" />
          <h1 className="text-[22px] font-bold text-[#1F2937] md:text-[38px]">
            {t('serviceMarket.rfq.quotationPayment.title')}
          </h1>
        </div>

        <p className="text-[15px] text-[#667085]">
          {t('serviceMarket.rfq.quotationPayment.description')}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[22px] border border-[#E5ECE8] bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_16%),linear-gradient(180deg,#F7FAF9_0%,#F5F7F6_100%)] p-5 md:p-6">
          <div className="mb-6 flex items-start gap-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6F1] text-blueSite">
              <BadgeDollarSign className="h-5 w-5" />
            </span>

            <div>
              <h3 className="text-[20px] font-bold text-[#1F2937]">
                {t('serviceMarket.rfq.quotationPayment.paymentMethodTitle')}
              </h3>
              <p className="mt-1 text-sm text-[#98A2B3]">
                {t('serviceMarket.rfq.quotationPayment.paymentMethodDescription')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            <PaymentMethodCard
              title={t('serviceMarket.rfq.quotationPayment.creditCardTitle')}
              selected={method === "card"}
              onClick={() => setMethod("card")}
              logos={[
                {
                  type: "image",
                  src: "/Visa_Inc.svg",
                  alt: "visa",
                },
                 {
                  type: "image",
                  src: "/Mastercard.svg",
                  alt: "visa",
                },
               
              ]}
            />
            <PaymentMethodCard
              title={t('serviceMarket.rfq.quotationPayment.applePayTitle')}
              subtitle={t('serviceMarket.rfq.quotationPayment.applePaySubtitle')}
              selected={method === "apple"}
              onClick={() => setMethod("apple")}
                     logos={[
                {
                  type: "image",
                  src: "/apple-pay.svg",
                  alt: "visa",
                },
                
              ]}
            />
            <PaymentMethodCard
              title={t('serviceMarket.rfq.quotationPayment.googlePayTitle')}
              subtitle={t('serviceMarket.rfq.quotationPayment.googlePaySubtitle')}
              selected={method === "google"}
              onClick={() => setMethod("google")}
                     logos={[
                {
                  type: "image",
                  src: "/Google_Pay.svg",
                  alt: "visa",
                },
                
              ]}
            />
          </div>

          {method === "card" && (
            <div className="mt-5 space-y-5">
              <Field label={t('serviceMarket.rfq.quotationPayment.cardholderName')}>
                <Input
                  placeholder={t('serviceMarket.rfq.quotationPayment.cardholderNamePlaceholder')}
                  icon={<CreditCard className="h-4 w-4" />}
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                />
              </Field>

              <Field label={t('serviceMarket.rfq.quotationPayment.cardNumber')}>
                <Input
                  placeholder={t('serviceMarket.rfq.quotationPayment.cardNumberPlaceholder')}
                  icon={<CreditCard className="h-4 w-4" />}
                  rightNode={<span className="text-xs font-semibold text-[#D98C00]">MC</span>}
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label={t('serviceMarket.rfq.quotationPayment.expireDate')}>
                  <Input
                    placeholder={t('serviceMarket.rfq.quotationPayment.expireDatePlaceholder')}
                    icon={<CreditCard className="h-4 w-4" />}
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  />
                </Field>

                <Field label={t('serviceMarket.rfq.quotationPayment.cvv')}>
                  <Input
                    placeholder={t('serviceMarket.rfq.quotationPayment.cvvPlaceholder')}
                    icon={<Lock className="h-4 w-4" />}
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#98A2B3]">
            <Lock className="h-3.5 w-3.5 text-[#22A447]" />
            {t('serviceMarket.rfq.quotationPayment.securityNote')}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <OrderSummaryCard
            servicePrice={`${paymentOrder.currency} ${paymentOrder.servicePrice}`}
            vat={`${paymentOrder.currency} ${paymentOrder.vat}`}
            fees={`${paymentOrder.currency} ${paymentOrder.fees}`}
            totalAmount={`${paymentOrder.currency} ${paymentOrder.totalAmount}`}
            paymentStatus={paymentOrder.paymentStatus}
            onConfirm={handleConfirmPayment}
            disabled={!isFormValid() || paymentState.isProcessing || loading}
          />

          <div className="flex items-center justify-center gap-2 text-xs text-[#98A2B3]">
            <Lock className="h-3.5 w-3.5 text-[#22A447]" />
            {t('serviceMarket.rfq.quotationPayment.securePayment')}
          </div>
        </div>
      </div>
    </section>
  );
}
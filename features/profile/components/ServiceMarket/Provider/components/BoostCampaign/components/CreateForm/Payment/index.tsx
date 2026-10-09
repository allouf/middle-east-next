"use client";

import { useState } from "react";
import { BadgeDollarSign, CreditCard, Lock } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import PaymentMethodCard from "./PaymentMethodCard";
import { Field, Input } from "./PaymentField";
import OrderSummaryCard from "./OrderSummaryCard";

type PaymentMethod = "card" | "apple" | "google";

interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  method: PaymentMethod;
}

interface PaymentStepProps {
  planPrice: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function PaymentStep({ planPrice, onConfirm, onCancel }: PaymentStepProps) {
  const { t } = useTranslation();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [formData, setFormData] = useState<PaymentFormData>({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    method: "card",
  });

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    return true;
  };   

  return (
    <section
      className="min-h-[600px] rounded-[24px] bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.20),_transparent_16%),linear-gradient(180deg,#F7FAF9_0%,#F5F7F6_100%)] p-4 sm:p-5 md:p-6 lg:p-7" >
      <div>
        <div className="mb-2 flex items-center gap-3">
          <span className="h-6 w-[4px] rounded-full bg-blueSite" />
          <h1 className="text-[18px] font-bold text-[#1F2937] md:text-[24px]">
            {t('serviceMarket.boostCampaign.payment.title', { defaultValue: "Payment" })}
          </h1>
        </div>

        <p className="text-[13px] text-[#667085]">
          {t('serviceMarket.boostCampaign.payment.description', { defaultValue: "Complete your payment to activate your boost campaign" })}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[16px] border border-[#E5ECE8] bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_16%),linear-gradient(180deg,#F7FAF9_0%,#F5F7F6_100%)] p-4 md:p-5">
          <div className="mb-4 flex items-start gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF6F1] text-blueSite">
              <BadgeDollarSign className="h-4 w-4" />
            </span>

            <div>
              <h3 className="text-[16px] font-bold text-[#1F2937]">
                {t('serviceMarket.boostCampaign.payment.paymentMethodTitle', { defaultValue: "Payment Method" })}
              </h3>
              <p className="mt-0.5 text-xs text-[#98A2B3]">
                {t('serviceMarket.boostCampaign.payment.paymentMethodDescription', { defaultValue: "Select your preferred payment method" })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <PaymentMethodCard
              title={t('serviceMarket.boostCampaign.payment.creditCardTitle', { defaultValue: "Credit Card" })}
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
                  alt: "mastercard",
                },
              ]}
            />
            <PaymentMethodCard
              title={t('serviceMarket.boostCampaign.payment.applePayTitle', { defaultValue: "Apple Pay" })}
              selected={method === "apple"}
              onClick={() => setMethod("apple")}
              logos={[
                {
                  type: "image",
                  src: "/apple-pay.svg",
                  alt: "apple-pay",
                },
              ]}
            />
            <PaymentMethodCard
              title={t('serviceMarket.boostCampaign.payment.googlePayTitle', { defaultValue: "Google Pay" })}
              selected={method === "google"}
              onClick={() => setMethod("google")}
              logos={[
                {
                  type: "image",
                  src: "/Google_Pay.svg",
                  alt: "google-pay",
                },
              ]}
            />
          </div>

          {method === "card" && (
            <div className="mt-4 space-y-3">
              <Field label={t('serviceMarket.boostCampaign.payment.cardholderName', { defaultValue: "Cardholder Name" })}>
                <Input
                  placeholder={t('serviceMarket.boostCampaign.payment.cardholderNamePlaceholder', { defaultValue: "Enter cardholder name" })}
                  icon={<CreditCard className="h-4 w-4" />}
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                />
              </Field>

              <Field label={t('serviceMarket.boostCampaign.payment.cardNumber', { defaultValue: "Card Number" })}>
                <Input
                  placeholder={t('serviceMarket.boostCampaign.payment.cardNumberPlaceholder', { defaultValue: "Enter card number" })}
                  icon={<CreditCard className="h-4 w-4" />}
                  rightNode={<span className="text-xs font-semibold text-[#D98C00]">MC</span>}
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Field label={t('serviceMarket.boostCampaign.payment.expireDate', { defaultValue: "Expiry Date" })}>
                  <Input
                    placeholder={t('serviceMarket.boostCampaign.payment.expireDatePlaceholder', { defaultValue: "MM/YY" })}
                    icon={<CreditCard className="h-4 w-4" />}
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  />
                </Field>

                <Field label={t('serviceMarket.boostCampaign.payment.cvv', { defaultValue: "CVV" })}>
                  <Input
                    placeholder={t('serviceMarket.boostCampaign.payment.cvvPlaceholder', { defaultValue: "Enter CVV" })}
                    icon={<Lock className="h-4 w-4" />}
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#98A2B3]">
            <Lock className="h-3 w-3 text-[#22A447]" />
            {t('serviceMarket.boostCampaign.payment.securityNote', { defaultValue: "Your payment information is secure" })}
          </div>
        </div>

        <div className="space-y-3">
          <OrderSummaryCard
            servicePrice={planPrice}
            vat="0.00 $"
            fees="0.00 $"
            totalAmount={planPrice}
            paymentStatus={t('serviceMarket.boostCampaign.payment.pending', { defaultValue: "PENDING PAYMENT" })}
            onConfirm={onConfirm}
          />
        </div>
      </div>
    </section>
  );
}

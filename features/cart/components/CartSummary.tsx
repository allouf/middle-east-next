"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Props = {
    subtotal: number;
    formatMoney: (n: number | null | undefined) => string;
};

export const CartSummary: React.FC<Props> = ({ subtotal, formatMoney }) => {
    const { t } = useTranslation();

    return (
        <div className="lg:col-span-1 lg:border-s border-bgGray">
            <div className="rounded-xl p-4 sm:p-5 lg:p-6">
                {/* Title */}
                <div className="text-blueSite font-bold mb-3 text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px]">
                    {t("cart.summary")}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-textColor font-medium text-[14px] sm:text-[15px] md:text-[16px]">
                        {t("cart.totalPrice")}
                    </span>
                    <span className="text-subTitleColor font-semibold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px]">
                        ${formatMoney(subtotal)}
                    </span>
                </div>

                {/* CTA */}
                <div className="mt-4 w-full">
                    <Button
                        to="/checkout"
                        scale={1.02}
                        unstyled
                        className="bg-blueSite w-full text-textWhiteColor rounded-xl font-bold text-center
                       py-2.5 sm:py-3
                       text-[14px] sm:text-[15px] md:text-[16px]"
                    >
                        {t("cart.proceedToCheckout")}
                    </Button>
                </div>

                {/* Progress */}
                <div className="h-2 w-full rounded-full bg-bgGray mt-4 overflow-hidden">
                    <div className="bg-blueSite h-full w-[50%]" />
                </div>

                {/* Free shipping note */}
                <div className="mt-3 text-textColor leading-relaxed text-[12px] sm:text-[13px] md:text-[14px]">
                    {t("cart.getFree")}{" "}
                    <span className="text-subTitleColor font-semibold">{t("cart.shipping")}</span>{" "}
                    {t("cart.forOrdersOver")}
                    <span className="text-[#D02F44] font-semibold"> $100.00</span>
                </div>

                {/* Continue shopping */}
                <div className="mt-2">
                    <Button
                        to="/"
                        scale={1.03}
                        unstyled
                        className="text-blueSite underline underline-offset-2
                       text-[13px] sm:text-[14px] md:text-[15px] font-semibold"
                    >
                        {t("buttons.continueShopping")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

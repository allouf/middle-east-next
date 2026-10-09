"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import React from "react";

type Props = {
    shippingMethod: string;
    setShippingMethod: (v: "express" | "standard") => void;
};

export const ShippingMethodsSection: React.FC<Props> = ({
    shippingMethod,
    setShippingMethod,
}) => {
    const { t } = useTranslation();

    return (
        <section className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-7 bg-blueSite rounded" />
                <h2 className="text-[#3C4242] text-2xl">  {t('checkout.shippingMethodsTitle')}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <label
                    className={`flex items-center gap-4 rounded-lg p-5 border cursor-pointer ${shippingMethod === "express"
                        ? "border-blueSite bg-blueSiteHover"
                        : "border-gray-300"
                        }`}
                >
                    <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="
                                appearance-none
                                w-4 h-4
                                rounded-full
                                border-2 border-gray-400
                                checked:border-white
                                checked:bg-white
                                cursor-pointer
                                 "
                    />
                    <div className="flex-1">
                        <div className={`font-medium ${shippingMethod === "express" ? "text-white" : "text-subTitleColor"}`}>
                            {t('checkout.expressDelivery')}
                        </div>
                        <div className={`text-sm  ${shippingMethod === "express" ? "text-white" : "text-subTitleColor"}`}>{t('checkout.expressDeliveryDesc')}</div>
                    </div>
                    <div className={`text-sm  ${shippingMethod === "express" ? "text-white" : "text-subTitleColor"}`}>$50.00</div>
                </label>

                <label
                    className={`flex items-center gap-4 rounded-lg p-5 border cursor-pointer ${shippingMethod === "standard"
                        ? "border-blueSite bg-blueSiteHover"
                        : "border-gray-300"
                        }`}
                >
                    <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="
                                appearance-none
                                w-4 h-4
                                rounded-full
                                border-2 border-gray-400
                                checked:border-white
                                checked:bg-white
                                cursor-pointer
                                 "
                    />
                    <div className="flex-1">
                        <div className={`font-medium ${shippingMethod === "standard" ? "text-white" : "text-subTitleColor"}`}>
                            {t('checkout.standardDelivery')}
                        </div>
                        <div className={`text-sm  ${shippingMethod === "standard" ? "text-white" : "text-subTitleColor"}`}>   {t('checkout.standardDeliveryDesc')} </div>
                    </div>
                    <div className={`text-sm  ${shippingMethod === "standard" ? "text-white" : "text-subTitleColor"}`}>   {t('checkout.standardDelivery')}</div>
                </label>
            </div>
        </section>
    );
};

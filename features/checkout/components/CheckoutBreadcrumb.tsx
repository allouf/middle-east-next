"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";

export const CheckoutBreadcrumb: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-2 text-[#555] mb-6">
            <Button to="/" unstyled className="text-sm hover:underline">
                {t('checkout.homePage')}
            </Button>
            <span className="text-sm">/</span>
            <Button to="/cart" unstyled className="text-sm hover:underline">
                {t('checkout.cart')}
            </Button>
            <span className="text-sm">/</span>
            <span className="text-sm text-blueSite font-semibold"> {t('checkout.checkout')}</span>
        </div>
    );
};

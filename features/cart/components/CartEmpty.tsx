"use client";

import React from "react";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/shered/Breadcrumbs";
import emptyCartImg from "@/assets/images/emptyCart.png";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Image from "next/image";

export const CartEmpty: React.FC = () => {
    const { t } = useTranslation();

    return (
        <motion.div
            key="empty-cart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-center"
        >
            <Breadcrumbs
                items={[
                    { label: t("cart.homePage"), href: "/" },
                    { label: t("cart.yourCart") },
                ]}
            />

            <div className="flex flex-col items-center justify-center gap-8">
                <div className="relative w-[300px] h-[300px] 2xl:w-[400px] 2xl:h-[400px]">
                    <Image
                        src={emptyCartImg}
                        alt="empty cart"
                        fill
                        priority
                        sizes="(max-width: 768px) 300px, 400px"
                        className="object-contain"
                    />
                </div>
                <div>
                    <h2 className="text-[30px] font-semibold text-subTitleColor mb-4">
                        {t("cart.empty_title")}
                    </h2>
                    <p className="text-textColor text-[20px]">{t("cart.empty_title")}</p>
                    <p className="text-textColor text-[20px] mb-6">{t("cart.empty_message")}</p>
                </div>
            </div>
        </motion.div>
    );
};

"use client";

import React from "react";
import { Rate } from "antd";
import type { Product } from "@/features/product/types/type";

import { useTranslation } from "@/lib/i18n/useTranslation";

/* ---------------- Types ---------------- */

export type CompareRowConfig = {
    label: string;
    path: string; // e.g. "price", "category.name", "store.name"
    type?: "text" | "money" | "rating" | "badge" | "number" | "percent";
};

type Props = {
    row: CompareRowConfig;
    products: (Product | null)[];
    isStriped?: boolean;
};

/* ---------------- Helpers ---------------- */

const getByPath = (obj: any, path: string) =>
    path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

const formatMoney = (v: any, lang: string) => {
    const n = Number(v);
    if (Number.isNaN(n)) return "—";
    return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(n);
};

const renderBadge = (text: string, t: any) => {
    const v = String(text || "").toLowerCase();

    // availability
    if (v === "in_stock") {
        return (
            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-700">
                {t("compareProducts.inStock")}
            </span>
        );
    }

    if (v === "out_of_stock") {
        return (
            <span className="px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700">
                {t("compareProducts.outOfStock")}
            </span>
        );
    }

    // status
    if (v === "active") {
        return (
            <span className="px-2 py-1 rounded text-xs font-semibold bg-[#E6F0ED] text-blueSite">
                {t("compareProducts.active")}
            </span>
        );
    }

    if (v === "inactive") {
        return (
            <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                {t("compareProducts.inactive")}
            </span>
        );
    }

    return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
            {String(text || "—")}
        </span>
    );
};

export const renderValue = (row: CompareRowConfig, product: Product | any, t: any, lang: string) => {
    const raw = getByPath(product, row.path);

    if (raw === null || raw === undefined || raw === "") {
        return <span className="text-gray-400">—</span>;
    }

    switch (row.type) {
        case "rating":
            return (
                <div className="flex items-center gap-2">
                    <Rate
                        disabled
                        value={Number(raw) || 0}
                        style={{ fontSize: 16 }}
                        className="[&_li]:!m-0 !flex gap-1"
                    />
                    <span className="text-gray-400 text-xs">
                        ({(product.reviews || 0).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")})
                    </span>
                </div>
            );

        case "money":
            return <span className="text-blueSite font-semibold">{formatMoney(raw, lang)}</span>;

        case "number":
            return <span>{Number(raw).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}</span>;

        case "percent":
            return <span>{Number(raw)}%</span>;

        case "badge":
            return renderBadge(String(raw), t);

        case "text":
        default:
            return <span>{String(raw)}</span>;
    }
};

/* ---------------- Component ---------------- */
const CompareRow: React.FC<Props> = ({ row, products, isStriped }) => {
    const { t, i18n } = useTranslation();
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 border-b border-gray-200 last:border-b-0 ${isStriped ? "bg-[#F9FAFB]" : ""
                }`}
        >
            {/* Label column */}
            <div className="p-4 text-sm text-gray-500 border-r border-gray-200">
                {row.label}
            </div>

            {/* Product columns */}
            {products.map((product, index) => (
                <div
                    key={index}
                    className="p-4 text-sm border-r border-gray-200 last:border-r-0"
                >
                    {product ? renderValue(row, product, t, i18n.language) : <div className="h-5" />}
                </div>
            ))}
        </div>
    );
};

export default CompareRow;

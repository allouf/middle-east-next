'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Eye, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../../lib/api";
import { useAlert } from "@/lib/context/AlertProvider";
import { PRODUCTS_ENDPOINT } from "@/shared/constants/urls";
import Link from 'next/link';
import { FaEdit } from "react-icons/fa";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface CollapsedProductProps {
  product: any;
  refetch: (page?: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const CollapsedProduct = ({ product, refetch, canEdit = true, canDelete = true }: CollapsedProductProps) => {
  const { t } = useTranslation();
  const { message, confirm } = useAlert();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);
  // 🖼️ Extract first image safely
  const image =
    product.gallery?.[0]?.file_path || "https://placehold.co/40x40?text=P";
  // 🧮 Discount label
  const hasDiscount = product.discount_value > 0;
  const handleDelete = async () => {
    if (!canDelete) return;
    confirm.delete(
      t("products.deletePermanently"),
      "", // No content needed as title is clear
      async () => {
        try {
          await api.delete(PRODUCTS_ENDPOINT.deleteProduct(product.id));
          message.success(t("common.deleted_successfully"));
          refetch?.();
        } catch (error) {
          message.error((error as any)?.response?.data?.message || t("common.error"));
        }
      }
    );
  };
  const addSearchParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(key, value);
    newParams.set("tab", "update_product");
    router.push(`${pathname}?${newParams.toString()}`);
  };
  return (
    <div className="border-b  p-3 mb-3 bg-[#F9F9F9] shadow-sm">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input type="checkbox" className="w-4 h-4" />
          <img
            src={image}
            alt={product.name}
            className="w-10 h-10 rounded-md object-cover border"
          />
          <div>
            <p className="text-sm font-semibold text-subTitleColor">#{product.id}</p>
            <p className="text-subTitleColor text-[15px] font-medium truncate max-w-[160px]">
              {product.name}
            </p>
          </div>
        </div>
        <button onClick={toggle} className="p-1 text-subTitleColor hover:text-subTitleColor">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      {/* Collapsible Details */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t pt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <p className="flex flex-row">
                <span className="font-semibold text-[#737373] min-w-[80px]">
                  {t("products.price")}:
                </span>{" "}
                ${product.price}
              </p>
              <p className="flex flex-row">
                <span className="font-semibold text-[#737373]  min-w-[80px]">
                  {t("products.discount")}:
                </span>{" "}
                {hasDiscount
                  ? `${product.discount_value}${product.discount_type === "percent" ? "%" : "$"
                  }`
                  : "—"}
              </p>
              {/* <p>
                <span className="font-semibold text-[#737373]">Before Discount:</span>{" "}
                ${product.price_before_discount}
              </p> */}
              <p className="flex flex-row">
                <span className="font-semibold text-[#737373] min-w-[80px]">
                  {t("table.category")}:
                </span>{" "}
                {product.category?.name || "—"}
              </p>
              <p className="flex flex-row">
                <span className="font-semibold text-[#737373] min-w-[80px]">
                  {t("products.qty")}:
                </span>{" "}
                {product.number_of_buys}
              </p>
              <p className="flex flex-row">
                <span className="font-semibold text-[#737373] min-w-[80px]">
                  {t("products.purchases")}:
                </span>{" "}
                {product.number_of_buys}
              </p>
              <p className="flex flex-row ">
                <span className="font-semibold text-[#737373] min-w-[80px]">
                  {t("table.status")}:
                </span>{" "}
                <span
                  className={`font-semibold ${product.status === "active"
                      ? "text-green-600"
                      : "text-red-500"
                    } min-w-[80px] first-letter:uppercase`}
                >
                  {product.status === "active" ? t("status.active") : t("status.notActive")}
                </span>
              </p>
              <div className="font-semibold flex flex-row items-center gap-2">
                <span className="font-semibold text-[#737373] min-w-[80px]">
                  {t("table.actions")}:
                </span>
                <div className="flex items-center gap-4 ">
                  <Link href={`/products/${product.id}`}>
                    <Eye
                      size={18}
                      className="text-blueIcons cursor-pointer hover:text-blueSiteHover"
                      title={t("products.viewProduct")}
                    />
                  </Link>
                  {canEdit && (
                    <button
                      className=" py-2 text-blueIcons text-[20px]  rounded-lg  transition font-medium w-full"
                      onClick={() => {
                        addSearchParam("ID", product.id);
                      }}
                    >
                      <FaEdit />
                    </button>
                  )}
                  {canDelete && (
                    <span onClick={handleDelete}>
                      <Trash2
                        size={18}
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        title={t("products.deleteProduct")}
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Actions */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default CollapsedProduct;

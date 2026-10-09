'use client';

import React from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { FlashSellRowProps } from "@/features/stores/types/flashSell";

const FlashSellRow: React.FC<FlashSellRowProps> = ({
  sale,
  handleEditFlashSell,
  handleDeleteFlashSell,
  handleViewFlashSell,
  isRTL = false,
}) => {
  const { t } = useTranslation();

  return (
    <tr className="border-b hover:bg-gray-50">
      {/* ID */}
      <td className={`p-3 ${isRTL ? "text-right" : "text-left"}`}>{sale.id}</td>

      {/* Name */}
      <td className={`p-3 ${isRTL ? "text-right" : "text-left"}`}>{sale.name}</td>

      {/* Discount type */}
      <td className={`p-3  text-center`}>
                  {t(`flashSell.discountTypes.${sale.discount_type}`)}

      </td>

      {/* Discount value */}
      <td className={`p-3 font-semibold text-blueSiteHover text-center`}>
        {sale.discount_type === "percentage"
          ? `${sale.discount_value}%`
          : `$${sale.discount_value}`}
      </td>

      {/* Number products */}
      <td className={`p-3 text-center`}>{sale?.product_count ? sale.product_count : 0}</td>

      {/* Start Date */}
      <td className={`p-3 text-center`}>{new Date(sale.start_date).toLocaleDateString()}</td>

      {/* End Date */}
      <td className={`p-3 text-center`}>{new Date(sale.end_date).toLocaleDateString()}</td>

      {/* Status */}
      <td className="p-3 text-center">
        {sale.status==="active" ? (
          <span className="text-[#56E8A7] bg-[#56E8A7]/20 rounded px-2 py-1 text-xs font-medium cursor-pointer inline-block">
         {t("status.active")}
          </span>
        ) : (
          <span className="text-[#D02F44] bg-[#D02F44]/20 rounded px-2 py-1 text-xs font-medium cursor-pointer inline-block">
          {t("status.notActive")}  
          </span>
        )}
      </td>

      {/* Actions */}
      <td className={`p-3 flex gap-3 items-center  justify-end`}>
        <button
          onClick={() => handleViewFlashSell(sale.id)}
          className="text-blueSite hover:text-blueSiteHover"
        >
          <FaEye size={16} />
        </button>
        <button
          onClick={() => handleEditFlashSell(sale.id)}
          className="text-blueSite hover:text-blueSiteHover"
        >
          <FaEdit size={16} />
        </button>

        <button
          onClick={() => handleDeleteFlashSell(sale.id)}
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash size={16} />
        </button>
      </td>
    </tr>
  );
};

export default FlashSellRow;

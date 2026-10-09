"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { MdEdit } from "react-icons/md";
import { FaHeart, FaRegHeart, FaRegTrashAlt } from "react-icons/fa";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Id } from "../type";

type Props = {
    count: number;

    isEditing: boolean;
    onStartEdit: () => void;
    onCancelEdit: () => void;

    selectedIds: Id[];
    onDeleteClick: () => void;

    onBulkWishlist: () => void;
    isBulkAddingToWishlist: boolean;
    allSelectedInWishlist: boolean;
};

export const CartHeader: React.FC<Props> = ({
    count,
    isEditing,
    onStartEdit,
    onCancelEdit,
    selectedIds,
    onDeleteClick,
    onBulkWishlist,
    isBulkAddingToWishlist,
    allSelectedInWishlist,
}) => {
    const { t } = useTranslation();

    const disableActions = selectedIds.length === 0;

    return (
        <div
            className="
        mb-4 px-3 flex-shrink-0
        flex flex-col gap-3
        sm:flex-row 
      "
        >
            {/* Title */}
            <div className="flex justify-between items-center gap-2 sm:gap-3 w-full">
                <div className="flex flex-col items-center md:flex-row">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#060709] truncate">
                        {t("cart.yourCart")}
                    </h2>

                    <span className="text-[#338572] font-medium text-sm sm:text-base whitespace-nowrap mx-4">
                        ({count} {count === 1 ? t("cart.item") : t("cart.items")})
                    </span>
                </div>


                {/* Actions */}
                <div
                    className="
          flex items-center gap-2 sm:gap-3
          flex-wrap
          justify-end
        "
                >
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={onStartEdit}
                            className="
              text-subTitleColor flex items-center gap-2 
              text-sm sm:text-[20px]
              whitespace-nowrap
            "
                        >
                            <MdEdit className="text-[18px] sm:text-[20px]" />
                            <span className="hidden xs:inline">{t("buttons.edit")}</span>
                            {/* show label from xs+, icon only on very small screens */}
                        </button>
                    ) : (
                        <>
                            <Button
                                unstyled
                                onClick={onDeleteClick}
                                disabled={disableActions}
                                addDisableStyle={false}
                                className="
                text-[#D02F44] disabled:text-opacity-50 bg-transparent
                underline underline-offset-2
                text-sm
                flex items-center gap-1
                whitespace-nowrap
              "
                                aria-disabled={disableActions}
                            >
                                <FaRegTrashAlt className="text-[16px]" />
                                <span className="hidden xs:inline">{t("buttons.delete")}</span>
                            </Button>

                            <button
                                type="button"
                                onClick={onBulkWishlist}
                                disabled={disableActions || isBulkAddingToWishlist}
                                className="
                text-subTitleColor
                text-sm
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
                whitespace-nowrap
              "
                            >
                                <span className="text-[16px]">
                                    {allSelectedInWishlist ? <FaHeart /> : <FaRegHeart />}
                                </span>

                                <span className="hidden xs:inline">
                                    {isBulkAddingToWishlist
                                        ? t("cart.updating")
                                        : allSelectedInWishlist
                                            ? t("wishlist.remove")
                                            : t("wishlist.add")}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="text-sm text-textColor whitespace-nowrap"
                            >
                                {t("buttons.cancel")}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

"use client";

import React from "react";

import LoaderPage from "@/components/shared/LoaderPage";
import Breadcrumbs from "@/components/shered/Breadcrumbs";

import { CartEmpty } from "./CartEmpty";
import { CartHeader } from "./CartHeader";
import { CartSummary } from "./CartSummary";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { useCartPage } from "../hook/useCartPage";
import { formatMoney } from "../utils/formatMoney";
import { useTranslation } from "@/lib/i18n/useTranslation";
import CartCard from "./CartCard";

export default function CartPage() {
    const cartPage = useCartPage();
    const { t } = useTranslation();

    if (cartPage.loading && !cartPage.cart && cartPage.items.length === 0) {
        return <LoaderPage />;
    }

    return (
        <div className="p-4 md:py-10 m-2 mb-10 md:mb-20 min-h-screen">
            {cartPage.cartMesssageContext}

            {cartPage.isEmpty ? (
                <CartEmpty />
            ) : (
                <div>
                    <Breadcrumbs
                        items={[
                            { label: t("cart.homePage"), href: "/" },
                            { label: t("cart.yourCart") },
                        ]}
                    />


                    <div className="relative grid lg:grid-cols-3">
                        <div className="relative lg:col-span-2 flex flex-col ">
                            <CartHeader
                                count={cartPage.count}
                                isEditing={cartPage.isEditing}
                                onStartEdit={() => cartPage.setIsEditing(true)}
                                onCancelEdit={() => {
                                    cartPage.setIsEditing(false);
                                    cartPage.clearSelection();
                                }}
                                selectedIds={cartPage.selectedIds}
                                onDeleteClick={() => cartPage.setShowDeleteConfirm(true)}
                                onBulkWishlist={cartPage.handleBulkAddToWishlist}
                                isBulkAddingToWishlist={cartPage.isBulkAddingToWishlist}
                                allSelectedInWishlist={cartPage.allSelectedInWishlist}
                            />

                            <div className="flex-1  divide-y divide-gray-100 px-3">
                                {cartPage.items.map((item) => (
                                    <CartCard
                                        key={String(item.id)}
                                        item={item}
                                        isEditing={cartPage.isEditing}
                                        selectedIds={cartPage.selectedIds}
                                        toggleSelect={cartPage.toggleSelect}
                                        handleDelete={cartPage.handleDelete}
                                        handleAddToWishlist={cartPage.handleAddToWishlist}
                                        addingToWishlist={cartPage.addingToWishlist}
                                        isInWishlist={cartPage.isInWishlist}
                                        formatMoney={formatMoney}
                                        updateQty={cartPage.updateQty}
                                        localQuantities={cartPage.localQuantities}
                                        updatingItems={cartPage.updatingItems}
                                    />
                                ))}
                            </div>
                        </div>

                        <CartSummary subtotal={cartPage.subtotal} formatMoney={formatMoney} />
                    </div>
                </div>
            )}

            <DeleteConfirmModal
                isOpen={cartPage.showDeleteConfirm}
                onClose={() => cartPage.setShowDeleteConfirm(false)}
                onConfirm={cartPage.handleBulkDelete}
                isDeleting={cartPage.isDeleting}
            />
        </div>
    );
}

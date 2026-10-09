"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";

import useCartStore from "@/lib/store/useCartStore";
import useCartApi from "@/features/cart/hook/useCartApi";
import useWishlistStore from "@/lib/store/useWishlistStore";
import useWishlistApi from "@/lib/api/useWishlistApi";

import type { Cart, CartItem, Id, WishlistItem } from "../type";
import { App } from "antd";

type Timer = ReturnType<typeof setTimeout>;

export const useCartPage = () => {
    const items = useCartStore((s) => s.items) as CartItem[];
    const cart = useCartStore((s) => s.cart) as Cart | null;
    const setCart = useCartStore((s) => s.setCart) as (c: Cart) => void;
    const setLoading = useCartStore((s) => s.setLoading) as (b: boolean) => void;
    const loading = useCartStore((s) => s.loading) as boolean;
    const { message: messageApi } = App.useApp();

    const { fetchCart, removeFromCart, updateCartItem } = useCartApi();
    const { addToWishlist } = useWishlistApi();

    const addWishlistItem = useWishlistStore((s) => s.addItem) as (x: WishlistItem) => void;
    const removeWishlistItem = useWishlistStore((s) => s.removeItem) as (id: Id) => void;
    const updateWishlistItemId = useWishlistStore((s) => s.updateWishlistItemId) as (
        productId: Id,
        wishlistItemId: Id
    ) => void;
    const isInWishlist = useWishlistStore((s) => s.isInWishlist) as (id: Id) => boolean;

    // optimistic qty
    const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
    const [updatingItems, setUpdatingItems] = useState<Set<Id>>(new Set());
    const debounceTimers = useRef<Record<string, Timer | undefined>>({});
    const pendingUpdates = useRef<Record<string, number | undefined>>({});

    // UI state
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Id[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [addingToWishlist, setAddingToWishlist] = useState<Set<Id>>(new Set());

    // initial load
    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            try {
                const response = await fetchCart();
                if (response?.status && response?.data) {
                    setCart(response.data);

                    const initial: Record<string, number> = {};
                    response.data.items?.forEach((it: CartItem) => {
                        initial[String(it.id)] = it.quantity ?? 1;
                    });
                    setLocalQuantities(initial);
                }
            } catch (err) {
                console.error("Failed to load cart:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [fetchCart, setCart, setLoading]);

    // sync quantities when API updates items (but don’t override items in-flight)
    useEffect(() => {
        const currentIds = new Set(items.map((it) => String(it.id)));
        const next: Record<string, number> = {};

        items.forEach((it) => {
            if (!updatingItems.has(it.id)) next[String(it.id)] = it.quantity ?? 1;
        });

        setLocalQuantities((prev) => {
            const merged = { ...prev, ...next };
            Object.keys(merged).forEach((id) => {
                if (!currentIds.has(id)) delete merged[id];
            });
            return merged;
        });
    }, [items, updatingItems]);

    // cleanup timers
    useEffect(() => {
        return () => {
            Object.values(debounceTimers.current).forEach((timer) => {
                if (timer) clearTimeout(timer);
            });
        };
    }, []);

    const displayItems = useMemo(() => {
        return items.map((it) => ({
            ...it,
            quantity: localQuantities[String(it.id)] ?? it.quantity ?? 1,
        }));
    }, [items, localQuantities]);

    const { count, subtotal } = useMemo(() => {
        const c = displayItems.reduce((s, it) => s + (it.quantity ?? 0), 0);
        const sub = cart?.total_price ?? 0;
        return { count: c, subtotal: sub };
    }, [displayItems, cart]);

    const debouncedUpdateQty = async (itemId: Id, finalQuantity: number) => {
        setUpdatingItems((prev) => new Set(prev).add(itemId));

        try {
            const response = await updateCartItem(
                itemId,
                { quantity: finalQuantity },
                { showMessage: false }
            );

            if (response?.status && response?.data) {
                const cartResponse = await fetchCart();
                if (cartResponse?.status && cartResponse?.data) {
                    setCart(cartResponse.data);

                    const updated: Record<string, number> = {};
                    cartResponse.data.items?.forEach((it: CartItem) => {
                        updated[String(it.id)] = it.quantity ?? 1;
                    });
                    setLocalQuantities((prev) => ({ ...prev, ...updated }));
                }
            }
        } catch (err) {
            console.error("Failed to update quantity:", err);
            const item = items.find((i) => i.id === itemId);
            if (item) {
                setLocalQuantities((prev) => ({
                    ...prev,
                    [String(itemId)]: item.quantity ?? 1,
                }));
            }
        } finally {
            delete pendingUpdates.current[String(itemId)];
            setUpdatingItems((prev) => {
                const s = new Set(prev);
                s.delete(itemId);
                return s;
            });
        }
    };

    const updateQty = (itemId: Id, delta: number) => {
        const item = items.find((i) => i.id === itemId);
        if (!item) return;

        const key = String(itemId);
        const current = localQuantities[key] ?? item.quantity ?? 1;
        const next = Math.max(1, Math.min(99, current + delta));

        setLocalQuantities((prev) => ({ ...prev, [key]: next }));
        pendingUpdates.current[key] = next;

        if (debounceTimers.current[key]) clearTimeout(debounceTimers.current[key]);

        debounceTimers.current[key] = setTimeout(() => {
            const finalQty = pendingUpdates.current[key];
            if (finalQty != null) debouncedUpdateQty(itemId, finalQty);
            delete debounceTimers.current[key];
        }, 500);
    };

    const toggleSelect = (id: Id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const clearSelection = () => setSelectedIds([]);

    const clearPendingForItem = (itemId: Id) => {
        const key = String(itemId);
        if (debounceTimers.current[key]) {
            clearTimeout(debounceTimers.current[key]);
            delete debounceTimers.current[key];
        }
        delete pendingUpdates.current[key];

        setLocalQuantities((prev) => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
    };

    const handleDelete = async (itemId: Id) => {
        clearPendingForItem(itemId);

        const currentItems = items.filter((it) => it.id !== itemId);
        setCart({
            ...(cart ?? {}),
            items: currentItems,
            total_price: currentItems.reduce((sum, it) => sum + (it.subtotal ?? 0), 0),
        });

        try {
            await removeFromCart(itemId, { showMessage: false });
            const cartResponse = await fetchCart();
            if (cartResponse?.status && cartResponse?.data) setCart(cartResponse.data);
        } catch (err) {
            console.error("Failed to delete item:", err);
            const cartResponse = await fetchCart();
            if (cartResponse?.status && cartResponse?.data) setCart(cartResponse.data);
        }
    };

    const handleBulkDelete = async () => {
        selectedIds.forEach(clearPendingForItem);

        try {
            setIsDeleting(true);
            await Promise.all(selectedIds.map((id) => removeFromCart(id, { showMessage: false })));

            const cartResponse = await fetchCart();
            if (cartResponse?.status && cartResponse?.data) setCart(cartResponse.data);

            setShowDeleteConfirm(false);
            setIsEditing(false);
            clearSelection();
        } catch (err) {
            console.error("Failed to delete items:", err);
            const cartResponse = await fetchCart();
            if (cartResponse?.status && cartResponse?.data) setCart(cartResponse.data);
        } finally {
            setIsDeleting(false);
        }
    };

    const convertCartItemToWishlist = (cartItem: CartItem): WishlistItem | null => {
        const product = cartItem.variant?.product || cartItem.product;
        if (!product?.id) return null;

        return {
            id: product.id,
            name: product.name || t("cart.product"),
            title: product.name || t("cart.product"),
            categoryPath: product.category?.name ? [product.category.name] : [t("cart.electronic")],
            company: product.store?.name || t("cart.companyName"),
            verified: true,
            options: (cartItem.variant?.options ?? {}) as Record<string, unknown>,
            price: Number(cartItem.price ?? product.price ?? 0),
            image:
                cartItem.variant?.image || product.gallery?.[0]?.file_path || "/dummy/prod21.png",
            discountBadge:
                (product.discount_value ?? 0) > 0
                    ? product.discount_type === "percentage"
                        ? `${product.discount_value}% OFF`
                        : `$${product.discount_value} OFF`
                    : null,
            stock: cartItem.variant?.stock ?? product.quantity ?? 12,
            rating: product.avg_rating ?? 5,
            description:
                product.description ||
                t("cart.messages.defaultDescription"),
            quantity: product.quantity ?? 12,
        };
    };

    const handleAddToWishlist = async (cartItem: CartItem) => {
        const productId = cartItem.variant?.product?.id || cartItem.product?.id;
        if (!productId) {
            messageApi.error(t("cart.productInfoNotAvailable"));
            return;
        }

        const inWishlist = isInWishlist(productId);
        const productName = cartItem.variant?.product?.name || cartItem.product?.name || t("cart.product");

        setAddingToWishlist((prev) => new Set(prev).add(productId));

        try {
            if (typeof productId === "number") {
                await addToWishlist(productId, {
                    showMessage: false,
                    onSuccess: () => {
                        if (inWishlist) {
                            removeWishlistItem(productId);
                            messageApi.info(
                                t("wishlist.removed", { title: productName })
                            );
                        } else {
                            const wishlistItem = convertCartItemToWishlist(cartItem);
                            if (wishlistItem) {
                                wishlistItem.wishlistItemId = productId;
                                addWishlistItem(wishlistItem);
                                updateWishlistItemId(productId, productId);
                                messageApi.success(
                                    t("wishlist.added", { name: productName })
                                );
                            }
                        }
                    },
                });
            } else {
                if (inWishlist) {
                    removeWishlistItem(productId);
                    messageApi.info(
                        t("wishlist.removed", { title: productName })
                    );
                } else {
                    const wishlistItem = convertCartItemToWishlist(cartItem);
                    if (wishlistItem) {
                        addWishlistItem(wishlistItem);
                        messageApi.success(
                            t("wishlist.added", { name: productName })
                        );
                    }
                }
            }
        } catch (err) {
            // console.error("Failed to toggle wishlist:", err);
            messageApi.error(t("wishlist.failed_message"));
        } finally {
            setAddingToWishlist((prev) => {
                const s = new Set(prev);
                s.delete(productId);
                return s;
            });
        }
    };

    const selectedProductIds = useMemo(() => {
        return selectedIds
            .map((cartId) => items.find((it) => it.id === cartId)?.variant?.product?.id)
            .filter((x): x is Id => Boolean(x));
    }, [selectedIds, items]);

    const isBulkAddingToWishlist = useMemo(() => {
        return selectedProductIds.some((pid) => addingToWishlist.has(pid));
    }, [selectedProductIds, addingToWishlist]);

    const allSelectedInWishlist = useMemo(() => {
        return selectedProductIds.length > 0 && selectedProductIds.every((pid) => isInWishlist(pid));
    }, [selectedProductIds, isInWishlist]);

    const handleBulkAddToWishlist = async () => {
        if (selectedIds.length === 0) {
            messageApi.info(t("cart.selectItemsForWishlist"), 2);
            return;
        }

        const selectedItems = items.filter((it) => selectedIds.includes(it.id));
        const productIds = new Set<Id>();

        selectedItems.forEach((it) => {
            const pid = it.variant?.product?.id;
            if (pid) productIds.add(pid);
        });

        if (productIds.size === 0) {
            messageApi.info(t("cart.noValidProductsSelected"), 2);
            return;
        }

        const ids = Array.from(productIds);
        const inWishlistBefore = ids.filter((id) => isInWishlist(id));
        const notInWishlistBefore = ids.filter((id) => !isInWishlist(id));

        ids.forEach((id) => setAddingToWishlist((prev) => new Set(prev).add(id)));

        try {
            const apiCalls = ids
                .filter((id): id is number => typeof id === "number")
                .map(async (productId) => {
                    const inWishlist = isInWishlist(productId);

                    try {
                        await addToWishlist(productId, {
                            showMessage: false,
                            onSuccess: () => {
                                const cartItem = selectedItems.find(
                                    (it) => it.variant?.product?.id === productId
                                );
                                if (inWishlist) {
                                    removeWishlistItem(productId);
                                } else if (cartItem) {
                                    const wishlistItem = convertCartItemToWishlist(cartItem);
                                    if (wishlistItem) {
                                        wishlistItem.wishlistItemId = productId;
                                        addWishlistItem(wishlistItem);
                                        updateWishlistItemId(productId, productId);
                                    }
                                }
                            },
                        });
                    } catch (e) {
                        console.error(`Failed to toggle product ${productId} in wishlist:`, e);
                    }
                });

            await Promise.all(apiCalls);

            ids
                .filter((id) => typeof id !== "number")
                .forEach((productId) => {
                    const inWishlist = isInWishlist(productId);
                    if (inWishlist) {
                        removeWishlistItem(productId);
                    } else {
                        const cartItem = selectedItems.find((it) => it.variant?.product?.id === productId);
                        if (cartItem) {
                            const wishlistItem = convertCartItemToWishlist(cartItem);
                            if (wishlistItem) addWishlistItem(wishlistItem);
                        }
                    }
                });

            const addedCount = notInWishlistBefore.length;
            const removedCount = inWishlistBefore.length;

            if (addedCount > 0 && removedCount > 0) {
                messageApi.success(
                    t("cart.itemsAddedAndRemoved", {
                        addedCount,
                        removedCount,
                        addedText: addedCount > 1 ? t("cart.items") : t("cart.item"),
                        removedText: removedCount > 1 ? t("cart.items") : t("cart.item"),
                    }),
                    2
                );

            } else if (addedCount > 0) {
                messageApi.success(
                    t("cart.itemsAddedToWishlist", {
                        count: addedCount,
                        itemText: addedCount > 1 ? t("cart.items") : t("cart.item"),
                    }),
                    2
                );

            } else if (removedCount > 0) {
                messageApi.info(
                    t("cart.itemsRemovedFromWishlist", {
                        count: removedCount,
                        itemText: removedCount > 1 ? t("cart.items") : t("cart.item"),
                    }),
                    2
                );

            }

            setIsEditing(false);
            clearSelection();
        } catch (err) {
            console.error("Failed to toggle items in wishlist:", err);
            messageApi.error(t("cart.failedToToggleWishlist"), 2);
        } finally {
            ids.forEach((id) =>
                setAddingToWishlist((prev) => {
                    const s = new Set(prev);
                    s.delete(id);
                    return s;
                })
            );
        }
    };

    const isEmpty = !items || items.length === 0;

    return {
        // data
        items,
        cart,
        loading,
        isEmpty,
        displayItems,
        count,
        subtotal,

        // qty
        localQuantities,
        updatingItems,
        updateQty,

        // edit/select
        isEditing,
        setIsEditing,
        selectedIds,
        toggleSelect,
        clearSelection,

        // delete
        showDeleteConfirm,
        setShowDeleteConfirm,
        isDeleting,
        handleDelete,
        handleBulkDelete,

        // wishlist
        addingToWishlist,
        handleAddToWishlist,
        handleBulkAddToWishlist,
        isBulkAddingToWishlist,
        allSelectedInWishlist,
        isInWishlist,
        cartMesssageContext: null
    };
};

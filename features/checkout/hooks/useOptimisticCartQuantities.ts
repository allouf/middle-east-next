"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CartItem = any;

export function useOptimisticCartQuantities(params: {
    items: CartItem[];
    updateCartItem: (id: number, payload: any, opts?: any) => Promise<any>;
    fetchCart: () => Promise<any>;
    setCart: (data: any) => void;
    debounceMs?: number;
}) {
    const { items, updateCartItem, fetchCart, setCart, debounceMs = 500 } = params;

    const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

    const debounceTimers = useRef<Record<string, any>>({});
    const pendingUpdates = useRef<Record<string, number>>({});

    // init local quantities once
    useEffect(() => {
        const initial: Record<string, number> = {};
        items.forEach((it) => {
            initial[String(it.id)] = it.quantity || it.qty || 1;
        });
        setLocalQuantities(initial);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // sync when items change (except those updating)
    useEffect(() => {
        const currentIds = new Set(items.map((it) => String(it.id)));
        const next: Record<string, number> = {};

        items.forEach((it) => {
            if (!updatingItems.has(it.id)) {
                next[String(it.id)] = it.quantity || it.qty || 1;
            }
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
            Object.values(debounceTimers.current).forEach((t) => t && clearTimeout(t));
        };
    }, []);

    const debouncedUpdateQty = useCallback(
        async (itemId: number, finalQty: number) => {
            setUpdatingItems((prev) => new Set(prev).add(itemId));

            try {
                const response = await updateCartItem(
                    itemId,
                    { quantity: finalQty },
                    { showMessage: false }
                );

                if (response?.status) {
                    const cartResponse = await fetchCart();
                    if (cartResponse?.status && cartResponse?.data) {
                        setCart(cartResponse.data);

                        const updated: Record<string, number> = {};
                        cartResponse.data.items?.forEach((it: any) => {
                            updated[String(it.id)] = it.quantity || it.qty || 1;
                        });
                        setLocalQuantities((prev) => ({ ...prev, ...updated }));
                    }
                }
            } catch (e) {
                console.error("Failed to update quantity:", e);
                const item = items.find((i) => i.id === itemId);
                if (item) {
                    setLocalQuantities((prev) => ({
                        ...prev,
                        [String(itemId)]: item.quantity || item.qty || 1,
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
        },
        [fetchCart, items, setCart, updateCartItem]
    );

    const changeQuantity = useCallback(
        (item: any, delta: number) => {
            const id = item.id;
            const key = String(id);

            const current =
                localQuantities[key] ?? item.quantity ?? item.qty ?? 1;

            const nextQty = Math.max(1, Math.min(99, current + delta));

            setLocalQuantities((prev) => ({ ...prev, [key]: nextQty }));
            pendingUpdates.current[key] = nextQty;

            if (debounceTimers.current[key]) clearTimeout(debounceTimers.current[key]);

            debounceTimers.current[key] = setTimeout(() => {
                const final = pendingUpdates.current[key];
                if (final !== undefined) debouncedUpdateQty(id, final);
                delete debounceTimers.current[key];
            }, debounceMs);
        },
        [debouncedUpdateQty, debounceMs, localQuantities]
    );

    const subtotal = useMemo(() => {
        const displayItems = items.map((it) => ({
            ...it,
            quantity: localQuantities[String(it.id)] ?? it.quantity ?? it.qty ?? 1,
        }));

        return displayItems.reduce(
            (s, it) => s + (it.price || 0) * (it.quantity || 0),
            0
        );
    }, [items, localQuantities]);

    return {
        localQuantities,
        updatingItems,
        changeQuantity,
        subtotal,
    };
}

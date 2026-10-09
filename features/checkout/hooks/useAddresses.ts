"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Address = any;

export function useAddresses(fetchAddresses: () => Promise<any>) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [addressQuery, setAddressQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const loadAddresses = useCallback(async () => {
        try {
            const result = await fetchAddresses();
            if (result?.data) {
                setAddresses(result.data);

                const defaultAddr = result.data.find((a: any) => a.is_default);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                    setAddressQuery(defaultAddr.address);
                }
            }
        } catch (e) {
            console.error("Failed to load addresses:", e);
        }
    }, [fetchAddresses]);

    useEffect(() => {
        loadAddresses();
    }, [loadAddresses]);

    const normalizedQuery = addressQuery.trim().toLowerCase();

    const addressMatches = useMemo(() => {
        return addresses.filter((a: any) =>
            normalizedQuery === "" ? true : a.address.toLowerCase().includes(normalizedQuery)
        );
    }, [addresses, normalizedQuery]);

    const shouldShowList =
        showSuggestions && (normalizedQuery === "" || addressMatches.length > 0);

    const selectedAddress = useMemo(
        () => addresses.find((a: any) => a.id === selectedAddressId),
        [addresses, selectedAddressId]
    );

    const selectAddress = useCallback((addr: any) => {
        setSelectedAddressId(addr.id);
        setAddressQuery(addr.address);
        setShowSuggestions(false);
    }, []);

    const onAddressAdded = useCallback(
        (data: any) => {
            loadAddresses();
            if (data?.data) {
                setSelectedAddressId(data.data.id);
                setAddressQuery(data.data.address);
            }
        },
        [loadAddresses]
    );

    return {
        addresses,
        selectedAddressId,
        setSelectedAddressId,

        addressQuery,
        setAddressQuery,

        showSuggestions,
        setShowSuggestions,

        showModal,
        setShowModal,

        addressMatches,
        shouldShowList,
        selectedAddress,

        loadAddresses,
        selectAddress,
        onAddressAdded,
    };
}

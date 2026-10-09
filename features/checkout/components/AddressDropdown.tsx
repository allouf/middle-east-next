"use client";

import React, { useEffect } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { FiMapPin, FiPlus } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";

type Props = {
    addressQuery: string;
    setAddressQuery: (v: string) => void;

    showSuggestions: boolean;
    setShowSuggestions: (v: boolean) => void;

    shouldShowList: boolean;
    addressMatches: any[];

    selectedAddressId: number | null;
    onSelectAddress: (addr: any) => void;

    onOpenAddModal: () => void;
};

export const AddressDropdown: React.FC<Props> = ({
    addressQuery,
    setAddressQuery,
    showSuggestions,
    setShowSuggestions,
    shouldShowList,
    addressMatches,
    selectedAddressId,
    onSelectAddress,
    onOpenAddModal,
}) => {
    const { t } = useTranslation();

    useEffect(() => {
        const handler = (e: any) => {
            if (showSuggestions && !e.target.closest(".address-dropdown")) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [setShowSuggestions, showSuggestions]);

    return (
        <div className="relative address-dropdown">
            <input
                value={addressQuery}
                onChange={(e) => setAddressQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="w-full rounded-md border border-gray-300 bg-[#424242] bg-opacity-10 p-3 text-[#323232]"
                placeholder={t("checkout.addressPlaceholder")}
                required
            />

            {shouldShowList && (
                <div className="absolute z-10 w-full mt-2 border rounded-lg overflow-hidden bg-white shadow-lg">
                    <div className="px-4 py-3 text-lightGreen text-sm font-medium border-b">
                        {t("checkout.chooseSavedLocations")}
                    </div>

                    <div className="divide-y max-h-64 overflow-y-auto">
                        {addressMatches.map((addr) => (
                            <button
                                key={addr.id}
                                type="button"
                                onClick={() => onSelectAddress(addr)}
                                className={`w-full flex items-start gap-3 px-4 py-4 text-left   ${selectedAddressId === addr.id ? "bg-lightGreen text-white" : "hover:bg-gray-50"
                                    }`}
                            >
                                <MdLocationOn
                                    size={20}
                                    className={`mt-1 flex-shrink-0 ${selectedAddressId === addr.id ? " text-white" : "text-blueSite"}`}
                                />



                                <div className="flex-1">
                                    <div className={` text-sm ${selectedAddressId === addr.id ? " text-white" : "text-blueSite"}`}>{addr.address}</div>
                                    <div className="text-xs text-textColor mt-1">
                                        {addr.region?.name} - {addr.country?.name}
                                        {addr.is_default && (
                                            <span className={`ml-2  font-medium ${selectedAddressId === addr.id ? " text-white" : "text-blueSite"}`}>
                                                {t("checkout.defaultTag")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="w-full flex items-center gap-2 px-4 py-4 text-left text-[#323232] hover:bg-gray-50 border-t"
                        onClick={onOpenAddModal}
                    >
                        <FiPlus
                            size={16}
                            className="flex-shrink-0 text-blueSite"
                        />

                        <span className="text-blueSite font-medium">
                            {t("checkout.addOtherLocation")}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

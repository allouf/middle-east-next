"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LocationAutocomplete from "@/components/Map/LocationAutocomplete";
import useAddressApi from "@/lib/api/useAddressApi";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Button from "@/components/ui/Button"; // optional: if you want external button
import useFormData from "@/lib/Hooks/useFormData";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (data: any) => void;
    editingAddress?: any | null;
};

type FormData = {
    // region_id: string | number;
    address: string;
    is_default: boolean;
    // latitude: number | "";
    // longitude: number | "";
    lat: number | "";
    lng: number | "";
    city?: string;
    country?: string;
    country_code?: string;
    region?: string;
    postal_code?: string;
};

const INITIAL_FORM: FormData = {
    // region_id: "",
    address: "",
    is_default: false,
    lat: "",
    lng: "",
    city: "",
    country_code: "",
    postal_code: "",
    region: "",
};

const AddAddressModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onSuccess,
    editingAddress,
}) => {
    const { t } = useTranslation();
    const { addAddress, updateAddress } = useAddressApi();
    const { formData, resetForm, updateLocation } = useFormData();
    // ✅ keep a ref to open map when showInput=false
    const openMapRef = useRef<null | (() => void)>(null);


    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    // ✅ open map automatically when modal opens (because showInput=false)
    useEffect(() => {
        if (isOpen) {
            // small delay is okay but not required
            openMapRef.current?.();
        }
    }, [isOpen]);



    const submitAddress = useCallback(
        async (loc: any) => {
            const payload = {
                ...formData,            // keep other fields like is_default
                address: loc.address,
                lat: loc.lat,
                lng: loc.lng,
                city: loc.city,
                country: loc.country,
                country_code: loc.country_code,
                region: loc.region,
                postal_code: loc.postal_code,
            };
            try {
                if (editingAddress) {
                    await updateAddress(editingAddress.id, payload, {
                        onSuccess: (data: any) => {
                            onSuccess?.(data);
                            resetForm();
                            handleClose();
                        },
                    });
                } else {
                    await addAddress(payload, {
                        onSuccess: (data: any) => {
                            onSuccess?.(data);
                            resetForm();
                            handleClose();
                        },
                    });
                }
            } catch (error) {
                console.error(
                    `Failed to ${editingAddress ? t("address.update") : t("address.add")}:`,
                    error
                );
            }
        }, [formData, editingAddress, updateAddress, addAddress, onSuccess, handleClose, t]);


    return (
        <>

            {/* Optional external trigger (since input is hidden) */}
            {/* <Button onClick={() => openMapRef.current?.()}>
                {t("store.label.location")}
            </Button> */}

            <LocationAutocomplete
                id="location"
                showInput={false}                 // ✅ hidden field
                isOpenMap={isOpen} // ✅ store open()
                onLocationChange={updateLocation} // ✅ single handler only
                validate
                required
                formErrors={{}}
                defaultCenter={
                    formData.latitude !== "" && formData.longitude !== ""
                        ? { lat: Number(formData.latitude), lng: Number(formData.longitude) }
                        : null
                }
                onClose={handleClose}
                functions={submitAddress}
                disabled={false}
            />
        </>
    );
};

export default AddAddressModal;

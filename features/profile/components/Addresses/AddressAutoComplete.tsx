'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGoogleMaps } from '@/providers/GoogleMapsProvider';
import { Modal, Button } from 'antd';

import { MapPin, Pencil, Plus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import useFormData from '@/lib/Hooks/useFormData';
import dynamic from 'next/dynamic';

const MapAddressSection = dynamic(() => import('./MapAddressSection'), { 
  ssr: false, 
  loading: () => <div className="flex items-center justify-center p-4">Loading Map...</div> 
});

const SecondAddressStep = dynamic(() => import('@/features/profile/components/Addresses/SecondAddressStep'), { 
  ssr: false, 
  loading: () => <div className="flex items-center justify-center p-4">Loading Form...</div> 
});
import { App } from 'antd';
import { Address } from '@/features/profile/types/addresses';



type LatLng = { lat: number; lng: number };

export interface LocationData {
  id?: number;
  title?: string;
  lat?: number;
  lng?: number;
  longitude?: number;
  latitude?: number;
  address: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  postal_code: string;
  is_default?: boolean;
}

interface LocationAutocompleteProps {
  id: string;
  onLocationChange?: (location: LocationData) => void;
  validate?: boolean;
  required?: boolean;
  formErrors?: Record<string, string | undefined>;
  defaultCenter?: Partial<LatLng> | null;
  disabled?: boolean;
  showInput?: boolean;
  isOpenMap?: boolean;
  onOpenMapChange?: (open: boolean) => void;
  functions?: (location: LocationData) => void | Promise<void>;
  onClose?: () => void;
  onConfirm?: (locationData: LocationData) => void;
  refetch?: () => void;
  isEdit: boolean;
  oldData: Partial<Address>;
  noAddress: boolean;
}

const getLocationLabel = (location: Partial<LocationData> | null): string => {
  if (!location) return '';
  // you can change to address if you prefer
  return (
    location.address ||
    [location.country, location.region, location.city].filter(Boolean).join(' - ')
  );
};

function hasLatLng(center?: Partial<LatLng> | null): center is LatLng {
  return !!center && typeof center.lat === 'number' && typeof center.lng === 'number';
}

/**
 * Reverse geocode helper: converts lat/lng => formatted address + components
 * Requires Maps JS API to be loaded (isLoaded === true)
 */
async function reverseGeocode(
  lat: number,
  lng: number
): Promise<LocationData | null> {
  if (typeof window === 'undefined' || !(window as any).google?.maps) return null;

  const geocoder = new google.maps.Geocoder();

  const { results } = await geocoder.geocode({ location: { lat, lng } });
  const first = results?.[0];
  if (!first) return null;

  const getComponent = (type: string) =>
    first.address_components?.find((c) => c.types.includes(type))?.long_name || '';

  const getComponentShort = (type: string) =>
    first.address_components?.find((c) => c.types.includes(type))?.short_name || '';

  const city =
    getComponent('locality') ||
    getComponent('administrative_area_level_2') ||
    getComponent('sublocality') ||
    '';

  const region = getComponent('administrative_area_level_1') || '';
  const country = getComponent('country') || '';
  const country_code = getComponentShort('country') || '';
  const postal_code = getComponent('postal_code') || '';

  return {
    lat,
    lng,
    address: first.formatted_address || '',
    country,
    country_code,
    region,
    city,
    postal_code,
  };
}



export default function AddressAutoComplete({
  id,
  onLocationChange,
  validate = false,
  required = false,
  formErrors = {},
  defaultCenter,
  disabled = false,
  showInput = true,
  isOpenMap,
  onOpenMapChange,
  functions,
  onClose,
  onConfirm,
  refetch,
  isEdit = false,
  oldData,
  noAddress = false
}: LocationAutocompleteProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [dialogEntered, setDialogEntered] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isResolvingDefault, setIsResolvingDefault] = useState(false);
  const [showNewTitleInput, setShowNewTitleInput] = useState(false);
  const { t } = useTranslation();

  // Initialize useFormData with LocationData structure
  const initialLocationData: LocationData = isEdit && oldData ? {
    id: oldData.id,
    latitude: oldData.lat || 0,
    longitude: oldData.lng || 0,
    address: oldData.address || '',
    country: oldData.country || '',
    country_code: oldData.country_code || '',
    region: oldData.region || '',
    city: oldData.city || '',
    postal_code: oldData.postal_code || '',
    title: oldData.title,
    is_default: oldData.is_default || false,
  } : {
    latitude: 0,
    longitude: 0,
    address: '',
    country: '',
    country_code: '',
    region: '',
    city: '',
    postal_code: '',
    is_default: false,
  };

  const {
    formData,
    setFormData,
    handleChange,
    handleArrayChange,
    updateLocation,
    isValid,
    handleAddError,
    errors
  } = useFormData(initialLocationData);

  // Auto-open modal if in edit mode
  //   useEffect(() => {
  //     if (isEdit) {
  //       setOpen(true);
  //     }
  //   }, [isEdit]);
  useEffect(() => {
    if (isEdit && oldData) {
      if (oldData.id !== undefined) {
        handleArrayChange("id", oldData.id);
      }
      if (oldData.title !== undefined) {
        handleArrayChange("title", oldData.title);
      }
      if (oldData.is_default !== undefined) {
        handleArrayChange("is_default", oldData.is_default);

      }
    }
  }, [isEdit, oldData])

  const { message: messageApi } = App.useApp();

  const apiKey = '/api/maps'; // Use secure API proxy endpoint

  const { isLoaded, loadError } = useGoogleMaps();

  // ✅ keep internal open in sync with prop (only when prop is provided)
  useEffect(() => {
    if (typeof isOpenMap === 'boolean') {
      setOpen(isOpenMap);
    }
  }, [isOpenMap]);

  const setOpenSafe = useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenMapChange?.(next);
    },
    [onOpenMapChange]
  );

  const openMap = useCallback(() => {
    if (!isLoaded || disabled || !apiKey) return;

    console.log("map opened", open)
    setOpenSafe(true);
  }, [isLoaded, disabled, apiKey, setOpenSafe, open]);

  const closeMap = useCallback(() => {

    setOpenSafe(false);
    onClose?.();
  }, [setOpenSafe, onClose]);

  /**
   * ✅ NEW: if defaultCenter is provided, reverse-geocode it and show in the TextField
   * - runs when map is loaded + defaultCenter changes
   * - does NOT override if user already selected a location (locationData already set)
   */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!isLoaded) return;
      if (!hasLatLng(defaultCenter)) return;
      if (locationData) return; // don't overwrite user's selection

      try {
        setIsResolvingDefault(true);
        const resolved = await reverseGeocode(defaultCenter.lat, defaultCenter.lng);
        if (cancelled) return;
        if (resolved) setLocationData(resolved);
      } catch {
        // ignore geocode errors silently (or show a message if you want)
      } finally {
        if (!cancelled) setIsResolvingDefault(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, defaultCenter, locationData]);

  const handleConfirm = useCallback(async () => {
    if (!locationData) return;

    if (step === 1) {
      // Move to step 2 (form details)
      setStep(2);
      updateLocation({
        address: locationData.address,
        lat: locationData.lat,
        lng: locationData.lng,
        city: locationData.city,
        country: locationData.country,
        country_code: locationData.country_code,
        region: locationData.region,
        postal_code: locationData.postal_code,
        is_default: oldData?.is_default || false
      });
      //   await onLocationChange?.(locationData);
      await functions?.(locationData);
    } else if (step === 2) {
      // Final confirmation
      await onConfirm?.(locationData);
      closeMap();
    }
  }, [locationData, onLocationChange, functions, onConfirm, closeMap, step]);

  const handleBackToMap = useCallback(() => {
    setStep(1);
  }, []);

  const errorText = formErrors[id];
  const loadingText = t('common.loading');

  const displayValue = useMemo(() => {
    if (!isLoaded) {
      if (loadError) return t("addressModal.failedToLoadMaps");
      return loadingText;
    }
    if (isResolvingDefault) return loadingText;
    return getLocationLabel(locationData);
  }, [isLoaded, loadError, loadingText, isResolvingDefault, locationData]);

  useEffect(() => {

    if (locationData)
      updateLocation({
        address: locationData.address,
        lat: locationData.lat,
        lng: locationData.lng,
        city: locationData.city,
        country: locationData.country,
        country_code: locationData.country_code,
        region: locationData.region,
        postal_code: locationData.postal_code,
        is_default: oldData?.is_default || false
      });
  }, [locationData])



  return (
    <div key={id} className="flex justify-end items-center flex-col w-full">
      {!isEdit && !noAddress && <button
        onClick={openMap}
        className="self-start flex items-center text-[20px] font-semibold gap-2 text-blueSiteHover hover:text-blueSiteHover transition-colors cursor-pointer mb-6"
      >
        <Plus className="font-bold" size={22} />
        <span className="font-semibold">
          {t("address.addNewAddress")}
        </span>
      </button>}
      {
        !isEdit && noAddress && <button

          onClick={openMap}
          className="inline-flex justify-center   duration-300 items-center max-w-[450px] gap-2 bg-blueBtn text-textWhiteColor px-6 py-3 rounded-md hover:bg-blueSiteHover transition-colors"
        >
          <Plus size={18} />
          {t("address.addNewAddress")}
        </button>
      }

      {isEdit &&
        <button

          onClick={openMap}
          className="flex items-center gap-1.5 text-blueSite hover:text-blueSiteHover transition-colors"
        >
          <Pencil size={18} />
          <span className="text-[18px] underline underline-offset-2 font-medium text-subTitleColor">
            {t("address.edit")}
          </span>
        </button>}

      {/* {validate && showInput && (errorText || required) && (
        <p className="text-red-500 text-xs mt-1">{errorText || t('errorRequired')}</p>
      )} */}

      {!apiKey && (
        <p className="text-red-500 text-xs mt-1">{t("addressModal.missingMapsKey")}</p>
      )}


      <Modal
        open={open}
        onCancel={closeMap}
        footer={null}
        width="min(680px, 95vw)"
        centered
        destroyOnClose
        styles={{
          body: {
            padding: 0,
            backgroundColor: '#f7f9fc',
            height: '85vh',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '16px',
          },
          content: {
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            padding: 0,
          },
        }}
        afterOpenChange={(visible) => {
          if (visible) setDialogEntered(true);
          else setDialogEntered(false);
        }}
        closeIcon={null}
        className="relative"
      >
        {/* Step 1: Map Selection */}
        {isLoaded && dialogEntered && (
          <MapAddressSection
            defaultCenter={defaultCenter}
            locationData={locationData}
            onLocationChange={setLocationData}
            isEdit={isEdit}
            oldData={oldData}
          />
        )}
        {loadError && (
          <p className="text-red-500 text-sm mt-2">
            {t("addressModal.couldNotLoadMaps")}
          </p>
        )}
        <motion.button
          type="button"
          onClick={closeMap}
          className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-md border border-transparent rounded-full p-2 text-blueBtn transition-all duration-300"
          aria-label="Close modal"
          whileHover={{
            scale: 1.2,
            rotate: 90,
            boxShadow: "0 0 15px rgba(33,150,243,0.7)",
          }}
          whileTap={{ scale: 0.9 }}
        >
          <AiOutlineClose size={18} />
        </motion.button>
        <motion.div
          initial={{ height: "200px" }}
          animate={{
            height: step === 1 ? "200px" : showNewTitleInput ? "480px" : "450px",
          }}
          transition={{ duration: 0.3 }}
          className="absolute z-[999] bottom-6 w-full flex justify-center"
        >
          <div className="h-full w-[90%] sm:w-[70%] bg-white rounded-xl p-3">
            {step === 1 && (
              <div className="p-3 bg-white rounded-lg">
                <div className="border-b border-gray-300 mb-3">
                  <h2 className="text-lg text-textColor pb-2">
                    {t("addressModal.chooseExact")}
                  </h2>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="text-blueIcons mt-1 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      {locationData?.address || t("addressModal.selectLocation")}
                    </p>
                    {locationData && (
                      <p className="text-xs text-gray-500">
                        Lat: {locationData.lat.toFixed(6)}, Long: {locationData.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="primary"
                      onClick={handleConfirm}
                      disabled={!locationData}
                      style={{
                        backgroundColor: !locationData ? '#cbd5e1' : '#00664F',
                        borderColor: !locationData ? '#cbd5e1' : '#00664F',
                        borderRadius: '8px',
                        paddingInline: '2rem',
                        fontWeight: 600,
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                      }}
                    >
                      {t("addressModal.confirmLocation")}
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}

            {step === 2 && (
              <SecondAddressStep
                formData={formData}
                handleArrayChange={handleArrayChange}
                errors={errors}
                handleChange={handleChange}
                handleAddError={handleAddError}
                isValid={isValid}
                handleBackToMap={handleBackToMap}
                messageApi={messageApi}
                showNewTitleInput={showNewTitleInput}
                setShowNewTitleInput={setShowNewTitleInput}
                handleClose={() => setOpen(false)}
                refetch={refetch}
                isEdit={isEdit}
              />
            )}
          </div>
        </motion.div>
      </Modal>
    </div>
  );
}

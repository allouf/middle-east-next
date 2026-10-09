'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGoogleMaps } from '@/providers/GoogleMapsProvider';
import {
  Modal,
  Input,
  Button,
  ConfigProvider,
} from 'antd';
import { X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import MapSection from './MapSection';



type LatLng = { lat: number; lng: number };

export type LocationData = {
  lat: number;
  lng: number;
  address: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  postal_code: string;
};

type LocationAutocompleteProps = {
  id: string;
  onLocationChange?: (location: LocationData) => void;
  validate?: boolean;
  required?: boolean;
  formErrors?: Record<string, string | undefined>;
  defaultCenter?: Partial<LatLng> | null;
  disabled?: boolean;
  isSubmited?: boolean;
  withFieldset?: boolean;
  onSubmit?: boolean;

  showInput?: boolean;
  isOpenMap?: boolean;
  onOpenMapChange?: (open: boolean) => void;

  functions?: (location: LocationData) => void | Promise<void>;
  onClose?: () => void;
  handleAddError?: (id: string, error?: string) => void;
};

const getLocationLabel = (location: Partial<LocationData> | null): string => {
  if (!location) return '';
  return [location.country, location.region, location.city].filter(Boolean).join(' - ');
};

function hasLatLng(center?: Partial<LatLng> | null): center is LatLng {
  return !!center && typeof center.lat === 'number' && typeof center.lng === 'number';
}

async function reverseGeocode(
  lat: number,
  lng: number,
  language?: string
): Promise<LocationData | null> {
  if (typeof window === 'undefined' || !(window as any).google?.maps) return null;

  const geocoder = new google.maps.Geocoder();

  const { results } = await geocoder.geocode({ 
    location: { lat, lng },
    language: language || 'en' // Use provided language or default to English
  });
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

export default function LocationAutocomplete({
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
  isSubmited = false,
  onSubmit = false,
  withFieldset = false,
  onClose,
  handleAddError
}: LocationAutocompleteProps) {
  const { t, locale } = useTranslation();
  const [open, setOpen] = useState<boolean>(Boolean(isOpenMap));
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isResolvingDefault, setIsResolvingDefault] = useState(false);

  const apiKey = '/api/maps'; // Use secure API proxy endpoint

  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (typeof isOpenMap === 'boolean') setOpen(isOpenMap);
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
    setOpenSafe(true);
  }, [isLoaded, disabled, apiKey, setOpenSafe]);

  const closeMap = useCallback(() => {
    setOpenSafe(false);
    onClose?.();
  }, [setOpenSafe, onClose]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!isLoaded) return;
      if (!hasLatLng(defaultCenter)) return;
      if (locationData) return;

      try {
        setIsResolvingDefault(true);
        const resolved = await reverseGeocode(defaultCenter.lat, defaultCenter.lng, locale);
        if (cancelled) return;
        if (resolved) setLocationData(resolved);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setIsResolvingDefault(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, defaultCenter, locationData]);

  useEffect(() => {
    if (!validate || !required || !handleAddError)
      return

    if (!locationData) {
      handleAddError(id, t("errorRequired"))
      return
    }

    if (!locationData.country || Object.keys(locationData.country).length === 0) {
      handleAddError(id, t("errorRequired"))
      return
    }

    if (!locationData.region || Object.keys(locationData.region).length === 0) {
      handleAddError(id, t("header.location.regionRequired") || "Please enter a location with a valid region")
      return
    }

    handleAddError(id, "")
  }, [locationData, isSubmited, onSubmit, id, handleAddError, required, t, validate])

  const handleConfirm = useCallback(async () => {
    if (!locationData) return;
    await onLocationChange?.(locationData);
    await functions?.(locationData);
    closeMap();
  }, [locationData, onLocationChange, functions, closeMap]);

  const loadingText = t('common.loading');

  const displayValue = useMemo(() => {
    if (!isLoaded) {
      if (loadError) return t('address.location.mapsLoadFailed');
      return loadingText;
    }
    if (isResolvingDefault) return loadingText;
    return getLocationLabel(locationData);
  }, [isLoaded, loadError, loadingText, isResolvingDefault, locationData]);

  const shouldShowErrors = onSubmit ? isSubmited : (isSubmited || !!formErrors?.[id]);
  const fieldError = formErrors?.[id];
  const hasError = shouldShowErrors && (fieldError || (validate && required && !locationData));

  const renderError = () => {
    const errorMessage = fieldError || (required && !locationData ? t("errorRequired") : null);
    if (!shouldShowErrors || !errorMessage) return null;

    return (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-xs mt-1"
      >
        {errorMessage}
      </motion.p>
    );
  };

  const renderInput = () => (
    <Input
      id={id}
      value={displayValue}
      placeholder={!isLoaded ? loadingText : t('address.location.selectLocation')}
      onClick={openMap}
      readOnly
      disabled={!isLoaded || disabled || !apiKey}
      variant="outlined"
      suffix={<MapPin size={18} className="text-blueSite" />}
      className="cursor-pointer !border-none !shadow-none !focus:ring-0 !focus:border-none"
      status={hasError ? "error" : undefined}
      bordered={false}
    />
  );

  return (
    <div key={id} className="flex  flex-col w-full">
      {showInput && (
        <>
          {withFieldset ? (
            <fieldset
              className={`
                py-2 px-4 border rounded-lg transition-colors
                ${hasError ? "border-red-400" : "border-grayBorder"}
                ${disabled ? "opacity-60 bg-gray-50" : "bg-white"}
              `}
            >
              <legend className="px-2 text-blueSite font-semibold text-sm">
                {t('address.location.label')}
              </legend>
              <ConfigProvider
                theme={{
                  components: {
                    Input: {
                      activeBorderColor: 'transparent',
                      hoverBorderColor: 'transparent',
                    }
                  }
                }}
              >
                {renderInput()}
              </ConfigProvider>
            </fieldset>
          ) : (
            <div className="flex flex-col w-full">
              <label className="block text-sm font-medium text-textGrayColor mb-1">
                {t('address.location.label')}
              </label>
              {renderInput()}
            </div>
          )}
          {renderError()}
        </>
      )}

      {/* API Key Error */}
      {!apiKey && (
        <p className="text-red-500 text-xs mt-1">{t('address.location.missingApiKey')}</p>
      )}

      {/* Map Modal */}
      <Modal
        title={
          <div className="flex justify-between items-center w-full pr-8">
            <span className="text-white font-bold">{t('address.location.selectLocation')}</span>
          </div>
        }
        open={open}
        onCancel={closeMap}
        footer={[
          <Button
            key="cancel"
            onClick={closeMap}
            className="border-blueSite text-blueSite hover:bg-gray-50 px-6 font-semibold"
          >
            {t('common.cancel')}
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirm}
            disabled={!locationData}
            className="bg-blueSite hover:bg-blueSiteHover text-white px-8 font-semibold mb-5 me-5"
          >
            {t('address.location.confirmLocation')}
          </Button>
        ]}
        width={800}
        styles={{
          header: {
            background: '#00664f',
            padding: '16px 24px',
            margin: 0,
            borderRadius: '8px 8px 0 0',
          },
          mask: {
            backdropFilter: 'blur(4px)',
          },
          content: {
            padding: 0,
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
        closeIcon={<X className="text-white" size={20} />}
      >
        <div className="p-4 bg-[#f7f9fc]">
          {isLoaded && open && (
            <MapSection
              defaultCenter={defaultCenter}
              locationData={locationData}
              onLocationChange={setLocationData}
            />
          )}

          {loadError && (
            <p className="text-red-500 text-sm mt-2">
              {t('address.location.mapsLoadError')}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}

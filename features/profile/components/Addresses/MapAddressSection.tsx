"use client";

import dynamic from "next/dynamic";

import React, { useCallback, useEffect, useMemo, useState, ComponentType, ReactNode } from "react";
import type { GoogleMapProps, AutocompleteProps } from "@react-google-maps/api";

const GoogleMap = dynamic<GoogleMapProps & { children?: ReactNode }>(
  () => import("@react-google-maps/api").then((mod) => mod.GoogleMap),
  {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">Loading Map...</div>,
  }
);

const Autocomplete = dynamic<AutocompleteProps & { children?: ReactNode }>(
  () => import("@react-google-maps/api").then((mod) => mod.Autocomplete),
  {
    ssr: false,
    loading: () => <div className="w-full h-[56px] rounded-lg bg-gray-100 animate-pulse"></div>,
  }
);

const MarkerF = dynamic(() => import("@react-google-maps/api").then((mod) => mod.MarkerF as any), {
  ssr: false,
});

import { Input, Button, message } from "antd";
import { extractAddressData, type AddressComponent } from "@/lib/utils/helper";
import { TbCurrentLocation } from "react-icons/tb";
import { useTranslation } from "@/lib/i18n/useTranslation";

type LatLng = { lat: number; lng: number };

type LocationData = {
  lat: number;
  lng: number;
  address: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  postal_code: string;
};

type MapSectionProps = {
  defaultCenter?: Partial<LatLng> | null;
  locationData?: Partial<LocationData> | null;
  onLocationChange: (data: LocationData) => void;
  isEdit: boolean;
  oldData: {};
};

const FALLBACK_CENTER: LatLng = { lat: 0, lng: 0 };

const isValidLatLng = (c: unknown): c is LatLng => {
  const obj = c as Partial<LatLng> | null | undefined;
  return (
    typeof obj?.lat === "number" &&
    typeof obj?.lng === "number" &&
    !Number.isNaN(obj.lat) &&
    !Number.isNaN(obj.lng)
  );
};

const buildLocationLabel = (data: {
  country?: string;
  region?: string;
  city?: string;
}) => [data.country, data.region, data.city].filter(Boolean).join(" - ");

const getCurrentLocation = (): Promise<LatLng & { denied?: boolean }> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 0, lng: 0, denied: true });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Error getting current location:", error);
        resolve({ lat: 0, lng: 0, denied: true });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
};

// Function to remove Google Plus Code from address
const removePlusCode = (address: string): string => {
  return address.replace(/^[A-Z0-9]{2,4}\+[A-Z0-9]{2,4}\s*,?\s*/, '').trim();
};

const MapAddressSection: React.FC<MapSectionProps> = ({
  defaultCenter,
  locationData,
  onLocationChange,
  isEdit = false,
  oldData
}) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState<string>("");
  const [position, setPosition] = useState<LatLng>(FALLBACK_CENTER);
  const [fallback_center, setFallback_center] = useState<LatLng>(FALLBACK_CENTER);
  const [isLocationDenied, setIsLocationDenied] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const safeCenter: LatLng = useMemo(() => {
    if (isEdit && oldData && (oldData as any).lat && (oldData as any).lng) {
      return { lat: (oldData as any).lat, lng: (oldData as any).lng };
    }
    return isValidLatLng(defaultCenter) ? defaultCenter : fallback_center;
  }, [defaultCenter, isEdit, oldData, fallback_center]);

  // Get user's current location on component mount
  useEffect(() => {
    if (!defaultCenter && !isEdit) {
      getCurrentLocation().then((currentLocation) => {
        console.log("current Location", currentLocation);
        setPosition(currentLocation);
        setFallback_center(currentLocation);

        if (currentLocation.lat === 0 && currentLocation.lng === 0) {
          setIsLocationDenied(true);
        }
      });
    }
  }, [defaultCenter, isEdit]);

  // Handle manual current location request
  const handleGetCurrentLocation = () => {
    getCurrentLocation().then((currentLocation) => {
      console.log("Manual current location request:", currentLocation);

      if (currentLocation.denied) {
        messageApi.error(t("address.addressMap.locationAccessDenied"));
        setIsLocationDenied(true);
      } else {
        setIsLocationDenied(false);
      }

      setPosition(currentLocation);
      setFallback_center(currentLocation);
    });
  };

  // Initialize with oldData if in edit mode
  useEffect(() => {
    if (isEdit && oldData) {
      console.log("oldData", oldData);
      const data = oldData as any;
      const lat = data.lat || 0;
      const lng = data.lng || 0;
      setPosition({ lat, lng });

      const label = buildLocationLabel({
        country: data.country || '',
        region: data.region || '',
        city: data.city || '',
      });

      if (label) setSearch(label);

      const fullLocation = {
        lat: data.lat || 0,
        lng: data.lng || 0,
        address: data.address || '',
        country: data.country || '',
        country_code: data.country_code || '',
        region: data.region || '',
        city: data.city || '',
        postal_code: data.postal_code || '',
      };

      if (fullLocation) onLocationChange?.(fullLocation);
    }
  }, [isEdit, oldData]);

  // Keep marker in sync with center changes
  useEffect(() => {
    setPosition(safeCenter);
  }, [safeCenter]);

  // Prefill label/position from locationData prop
  useEffect(() => {
    if (locationData?.lat != null && locationData?.lng != null) {
      const next: LatLng = { lat: locationData.lat, lng: locationData.lng };
      setPosition(next);

      const label = buildLocationLabel({
        country: locationData.country,
        region: locationData.region,
        city: locationData.city,
      });

      if (label) setSearch(label);
    }
  }, [locationData]);

  const onLoad = useCallback((auto: google.maps.places.Autocomplete) => {
    setAutocomplete(auto);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    const loc = place?.geometry?.location;
    if (!loc) return;

    const lat = loc.lat();
    const lng = loc.lng();

    const addressData = extractAddressData(
      (place.address_components ?? []) as AddressComponent[]
    );
    const label = buildLocationLabel(addressData);

    const fullLocation: LocationData = {
      lat,
      lng,
      address: place.formatted_address ?? "",
      ...addressData,
    };

    onLocationChange(fullLocation);
    setSearch(label);
    setPosition({ lat, lng });
  }, [autocomplete, onLocationChange]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const ll = e.latLng;
      if (!ll) return;

      const lat = ll.lat();
      const lng = ll.lng();

      setPosition({ lat, lng });

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status !== "OK" || !results?.[0]) return;

        const place = results[0];
        const addressData = extractAddressData(
          (place.address_components ?? []) as AddressComponent[]
        );

        const cleanAddress = removePlusCode(place.formatted_address);
        const fullLocation: LocationData = {
          lat,
          lng,
          address: cleanAddress,
          ...addressData,
        };

        onLocationChange(fullLocation);
        setSearch(buildLocationLabel(addressData));
      });
    },
    [onLocationChange]
  );

  // Reverse-geocode the initial safeCenter once it changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.google?.maps) return;
    if (safeCenter.lat == null || safeCenter.lng == null) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: safeCenter.lat, lng: safeCenter.lng } }, (results, status) => {
      if (status !== "OK" || !results?.[0]) return;

      const place = results[0];
      const addressData = extractAddressData(
        (place.address_components ?? []) as AddressComponent[]
      );
      const label = buildLocationLabel(addressData);

      const cleanAddress = removePlusCode(place.formatted_address);
      const fullLocation: LocationData = {
        lat: safeCenter.lat as number,
        lng: safeCenter.lng as number,
        address: cleanAddress,
        ...addressData,
      };

      onLocationChange(fullLocation);
      setSearch(label);
      setPosition(safeCenter);
    });
  }, [safeCenter, onLocationChange]);

  useEffect(() => {
    console.log("currentPosition", position);
  }, [position]);

  return (
    <div className="relative w-full h-full">
      {contextHolder}
      {/* 🔍 Search - Absolute positioned at top */}
      <div className="absolute top-0 left-2 right-2 sm:left-10 sm:right-10 z-10 p-4">
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <Input
                placeholder={t("address.addressMap.searchLocation")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  height: "48px",
                  fontSize: "14px",
                }}
              />
            </Autocomplete>
          </div>
          <Button
            type="primary"
            onClick={handleGetCurrentLocation}
            style={{
              backgroundColor: '#00664f',
              borderColor: '#00664f',
              borderRadius: '8px',
              height: '48px',
              width: '48px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <TbCurrentLocation className="text-[22px] text-white" />
          </Button>
        </div>
      </div>

      {/* 🗺️ Map - Full size */}
      <div
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          height: '100%',
          width: '100%',
        }}
      >
        <GoogleMap
          center={position}
          zoom={isLocationDenied ? 2 : 10}
          onClick={onMapClick}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          <MarkerF position={position} draggable />
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapAddressSection;

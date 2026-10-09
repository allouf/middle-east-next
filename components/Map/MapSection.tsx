"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, GoogleMap, MarkerF } from "@react-google-maps/api";
import { Button, Input, message } from "antd";
import { TbCurrentLocation } from "react-icons/tb";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { extractAddressData, type AddressComponent } from "@/lib/utils/helper";

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
};

const WORLD_CENTER: LatLng = { lat: 0, lng: 0 };
const SEARCH_ZOOM = 16;
const FAR_ZOOM = 4;

const normalizeLatLng = (value?: Partial<LatLng> | null): LatLng | null => {
  if (typeof value?.lat === "number" && typeof value?.lng === "number") {
    return { lat: value.lat, lng: value.lng };
  }
  return null;
};

const getCurrentLocation = (): Promise<LatLng & { denied?: boolean }> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ ...WORLD_CENTER, denied: true });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => resolve({ ...WORLD_CENTER, denied: true }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  });
};

const buildLocationLabel = (data: { country?: string; region?: string; city?: string }) =>
  [data.city, data.region, data.country].filter(Boolean).join(" - ");

const removePlusCode = (address: string): string =>
  address.replace(/^[A-Z0-9]{2,4}\+[A-Z0-9]{2,4}\s*,?\s*/, "").trim();

const buildLocationData = (
  components: AddressComponent[] | undefined,
  formattedAddress: string | undefined,
  lat: number,
  lng: number
) => {
  const addressData = extractAddressData((components ?? []) as AddressComponent[]);
  const label = buildLocationLabel(addressData);
  const cleanedAddress = removePlusCode(formattedAddress ?? "");

  const location: LocationData = {
    lat,
    lng,
    address: cleanedAddress,
    country: addressData.country ?? "",
    country_code: addressData.country_code ?? "",
    region: addressData.region ?? "",
    city: addressData.city ?? "",
    postal_code: addressData.postal_code ?? "",
  };

  return { location, label };
};

// simple responsive height (no MUI)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

export default function MapSection({ defaultCenter, locationData, onLocationChange }: MapSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = (i18n?.language ?? "en").startsWith("ar");
  const isMobile = useIsMobile();

  const normalizedDefault = useMemo(() => normalizeLatLng(defaultCenter), [defaultCenter]);
  const [search, setSearch] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const initialPosition = useMemo(() => {
    if (locationData?.lat != null && locationData?.lng != null) return { lat: locationData.lat, lng: locationData.lng };
    if (normalizedDefault) return normalizedDefault;
    return null;
  }, [locationData, normalizedDefault]);

  const [mapCenter, setMapCenter] = useState<LatLng>(initialPosition ?? WORLD_CENTER);
  const [position, setPosition] = useState<LatLng | null>(initialPosition);
  const [zoom, setZoom] = useState<number>(initialPosition ? 14 : FAR_ZOOM);
  const [isLocationDenied, setIsLocationDenied] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const hasMarker = position != null && !Number.isNaN(position.lat) && !Number.isNaN(position.lng);

  const applyLocationResult = useCallback(
    (location: LocationData, label: string, zoomLevel: number = SEARCH_ZOOM, dropMarker: boolean = true) => {
      setIsLocationDenied(false);
      onLocationChange(location);
      setSearch(label);
      setPosition(dropMarker ? { lat: location.lat, lng: location.lng } : null);
      setMapCenter({ lat: location.lat, lng: location.lng });
      setZoom(zoomLevel);
      mapRef.current?.panTo({ lat: location.lat, lng: location.lng });
      mapRef.current?.setZoom(zoomLevel);
    },
    [onLocationChange]
  );

  const reverseGeocodeAt = useCallback(
    (lat: number, lng: number, options?: { setMarker?: boolean; zoomLevel?: number }) => {
      const zoomLevel = options?.zoomLevel ?? SEARCH_ZOOM;
      const dropMarker = options?.setMarker ?? true;
      if (typeof window === "undefined" || !window.google?.maps) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ 
        location: { lat, lng },
        language: i18n?.language || 'en' // Use current language
      }, (results, status) => {
        if (status !== "OK" || !results?.[0]) return;

        const { location, label } = buildLocationData(
          results[0].address_components as AddressComponent[],
          results[0].formatted_address,
          lat,
          lng
        );

        applyLocationResult(location, label, zoomLevel, dropMarker);
      });
    },
    [applyLocationResult, i18n?.language]
  );

  useEffect(() => {
    if (locationData?.lat != null && locationData?.lng != null) {
      const next: LatLng = { lat: locationData.lat, lng: locationData.lng };
      setPosition(next);
      setMapCenter(next);
      setZoom(14);

      const label = buildLocationLabel({
        country: locationData.country,
        region: locationData.region,
        city: locationData.city,
      });
      if (label) setSearch(label);
    }
  }, [locationData]);

  useEffect(() => {
    if (!normalizedDefault) return;
    reverseGeocodeAt(normalizedDefault.lat, normalizedDefault.lng, { zoomLevel: 14, setMarker: true });
  }, [normalizedDefault, reverseGeocodeAt]);

  useEffect(() => {
    if (normalizedDefault || position) return;
    getCurrentLocation().then((currentLocation) => {
      if (currentLocation.denied) {
        setIsLocationDenied(true);
        setMapCenter(WORLD_CENTER);
        setZoom(FAR_ZOOM);
        return;
      }
      setIsLocationDenied(false);
      setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng });
      setZoom(14);
    });
  }, [normalizedDefault, position]);

  const onLoadAutocomplete = useCallback((auto: google.maps.places.Autocomplete) => {
    setAutocomplete(auto);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    const loc = place?.geometry?.location;
    if (!loc) return;

    const lat = loc.lat();
    const lng = loc.lng();

    const { location, label } = buildLocationData(
      place.address_components as AddressComponent[],
      place.formatted_address,
      lat,
      lng
    );

    applyLocationResult(location, label);
  }, [autocomplete, applyLocationResult]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const ll = e.latLng;
      if (!ll) return;
      reverseGeocodeAt(ll.lat(), ll.lng());
    },
    [reverseGeocodeAt]
  );

  const handleGetCurrentLocation = useCallback(() => {
    getCurrentLocation().then((currentLocation) => {
      if (currentLocation.denied) {
        messageApi.error(t("address.location.denied", { defaultValue: "Location access denied." }));
        setIsLocationDenied(true);
        setPosition(null);
        setMapCenter(WORLD_CENTER);
        setZoom(FAR_ZOOM);
        return;
      }
      setIsLocationDenied(false);
      reverseGeocodeAt(currentLocation.lat, currentLocation.lng, { zoomLevel: SEARCH_ZOOM, setMarker: true });
    });
  }, [messageApi, reverseGeocodeAt, t]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapReady(true);
  }, []);

  const handleMapUnmount = useCallback(() => {
    mapRef.current = null;
    setIsMapReady(false);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (position) mapRef.current.panTo(position);
    mapRef.current.setZoom(isLocationDenied ? FAR_ZOOM : zoom);
  }, [position, zoom, isLocationDenied]);

  return (
    <>
      {contextHolder}

      {/* Search row */}
      <div
        className="flex gap-3 items-start mb-3"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="flex-1">
          <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
            <div
              style={{
                position: "relative",
                direction: isRTL ? "rtl" : "ltr",
              }}
            >
              <fieldset
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: 12,

                }}
                className="px-2"
              >
                <legend
                  style={{
                    padding: "0 6px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#00664f",
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("address.location.label")}
                </legend>

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("addresses.placeholder", {
                    defaultValue: "Search location...",
                  })}
                  bordered={false}
                  style={{
                    height: 36,
                    boxShadow: "none",
                    direction: isRTL ? "rtl" : "ltr",
                    textAlign: isRTL ? "right" : "left",
                    padding: 0,
                  }}
                />
              </fieldset>
            </div>

          </Autocomplete>
        </div>

        <Button
          type="primary"
          className="mt-3"
          onClick={handleGetCurrentLocation}
          style={{
            height: 44,
            width: 48,
            padding: 0,
            borderRadius: 12,
            background: "#00664f",
          }}
        >
          <TbCurrentLocation className="text-[26px]" />
        </Button>
      </div>

      {/* Map */}
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          height: isMobile ? 250 : 370,
        }}
      >
        <GoogleMap
          center={mapCenter}
          zoom={isLocationDenied ? FAR_ZOOM : zoom}
          onClick={onMapClick}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={handleMapLoad}
          onUnmount={handleMapUnmount}
        >
          {hasMarker && position && <MarkerF position={position} draggable />}
        </GoogleMap>

        {!isMapReady && (
          <div
            className="absolute inset-0 flex items-center justify-center font-semibold"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",
              color: "#00664f",
            }}
          >
            {t("common.loading", { defaultValue: "Loading..." })}
          </div>
        )}
      </div>
    </>
  );
}

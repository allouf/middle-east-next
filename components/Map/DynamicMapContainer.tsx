'use client';

import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";

type LatLngTuple = [number, number];

interface LeafletModules {
  MapContainer: typeof import("react-leaflet").MapContainer;
  Marker: typeof import("react-leaflet").Marker;
  TileLayer: typeof import("react-leaflet").TileLayer;
  useMapEvents: typeof import("react-leaflet").useMapEvents;
  L: typeof import("leaflet");
}

interface DynamicMapContainerProps {
  center?: LatLngTuple;
  zoom?: number;
  selectedLocation?: LatLngTuple | null;
  onLocationChange: ({ lat, lng }: { lat: number; lng: number }) => void;
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_CENTER: LatLngTuple = [33.5138, 36.2765];

const DynamicMapContainer: React.FC<DynamicMapContainerProps> = ({
  center,
  zoom = 6,
  selectedLocation = null,
  onLocationChange,
  style,
  className,
}) => {
  const [position, setPosition] = useState<LatLngTuple | null>(
    selectedLocation || null
  );
  const [leaflet, setLeaflet] = useState<LeafletModules | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (leaflet) return;

    const reactLeaflet = require("react-leaflet");
    const L = require("leaflet");

    // Ensure default marker icons load correctly when using Leaflet in Next.js
    delete (L.Icon.Default as any).prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    setLeaflet({
      MapContainer: reactLeaflet.MapContainer,
      Marker: reactLeaflet.Marker,
      TileLayer: reactLeaflet.TileLayer,
      useMapEvents: reactLeaflet.useMapEvents,
      L,
    });
  }, [leaflet]);

  useEffect(() => {
    if (selectedLocation) {
      setPosition(selectedLocation);
    }
  }, [selectedLocation]);

  const initialCenter = useMemo<LatLngTuple>(
    () => center || selectedLocation || DEFAULT_CENTER,
    [center, selectedLocation]
  );

  if (!leaflet) {
    return null;
  }

  const { MapContainer, Marker, TileLayer, useMapEvents } = leaflet;

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationChange({ lat, lng });
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  return (
    <MapContainer
      center={initialCenter}
      zoom={zoom}
      style={style ?? { height: "400px", width: "100%" }}
      className={className}
      scrollWheelZoom
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
};

export default DynamicMapContainer;

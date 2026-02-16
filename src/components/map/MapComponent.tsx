"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { Icon } from "leaflet";
import type { MapComponentProps } from "@/types/location";

export default function MapComponent({
  latitude,
  longitude,
  style,
}: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);
  const mapCreated = useRef(false);

  useEffect(() => {
    setIsClient(true);
    return () => {
      mapCreated.current = false;
    };
  }, []);

  if (!isClient) {
    return (
      <div
        style={{ height: "100%", width: "100%", ...style }}
        className="flex items-center justify-center bg-amber-50"
      >
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    );
  }

  const latLng: LatLngExpression = {
    lat: latitude,
    lng: longitude,
  };

  const customMarker = new Icon({
    iconUrl: "/marker.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  if (mapCreated.current) {
    return null;
  }

  mapCreated.current = true;

  return (
    <MapContainer
      center={latLng}
      zoom={13}
      style={{ height: "100%", width: "100%", ...style }}
      scrollWheelZoom={true}
      whenReady={() => {
        mapCreated.current = true;
      }}
    >
      <Marker position={[latLng.lat, latLng.lng]} icon={customMarker} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}

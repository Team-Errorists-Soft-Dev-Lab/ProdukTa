"use client";

import { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  // Default latitude and longitude for Iloilo City, Philippines
  lat: 10.7202,
  lng: 122.5621,
};

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarker(newMarker);
      await saveToDatabase(newMarker); // Save to Supabase
    }
  };

  const saveToDatabase = async (coords: { lat: number; lng: number }) => {
    const response = await fetch("/api/save-marker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coords),
    });

    if (!response.ok) {
      console.error("Error saving marker:", response.statusText);
      return;
    }

    (await response.json()) as { success: boolean };
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onClick={handleMapClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
}

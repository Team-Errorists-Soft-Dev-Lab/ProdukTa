import { MapComponent } from "@/components/map/MapComponent";

export default function MapPage() {
  return (
    <MapComponent
      latitude={40.7128}
      longitude={-74.006}
      label="Sample Location"
    />
  );
}

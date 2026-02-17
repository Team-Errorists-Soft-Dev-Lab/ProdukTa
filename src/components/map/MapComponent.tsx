import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MarkerPopup,
} from "@/components/ui/map";
import { Card } from "@/components/ui/card";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  label?: string;
  onClick?: (latitude: number, longitude: number) => void;
}

export function MapComponent({
  latitude,
  longitude,
  label,
  onClick,
}: MapComponentProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(latitude, longitude);
    }
  };

  return (
    <Card className="h-[300px] overflow-hidden p-0">
      <Map center={[longitude, latitude]} zoom={12}>
        <MapMarker
          key={1}
          longitude={longitude}
          latitude={latitude}
          onClick={handleClick}
        >
          <MarkerContent>
            <div
              className={`size-4 rounded-full border-2 border-white shadow-lg ${onClick ? "cursor-pointer bg-amber-600 hover:bg-amber-700" : "bg-primary"}`}
            />
          </MarkerContent>
          <MarkerTooltip>{label || "Business Location"}</MarkerTooltip>
          <MarkerPopup>
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                {label || "Business Location"}
              </p>
              <p className="text-xs text-muted-foreground">
                {latitude}, {longitude}
              </p>
            </div>
          </MarkerPopup>
        </MapMarker>
        <MapControls />
      </Map>
    </Card>
  );
}

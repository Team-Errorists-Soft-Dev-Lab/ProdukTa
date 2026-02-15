export interface LocationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export interface MapComponentProps {
  latitude: number;
  longitude: number;
  style?: React.CSSProperties;
}

export interface Location {
  name: string;
  type: "city" | "municipality";
}

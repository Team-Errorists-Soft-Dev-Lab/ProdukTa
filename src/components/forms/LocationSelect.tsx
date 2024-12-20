import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ILOILO_LOCATIONS } from "@/data/iloilo-locations";

interface LocationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function LocationSelect({
  value,
  onValueChange,
  required = false,
  disabled = false,
}: LocationSelectProps) {
  return (
    <div>
      <Label htmlFor="cityMunicipalityAddress">City/Municipality</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
      >
        <SelectTrigger className="mt-1.5">
          <SelectValue placeholder="Select city/municipality" />
        </SelectTrigger>
        <SelectContent>
          {/* Cities */}
          <SelectGroup>
            <SelectLabel>Cities</SelectLabel>
            {ILOILO_LOCATIONS.filter((loc) => loc.type === "city").map(
              (city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ),
            )}
          </SelectGroup>
          {/* Municipalities */}
          <SelectGroup>
            <SelectLabel>Municipalities</SelectLabel>
            {ILOILO_LOCATIONS.filter((loc) => loc.type === "municipality").map(
              (municipality) => (
                <SelectItem key={municipality.name} value={municipality.name}>
                  {municipality.name}
                </SelectItem>
              ),
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

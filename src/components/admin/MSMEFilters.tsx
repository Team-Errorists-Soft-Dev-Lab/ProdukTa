"use client";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ILOILO_LOCATIONS } from "@/lib/iloilo-locations";
import type { MSMEFiltersProps } from "@/types/MSME";

export function MSMEFilters({
  sectors,
  filters,
  onFilterChange,
}: MSMEFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({ sectors: [], cities: [] });
  };

  const handleToggleSector = (sectorId: number) => {
    onFilterChange({
      ...filters,
      sectors: filters.sectors.includes(sectorId)
        ? filters.sectors.filter((id) => id !== sectorId)
        : [...filters.sectors, sectorId],
    });
  };

  const handleToggleCity = (city: string) => {
    onFilterChange({
      ...filters,
      cities: filters.cities.includes(city)
        ? filters.cities.filter((c) => c !== city)
        : [...filters.cities, city],
    });
  };

  const hasActiveFilters =
    filters.sectors.length > 0 || filters.cities.length > 0;

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={
              hasActiveFilters
                ? "border-[#996439] bg-[#996439] text-white hover:bg-[#ce9261] hover:text-white"
                : "border-[#996439] text-[#996439] hover:bg-[#996439] hover:text-white"
            }
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge
                variant="secondary"
                className="ml-2 bg-white text-[#996439]"
              >
                {filters.sectors.length + filters.cities.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {sectors.length > 0 && (
                <CommandGroup heading="Sectors">
                  {sectors.map((sector) => (
                    <CommandItem
                      key={sector.id}
                      onSelect={() => handleToggleSector(sector.id)}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        checked={filters.sectors.includes(sector.id)}
                        className="border-[#996439] data-[state=checked]:bg-[#996439] data-[state=checked]:text-white"
                      />
                      <span>{sector.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandGroup heading="Locations">
                {ILOILO_LOCATIONS.map((location) => (
                  <CommandItem
                    key={location.name}
                    onSelect={() => handleToggleCity(location.name)}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      checked={filters.cities.includes(location.name)}
                      className="border-[#996439] data-[state=checked]:bg-[#996439] data-[state=checked]:text-white"
                    />
                    <span>{location.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {hasActiveFilters && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-[#996439] hover:bg-[#996439]/10"
                onClick={handleClearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear filters
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

import React from "react";

import type { FilterState } from "@/types/table";
import type { Sector } from "@/types/superadmin";
import { ILOILO_LOCATIONS } from "@/lib/iloilo-locations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MSMEFiltersProps {
  sectors: Sector[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export function MSMEFilters({
  sectors,
  filters,
  onFilterChange,
  className,
}: MSMEFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({
      sectors: [],
      cities: [],
    });
  };

  const toggleSector = (sectorId: number) => {
    const newSectors = filters.sectors.includes(sectorId)
      ? filters.sectors.filter((id) => id !== sectorId)
      : [...filters.sectors, sectorId];
    onFilterChange({ ...filters, sectors: newSectors });
  };

  const toggleCity = (city: string) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter((c) => c !== city)
      : [...filters.cities, city];
    onFilterChange({ ...filters, cities: newCities });
  };

  const cities = ILOILO_LOCATIONS.filter((loc) => loc.type === "city");
  const municipalities = ILOILO_LOCATIONS.filter(
    (loc) => loc.type === "municipality",
  );

  const hasActiveFilters =
    filters.sectors.length > 0 || filters.cities.length > 0;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-48 justify-between border-dashed hover:bg-emerald-600 hover:text-white"
          >
            {filters.sectors.length > 0 ? (
              <Badge
                variant="secondary"
                className="rounded-sm bg-emerald-600 px-1 font-normal text-white"
              >
                {filters.sectors.length} selected
              </Badge>
            ) : (
              "Select sectors"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0">
          <Command>
            <CommandInput placeholder="Search sectors..." />
            <CommandEmpty>No sectors found.</CommandEmpty>
            <CommandGroup>
              {sectors.map((sector) => (
                <CommandItem
                  className="hover:bg-emerald-600 hover:text-white"
                  key={sector.id}
                  onSelect={() => toggleSector(sector.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      filters.sectors.includes(sector.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {sector.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-48 justify-between border-dashed hover:bg-emerald-600 hover:text-white"
          >
            {filters.cities.length > 0 ? (
              <Badge
                variant="secondary"
                className="rounded-sm bg-emerald-600 px-1 font-normal text-white"
              >
                {filters.cities.length} selected
              </Badge>
            ) : (
              "Select locations"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0">
          <Command>
            <CommandInput
              placeholder="Search locations..."
              className="w-full"
            />
            <CommandEmpty>No locations found.</CommandEmpty>
            <div className="flex">
              <ScrollArea className="h-[300px] flex-1 p-2">
                <CommandGroup heading="Cities">
                  <div className="grid grid-cols-2 gap-x-4">
                    {cities.map((city) => (
                      <CommandItem
                        key={city.name}
                        onSelect={() => toggleCity(city.name)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.cities.includes(city.name)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {city.name}
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
                <CommandGroup heading="Municipalities" className="mt-2">
                  <div className="grid grid-cols-2 gap-x-4">
                    {municipalities.map((municipality) => (
                      <CommandItem
                        key={municipality.name}
                        onSelect={() => toggleCity(municipality.name)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.cities.includes(municipality.name)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {municipality.name}
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
              </ScrollArea>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="h-8 px-2 text-xs hover:bg-red-600 hover:text-white"
        >
          <X className="mr-1 h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}

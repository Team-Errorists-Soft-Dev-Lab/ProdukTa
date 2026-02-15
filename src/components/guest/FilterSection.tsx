import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { municipalities } from "@/lib/municipalities";
import { type Sector } from "@/types/sector";
import { Checkbox } from "@/components/ui/checkbox";
import { getSectorIcon } from "@/lib/utils";

interface FilterSectionProps {
  setSort: (value: string) => void;
  setIsFilterOpen: (value: boolean) => void;
}

interface MunicipalityFilterProps {
  setIsFilterOpen: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleMunicipalitySelection: (place: string) => void;
  resetFilters: () => void;
  selectedMunicipalities: string[];
}

interface SectorFilterProps {
  sectors: Sector[];
  selectedSector: string[]; // always an array
  handleSectorChange: (sectors: string[]) => void;
}

export function FilterSection({
  setSort,
  setIsFilterOpen,
}: FilterSectionProps) {
  return (
    <div className="mt-4 flex w-full gap-4 sm:mt-0 sm:w-auto">
      <Select onValueChange={setSort} defaultValue="a-z">
        <SelectTrigger className="w-full bg-white text-[#8B4513] hover:bg-[#bb987a] hover:text-[#ffffff] active:bg-[#bb987a] active:text-[#ffffff] sm:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem
            value="a-z"
            className="hover:bg-[#bb987a] hover:text-[#ffffff] active:bg-[#bb987a] active:text-[#ffffff]"
          >
            A-Z
          </SelectItem>
          <SelectItem
            value="z-a"
            className="hover:bg-[#bb987a] hover:text-[#ffffff] active:bg-[#bb987a] active:text-[#ffffff]"
          >
            Z-A
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={() => setIsFilterOpen(true)}
        variant="outline"
        className="hover:bg-[#bb987a] hover:text-[#ffffff] active:bg-[#bb987a] active:text-[#ffffff]"
      >
        <Filter className="mr-2" /> Filter
      </Button>
    </div>
  );
}

export function MunicipalityFilter({
  setIsFilterOpen,
  searchQuery,
  setSearchQuery,
  handleMunicipalitySelection,
  resetFilters,
  selectedMunicipalities,
}: MunicipalityFilterProps) {
  return (
    <div className="flex h-full w-96 flex-col overflow-y-auto border border-[#996439] bg-[#f9f8f4] p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between border-b border-[#996439] bg-[#f9f8f4] pb-2">
        <h2 className="text-lg font-semibold text-[#996439]">
          Filter by Municipality
        </h2>
        <Button
          onClick={() => setIsFilterOpen(false)}
          variant="ghost"
          className="hover:bg-[#bb987a] hover:text-[#ffffff] active:bg-[#bb987a] active:text-[#ffffff]"
        >
          <X className="h-5 w-5 text-[#996439]" />
        </Button>
      </div>
      <Input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 rounded-md border border-gray-300 p-2"
      />
      <div className="flex-1 overflow-y-auto">
        {Object.entries(municipalities).map(([district, places]) => (
          <div key={district} className="mb-4">
            <h3 className="mb-2 border-b pb-1 text-sm font-semibold text-[#996439]">
              {district}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {places
                .filter((place) =>
                  place.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((place) => (
                  <Button
                    key={place}
                    onClick={() => handleMunicipalitySelection(place)}
                    variant={
                      selectedMunicipalities.includes(place)
                        ? "default"
                        : "outline"
                    }
                    className={`w-full border-[#996439] bg-white text-[#171a1f] hover:bg-[#8B4513] ${
                      selectedMunicipalities.includes(place)
                        ? "bg-[#996439] text-white hover:bg-[#8B4513]"
                        : ""
                    }`}
                  >
                    {place}
                  </Button>
                ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={resetFilters}
        variant="outline"
        className="mt-4 w-full border-[#996439] bg-[#8B4513] text-[#ffffff] hover:bg-[#bb987a]"
      >
        Reset Filters
      </Button>
    </div>
  );
}

interface SectorFilterProps {
  sectors: Sector[];
  selectedSector: string[];
  handleSectorChange: (sectors: string[]) => void;
}

export function SectorFilter({
  sectors,
  selectedSector,
  handleSectorChange,
}: SectorFilterProps) {
  const toggleSector = (sectorName: string) => {
    if (sectorName === "All") {
      handleSectorChange([]);
      return;
    }
    if (selectedSector.includes(sectorName)) {
      handleSectorChange(selectedSector.filter((s) => s !== sectorName));
    } else {
      handleSectorChange([...selectedSector, sectorName]);
    }
  };

  return (
    <div>
      {sectors && (
        <div className="mx-auto w-full overflow-x-auto px-2 py-4 sm:px-6">
          {/* Dropdown for small screens */}
          <div className="block md:hidden">
            <Select
              value=""
              onValueChange={(value) => {
                if (value === "All") {
                  handleSectorChange([]);
                } else {
                  toggleSector(value);
                }
              }}
            >
              <SelectTrigger className="w-full bg-[#bb987a] text-[#ffffff] outline-[#bb987a] hover:bg-[#8B4513] focus:bg-[#8B4513]">
                <SelectValue>
                  {selectedSector.length === 0
                    ? "All"
                    : selectedSector.join(", ")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <div className="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-[#8B4513] hover:text-white">
                  <Checkbox
                    checked={selectedSector.length === 0}
                    className="mr-2"
                    onClick={() => handleSectorChange([])}
                  />
                  All
                </div>
                {sectors.map((sector) => {
                  const Icon = getSectorIcon(
                    sector.name,
                  ) as React.ComponentType;
                  const isSelected = selectedSector.includes(sector.name);
                  return (
                    <div
                      key={sector.id}
                      className={`flex cursor-pointer items-center gap-2 px-2 py-1 ${
                        isSelected
                          ? "bg-[#8B4513] text-white"
                          : "hover:bg-[#8B4513] hover:text-white"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="mr-2 border-white"
                        onClick={() => toggleSector(sector.name)}
                      />
                      {Icon && <Icon />}
                      {sector.name}
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Button grid for medium screens */}
          <div className="hidden w-full grid-cols-2 gap-2 md:grid lg:hidden xl:grid-cols-3">
            <div
              className={`flex w-full cursor-pointer items-center justify-start gap-2 rounded-md border border-[#bb987a] px-3 py-2 text-sm ${
                selectedSector.length === 0
                  ? "bg-[#8B4513] text-white"
                  : "bg-[#bb987a] text-[#ffffff] hover:bg-[#8B4513]"
              }`}
              onClick={() => handleSectorChange([])}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSectorChange([]);
                }
              }}
            >
              <span
                className={`mr-1 flex h-4 w-4 items-center justify-center rounded border ${
                  selectedSector.length === 0
                    ? "border-white bg-white"
                    : "border-[#bb987a]"
                }`}
              >
                {selectedSector.length === 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-[#8B4513]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              All
            </div>
            {sectors.map((sector) => {
              const Icon = getSectorIcon(sector.name) as React.ComponentType;
              const isSelected = selectedSector.includes(sector.name);
              return (
                <div
                  key={sector.id}
                  className={`flex w-full cursor-pointer items-center justify-start gap-2 rounded-md border border-[#bb987a] px-3 py-2 text-sm ${
                    isSelected
                      ? "bg-[#8B4513] text-white"
                      : "bg-[#bb987a] text-[#ffffff] hover:bg-[#8B4513]"
                  }`}
                  onClick={() => toggleSector(sector.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleSector(sector.name);
                    }
                  }}
                >
                  <span
                    className={`mr-1 flex h-4 w-4 items-center justify-center rounded border ${
                      isSelected ? "border-white bg-white" : "border-[#bb987a]"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-[#8B4513]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                  <Icon />
                  <span className="truncate">{sector.name}</span>
                </div>
              );
            })}
          </div>

          {/* Button row for large screens */}
          <div className="hidden w-full flex-wrap gap-2 pb-2 lg:flex xl:flex-nowrap xl:gap-4">
            <div
              className={`min-w-fit flex-grow cursor-pointer rounded-md border border-[#bb987a] px-3 py-2 ${
                selectedSector.length === 0
                  ? "bg-[#8B4513] text-white"
                  : "bg-[#bb987a] text-[#ffffff] hover:bg-[#8B4513]"
              }`}
              onClick={() => handleSectorChange([])}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSectorChange([]);
                }
              }}
            >
              All
            </div>
            {sectors.map((sector) => {
              const Icon = getSectorIcon(sector.name) as React.ComponentType;
              const isSelected = selectedSector.includes(sector.name);
              return (
                <div
                  key={sector.id}
                  className={`flex min-w-fit flex-grow cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-[#bb987a] px-3 py-2 ${
                    isSelected
                      ? "bg-[#8B4513] text-white"
                      : "bg-[#bb987a] text-[#ffffff] hover:bg-[#8B4513]"
                  }`}
                  onClick={() => toggleSector(sector.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleSector(sector.name);
                    }
                  }}
                >
                  <span
                    className={`mr-2 flex h-4 w-4 items-center justify-center rounded border ${
                      isSelected ? "border-white bg-white" : "border-[#bb987a]"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-[#8B4513]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                  <Icon />
                  {sector.name}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

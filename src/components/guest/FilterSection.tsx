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
  selectedSector: string | null;
  handleSectorChange: (sector: string) => void;
}

export function FilterSection({
  setSort,
  setIsFilterOpen,
}: FilterSectionProps) {
  return (
    <div className="mt-4 flex w-full gap-4 sm:mt-0 sm:w-auto">
      <Select onValueChange={setSort}>
        <SelectTrigger className="w-full bg-white text-[#8B4513] hover:bg-[#bb987a] hover:text-[#ffffff] active:bg-[#bb987a] active:text-[#ffffff] sm:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem
            value="name"
            className="hover:bg-[#bb987a] hover:text-[#ffffff] active:bg-[#bb987a] active:text-[#ffffff]"
          >
            Name
          </SelectItem>
          <SelectItem
            value="sector"
            className="hover:bg-[#bb987a] hover:text-[#ffffff] active:bg-[#bb987a] active:text-[#ffffff]"
          >
            Sector
          </SelectItem>
          <SelectItem
            value="municipality"
            className="hover:bg-[#bb987a] hover:text-[#ffffff] active:bg-[#bb987a] active:text-[#ffffff]"
          >
            Municipality
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

export function SectorFilter({
  sectors,
  selectedSector,
  handleSectorChange,
}: SectorFilterProps) {
  return (
    <div className="mx-auto w-full overflow-x-auto px-6 py-4">
      <div className="flex w-full justify-between gap-4 pb-2">
        <Button
          variant={selectedSector === null ? "secondary" : "outline"}
          className="min-w-fit flex-grow bg-[#bb987a] text-[#ffffff] outline-[#bb987a] hover:bg-[#8B4513] focus:bg-[#8B4513]"
          onClick={() => handleSectorChange("All")}
        >
          All
        </Button>
        {sectors.slice(0).map((sector) => (
          <Button
            key={sector.id}
            variant={selectedSector === sector.name ? "secondary" : "outline"}
            className="min-w-fit flex-grow whitespace-nowrap bg-[#bb987a] text-[#ffffff] outline-[#bb987a] hover:bg-[#8B4513] focus:bg-[#8B4513]"
            onClick={() => handleSectorChange(sector.name)}
          >
            {sector.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

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
import {
  Leaf,
  Wheat,
  Palmtree,
  Coffee as CoffeeIcon,
  UtensilsCrossed,
  ShoppingBag,
  MonitorSmartphone,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  // Map sectors to icons
  const sectorIcons: Record<string, React.ReactNode> = {
    Bamboo: <Leaf className="mr-2 inline-block h-4 w-4 align-text-bottom" />,
    Cacao: <Wheat className="mr-2 inline-block h-4 w-4 align-text-bottom" />,
    Coconut: (
      <Palmtree className="mr-2 inline-block h-4 w-4 align-text-bottom" />
    ),
    Coffee: (
      <CoffeeIcon className="mr-2 inline-block h-4 w-4 align-text-bottom" />
    ),
    "Processed Foods": (
      <UtensilsCrossed className="mr-2 inline-block h-4 w-4 align-text-bottom" />
    ),
    "Wearables and Homestyles": (
      <ShoppingBag className="mr-2 inline-block h-4 w-4 align-text-bottom" />
    ),
    "IT-BPM": (
      <MonitorSmartphone className="mr-2 inline-block h-4 w-4 align-text-bottom" />
    ),
  };

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
              {selectedSector.length === 0 ? "All" : selectedSector.join(", ")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white">
            <div
              className="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-[#8B4513] hover:text-white"
              onClick={() => handleSectorChange([])}
            >
              <Checkbox
                checked={selectedSector.length === 0}
                className="mr-2"
              />
              All
            </div>
            {sectors.map((sector) => (
              <div
                key={sector.id}
                className="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-[#8B4513] hover:text-white"
                onClick={() => toggleSector(sector.name)}
              >
                <Checkbox
                  checked={selectedSector.includes(sector.name)}
                  className="mr-2"
                />
                {sectorIcons[sector.name] ?? null}
                {sector.name}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Button grid for medium screens */}
      <div className="hidden w-full grid-cols-2 gap-2 md:grid lg:hidden xl:grid-cols-3">
        <Button
          variant={selectedSector.length === 0 ? "secondary" : "outline"}
          className="flex w-full items-center justify-start gap-2 bg-[#bb987a] text-sm text-[#ffffff] outline-[#bb987a] hover:bg-[#8B4513] focus:bg-[#8B4513]"
          onClick={() => handleSectorChange([])}
        >
          All
        </Button>
        {sectors.map((sector) => (
          <Button
            key={sector.id}
            variant={
              selectedSector.includes(sector.name) ? "secondary" : "outline"
            }
            className="flex w-full items-center justify-start gap-2 bg-[#bb987a] text-sm text-[#ffffff] outline-[#bb987a] hover:bg-[#8B4513] focus:bg-[#8B4513]"
            onClick={() => toggleSector(sector.name)}
          >
            <Checkbox
              checked={selectedSector.includes(sector.name)}
              className="mr-1"
            />
            {sectorIcons[sector.name] ?? null}
            <span className="truncate">{sector.name}</span>
          </Button>
        ))}
      </div>

      {/* Button row for large screens */}
      <div className="hidden w-full flex-wrap gap-2 pb-2 lg:flex xl:flex-nowrap xl:gap-4">
        <Button
          variant={selectedSector.length === 0 ? "secondary" : "outline"}
          className="min-w-fit flex-grow bg-[#bb987a] text-[#ffffff] outline-[#bb987a] hover:bg-[#8B4513] focus:bg-[#8B4513]"
          onClick={() => handleSectorChange([])}
        >
          All
        </Button>
        {sectors.map((sector) => (
          <Button
            key={sector.id}
            variant={
              selectedSector.includes(sector.name) ? "secondary" : "outline"
            }
            className="flex min-w-fit flex-grow items-center gap-2 whitespace-nowrap bg-[#bb987a] text-[#ffffff] outline-[#bb987a] hover:bg-[#8B4513] focus:bg-[#8B4513]"
            onClick={() => toggleSector(sector.name)}
          >
            <Checkbox
              checked={selectedSector.includes(sector.name)}
              className="mr-2"
            />
            {sectorIcons[sector.name] ?? null}
            {sector.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

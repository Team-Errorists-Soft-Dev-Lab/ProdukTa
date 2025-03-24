"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MSMECardView } from "@/components/admin/exportCardView";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { Download, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ILOILO_LOCATIONS } from "@/lib/iloilo-locations";
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
import { Badge } from "@/components/ui/badge";

export default function ExportDataPage({
  params,
}: {
  params: { sectorName: string };
}) {
  const { msmes, sectors, isLoading } = useMSMEContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [selectedMSMEs, setSelectedMSMEs] = useState<number[]>([]);
  const [startYear, setStartYear] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const { sectorName } = params;
  const sector = sectors.find(
    (sector) =>
      sector.name.toLowerCase().replace(/\s+/g, "") ===
      sectorName.toLowerCase(),
  );

  const filteredMSMEs = msmes
    .filter(
      (msme) =>
        msme.sectorId === sector?.id &&
        msme.companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!startYear ||
          Number.parseInt(msme.yearEstablished.toString()) >=
            Number.parseInt(startYear)) &&
        (!endYear ||
          Number.parseInt(msme.yearEstablished.toString()) <=
            Number.parseInt(endYear)) &&
        (locationFilters.length === 0 ||
          locationFilters.includes(msme.cityMunicipalityAddress)),
    )
    .sort(
      (a, b) =>
        Number.parseInt(b.yearEstablished.toString()) -
        Number.parseInt(a.yearEstablished.toString()),
    );

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);

  const currentMSMEs = filteredMSMEs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getSectorName = (id: number) => {
    return sectors.find((sector) => sector.id === id)?.name ?? "Unknown Sector";
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMSMEs(currentMSMEs.map((msme) => msme.id));
      setSelectedId(currentMSMEs.map((msme) => msme.id));
    } else {
      setSelectedMSMEs([]);
    }
  };

  const handleSelectMSME = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedMSMEs([...selectedMSMEs, id]);
      setSelectedId([...selectedId, id]);
    } else {
      setSelectedMSMEs(selectedMSMEs.filter((msmeId) => msmeId !== id));
    }
  };

  const resetAllFilters = () => {
    setStartYear("");
    setEndYear("");
    setLocationFilters([]);
    setSearchTerm("");
  };

  const toggleLocation = (location: string) => {
    setLocationFilters((current) =>
      current.includes(location)
        ? current.filter((l) => l !== location)
        : [...current, location],
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, filteredMSMEs]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-[#996439]">
          {sectorName.toLocaleUpperCase()} MSME
        </h1>
        <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
          <Link
            href={{
              pathname: "/admin/pdf-export",
              query: { selectedId: JSON.stringify(selectedId) },
            }}
          >
            <Button className="w-full bg-[#996439] font-bold hover:bg-[#ce9261] sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> Export Data
              <span className="ml-2 text-xl font-bold text-white">
                [{selectedMSMEs.length}]
              </span>
            </Button>
          </Link>
          <Button
            className="w-full bg-[#996439] font-bold hover:bg-[#ce9261] sm:w-auto"
            onClick={() => {
              setCurrentPage(1);
              setItemsPerPage(itemsPerPage === 3 ? 99999999 : 3);
            }}
          >
            {itemsPerPage === 3 ? "Display All" : "Display Less"}
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <p className="text-lg text-[#996439]">
            Total Registered MSMEs:{" "}
            <span className="font-bold">{filteredMSMEs.length}</span>
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="selectAll"
              checked={selectedMSMEs.length === currentMSMEs.length}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            />
            <label
              htmlFor="selectAll"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select All
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            type="text"
            placeholder="Search MSMEs..."
            className="w-full sm:w-48"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-[#996439] sm:w-[200px]"
              >
                {locationFilters.length > 0 ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {locationFilters.length} selected
                  </>
                ) : (
                  "Filter locations..."
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandList>
                  <CommandEmpty>No locations found.</CommandEmpty>
                  <CommandGroup>
                    {ILOILO_LOCATIONS.map((location) => (
                      <CommandItem
                        key={location.name}
                        onSelect={() => toggleLocation(location.name)}
                      >
                        <Checkbox
                          checked={locationFilters.includes(location.name)}
                          className="mr-2"
                        />
                        {location.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Start Year"
              className="w-full sm:w-28"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              min="1900"
              max={new Date().getFullYear().toString()}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="End Year"
              className="w-full sm:w-28"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              min="1900"
              max={new Date().getFullYear().toString()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={resetAllFilters}
              className="w-13 font-weight-bold h-10 hover:bg-[#996439]"
            >
              Reset filters
            </Button>
          </div>
        </div>
      </div>
      {locationFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {locationFilters.map((location) => (
            <Badge
              key={location}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleLocation(location)}
            >
              {location}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
      <MSMECardView
        msmes={currentMSMEs}
        isLoading={isLoading}
        getSectorName={getSectorName}
        selectedMSMEs={selectedMSMEs}
        onSelectMSME={handleSelectMSME}
      />
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : ""
                  }
                >
                  {page}
                </Button>
              ),
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

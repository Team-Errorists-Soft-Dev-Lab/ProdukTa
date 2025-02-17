"use client";

// import { msmeLines, sectors } from "mock_data/dummyData";
import type { MSME } from "@/types/MSME";
import { useState, useMemo } from "react";
import MSMEModal from "@/components/modals/MSMEModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMSMEContext } from "@/contexts/MSMEContext";

import { Search, ArrowRight, X, Filter } from "lucide-react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const itemsPerPage = 15;

interface MSMEWithSectorNames extends MSME {
  sectorName: string;
}

const municipalities = {
  "1st District": [
    "Guimbal",
    "Igbaras",
    "Miagao",
    "Oton",
    "San Joaquin",
    "Tigbauan",
    "Tubungan",
  ],
  "2nd District": [
    "Alimodian",
    "Leganes",
    "Leon",
    "New Lucena",
    "Pavia",
    "San Miguel",
    "Santa Barbara",
    "Zarraga",
  ],
  "3rd District": [
    "Badiangan",
    "Bingawan",
    "Cabatuan",
    "Calinog",
    "Janiuay",
    "Lambunao",
    "Maasin",
    "Mina",
    "Pototan",
  ],
  "4th District": [
    "Anilao",
    "Banate",
    "Barotac Nuevo",
    "Dingle",
    "Dueñas",
    "Dumangas",
    "Passi",
    "San Enrique",
  ],
  "5th District": [
    "Ajuy",
    "Balasan",
    "Barotac Viejo",
    "Batad",
    "Carles",
    "Concepcion",
    "Estancia",
    "Lemery",
    "San Dionisio",
    "San Rafael",
    "Sara",
  ],
  "Iloilo City": [
    "Arevalo",
    "City Proper",
    "Jaro",
    "La Paz",
    "Lapuz",
    "Mandurriao",
    "Molo",
  ],
};

export default function GuestPage() {
  const { msmes, sectors, isLoading } = useMSMEContext();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<
    string[]
  >([]);
  const [sort, setSort] = useState<string>("name");
  const [searchResult, setSearchResult] = useState<MSME[]>(msmes);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // console.log("msmes: ", msmes);

  const msmesWithSectorNames = useMemo(() => {
    return msmes.map((msme) => ({
      ...msme,
      sectorName:
        sectors.find((sector) => sector.id === msme.sectorId)?.name ||
        "Unknown Sector",
    }));
  }, [msmes, sectors]);

  const searchMSME = (query: string) => {
    return msmesWithSectorNames.filter((msme) =>
      msme.companyName.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const sortMSMEs = (msmes: MSMEWithSectorNames[], sortType: string) => {
    switch (sortType) {
      case "name":
        return [...msmes].sort((a, b) =>
          (a.companyName || "").localeCompare(b.companyName || ""),
        );
      case "sector":
        return [...msmes].sort((a, b) =>
          (a.sectorName || "").localeCompare(b.sectorName || ""),
        );
      case "municipality":
        return [...msmes].sort((a, b) =>
          (a.cityMunicipalityAddress || "").localeCompare(
            b.cityMunicipalityAddress || "",
          ),
        );
      default:
        return msmes;
    }
  };

  const displayedMSME = useMemo(() => {
    let filtered = msmesWithSectorNames;

    if (selectedSector) {
      filtered = filtered.filter((msme) => msme.sectorName === selectedSector);
    }

    if (selectedMunicipalities.length > 0) {
      filtered = filtered.filter((msme) =>
        selectedMunicipalities.includes(msme.cityMunicipalityAddress),
      );
    }

    if (searchQuery) {
      filtered = searchMSME(searchQuery);
    }

    const sorted = sortMSMEs(filtered, sort);

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sorted.slice(startIndex, startIndex + itemsPerPage);
  }, [
    searchQuery,
    msmesWithSectorNames,
    sort,
    selectedSector,
    selectedMunicipalities,
    currentPage,
    msmes,
    sectors,
  ]);

  // console.log("displayedMSME: ", displayedMSME);

  const totalPages = Math.ceil(
    (searchQuery ? searchMSME(searchQuery) : msmesWithSectorNames).length /
      itemsPerPage,
  );

  const handleSortChange = (sortType: string) => {
    setSort(sortType);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSectorChange = (sector: string) => {
    if (sector === "All") {
      setSelectedSector(null);
    } else {
      setSelectedSector(sector);
    }
    setSearchQuery("");
    setSearchResult(msmes);
    setCurrentPage(1);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 2; // Show 2 pages on each side of current page

    // Helper function to add page number
    const addPageNumber = (pageNum: number) => {
      items.push(
        <PaginationItem key={pageNum}>
          <PaginationLink
            onClick={() => handlePageChange(pageNum)}
            isActive={currentPage === pageNum}
            className={cn(
              "min-w-9 rounded-md",
              currentPage === pageNum
                ? "bg-[#8B4513] text-white hover:bg-[#A0522D]"
                : "text-[#8B4513] hover:bg-[#8B4513]/10",
            )}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>,
      );
    };

    // Always show first page
    addPageNumber(1);

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      for (let i = 2; i <= totalPages; i++) {
        addPageNumber(i);
      }
    } else {
      if (currentPage <= 3) {
        // Near start
        for (let i = 2; i <= 4; i++) {
          addPageNumber(i);
        }
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis className="text-[#8B4513]" />
          </PaginationItem>,
        );
      } else if (currentPage >= totalPages - 2) {
        // Near end
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="text-[#8B4513]" />
          </PaginationItem>,
        );
        for (let i = totalPages - 3; i < totalPages; i++) {
          addPageNumber(i);
        }
      } else {
        // In middle
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="text-[#8B4513]" />
          </PaginationItem>,
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          addPageNumber(i);
        }
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis className="text-[#8B4513]" />
          </PaginationItem>,
        );
      }

      // Always show last page
      if (totalPages > 1) {
        addPageNumber(totalPages);
      }
    }

    return items;
  };

  const resetFilters = () => {
    setSelectedSector(null);
    setSelectedMunicipalities([]);
    setSearchQuery("");
    setSearchResult(msmes);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleMunicipalitySelection = (municipality: string) => {
    setSelectedMunicipalities((prev) =>
      prev.includes(municipality)
        ? prev.filter((item) => item !== municipality)
        : [...prev, municipality],
    );
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-[#8B4513] p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-center text-4xl font-bold text-white">
            Discover Local MSMEs
          </h1>
          <p className="mb-8 text-center text-lg text-white">
            A curated collection of the best local micro, small, and medium
            enterprises. Support local businesses hand-picked for you.
          </p>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative w-full flex-1 sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
              <Input
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search MSMEs..."
                className="w-full bg-white pl-10 text-[#8B4513]"
              />
            </div>
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
          </div>
        </div>
      </main>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
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
        </div>
      )}

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

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedMSME.length > 0 ? (
            displayedMSME.map((msme) => (
              <Dialog key={msme.id}>
                <DialogTrigger asChild>
                  <Card className="flex min-h-[400px] cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-md">
                    <CardHeader className="relative p-0">
                      <div className="relative h-48 w-full">
                        <Image
                          src={msme.productGallery?.[0] ?? "/placeholder.jpg"}
                          alt={msme.companyName}
                          fill
                          className="object-cover"
                        />
                        {msme.companyLogo && (
                          <div className="absolute -bottom-6 left-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white shadow-lg">
                            <Image
                              src={msme.companyLogo}
                              alt={`${msme.companyName} logo`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col pt-8">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-[#8B4513]">
                            {msme.companyName}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {msme.sectorName}
                          </Badge>
                        </div>
                        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                          {msme.companyDescription}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between text-sm">
                        <span className="max-w-[150px] truncate text-gray-500">
                          {msme.cityMunicipalityAddress}
                        </span>
                        <Button
                          variant="link"
                          className="h-auto p-0 font-normal text-[#8B4513]"
                        >
                          View Details
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <MSMEModal MSME={msme} sectorName={msme.sectorName} />
              </Dialog>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              No results found
            </p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={cn(
                      "rounded-md border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10",
                      currentPage === 1 && "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={cn(
                      "rounded-md border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10",
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useCallback } from "react";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { Spinner } from "@/components/ui/spinner";
import SearchSection from "@/components/guest/SearchSection";
import {
  FilterSection,
  MunicipalityFilter,
  SectorFilter,
} from "@/components/guest/FilterSection";
import MSMEList from "@/components/guest/MSMEList";
import GuestPagePagination from "./GuestPagePagination";
import type { MSMEWithSectorName } from "@/types/MSME";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GuestPage() {
  const {
    pagedMSMEs,
    searchMSMEs,
    searchMSMEsDebounced,
    isSearching,
    fetchMSMEsBySector,
    isChangingPage,
    isChangingSector,
    totalPages,
    sectors,
    isLoading,
    fetchPagedMSMEs,
  } = useMSMEContext();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<
    string[]
  >([]);
  const [sort, setSort] = useState<string>("name");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const msmesWithSectorNames = useMemo(() => {
    return (pagedMSMEs || []).map((msme) => ({
      ...msme,
      sectorName:
        sectors.find((sector) => sector.id === msme.sectorId)?.name ??
        "Unknown Sector",
    }));
  }, [pagedMSMEs, sectors]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (query.trim() === "") {
        setSearchActive(false);
        await fetchPagedMSMEs(1);
        return;
      }

      if (query.length < 2) {
        toast.error("Search term must be at least 2 characters long", {
          duration: 3000,
          description: "Please enter a longer search term.",
        });
        return;
      }

      setSearchActive(true);
      try {
        await searchMSMEs(query);
      } catch (error) {
        console.error("Error during searchMSMEs: ", error);
      }
    },
    [searchMSMEs, fetchPagedMSMEs],
  );

  const handleInputChange = useCallback(
    (query: string) => {
      if (query && query.trim().length >= 2) {
        setSearchActive(true);
      } else if (!query || query.trim() === "") {
        setSearchActive(false);
      }
      searchMSMEsDebounced(query);
    },
    [searchMSMEsDebounced],
  );

  const sortMSMEs = (msmes: MSMEWithSectorName[], sortType: string) => {
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

    return sortMSMEs(filtered, sort);
  }, [msmesWithSectorNames, sort, selectedSector, selectedMunicipalities]);

  const handlePageChange = useCallback(
    async (page: number) => {
      if (selectedSector !== null) {
        if (selectedSector) {
          await fetchMSMEsBySector(selectedSector, page);
          setCurrentPage(page);
          return;
        }
      } else {
        fetchPagedMSMEs(page)
          .then(() => {
            setCurrentPage(page);
          })
          .catch((error) => {
            console.error("Error fetching paged MSMEs:", error);
            toast.error("Failed to fetch paged MSMEs");
          });
      }
    },
    [selectedSector, fetchMSMEsBySector, fetchPagedMSMEs],
  );

  const handleSectorChange = useCallback(
    async (sector: string) => {
      if (sector === "All") {
        setSelectedSector(null);
        await fetchPagedMSMEs(1);
      } else {
        setSelectedSector(sector);
        setCurrentPage(1);
        await fetchMSMEsBySector(sector, 1);
      }
      setSearchQuery("");
      setSearchActive(false);
      if (searchQuery) {
        searchMSMEsDebounced("");
      }
    },
    [searchQuery, searchMSMEsDebounced, fetchMSMEsBySector, fetchPagedMSMEs],
  );

  const resetFilters = useCallback(async () => {
    setSelectedSector(null);
    setSelectedMunicipalities([]);
    setSearchQuery("");
    setSearchActive(false);
    setCurrentPage(1);
    await fetchPagedMSMEs(1);
    setIsFilterOpen(false);
  }, [fetchPagedMSMEs]);

  const handleMunicipalitySelection = useCallback((municipality: string) => {
    setSelectedMunicipalities((prev) =>
      prev.includes(municipality)
        ? prev.filter((item) => item !== municipality)
        : [...prev, municipality],
    );
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    void fetchPagedMSMEs(1);
  }, [fetchPagedMSMEs]);

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
      <main
        className={cn(
          "bg-[#8B4513] p-8 transition-all duration-300",
          searchActive ? "bg-opacity-90" : "bg-opacity-100",
        )}
      >
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-center text-4xl font-bold text-white">
            Discover Local MSMEs
          </h1>
          <p className="mb-8 text-center text-lg text-white">
            A curated collection of the best local micro, small, and medium
            enterprises. Support local businesses hand-picked for you.
          </p>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={() => void handleSearch(searchQuery)}
              isSearching={isSearching}
              handleInputChange={handleInputChange}
            />
            <FilterSection
              setSort={setSort}
              setIsFilterOpen={setIsFilterOpen}
            />
          </div>
        </div>
      </main>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
          <MunicipalityFilter
            setIsFilterOpen={setIsFilterOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleMunicipalitySelection={handleMunicipalitySelection}
            resetFilters={resetFilters}
            selectedMunicipalities={selectedMunicipalities}
          />
        </div>
      )}

      <SectorFilter
        sectors={sectors}
        selectedSector={selectedSector}
        handleSectorChange={handleSectorChange}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {displayedMSME.length === 0 &&
          !isSearching &&
          !isChangingPage &&
          !isChangingSector &&
          searchActive && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="mb-2 text-xl font-semibold text-gray-800">
                No MSMEs found
              </p>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Reset All Filters
              </button>
            </div>
          )}

        {isSearching || isChangingPage || isChangingSector ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
            <p className="text-lg font-medium text-amber-800">
              {isSearching ? "Searching MSMEs..." : "Loading MSMEs..."}
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "transition-opacity duration-300",
              displayedMSME.length === 0 ? "opacity-0" : "opacity-100",
            )}
          >
            <MSMEList msmes={displayedMSME} />
          </div>
        )}

        {totalPages > 1 && !searchActive && (
          <GuestPagePagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

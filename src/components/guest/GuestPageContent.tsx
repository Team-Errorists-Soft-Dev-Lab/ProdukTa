"use client";

import { useEffect, useCallback, useState, useMemo } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Spinner } from "@/components/ui/spinner";
import SearchSection from "@/components/guest/SearchSection";
import {
  FilterSection,
  MunicipalityFilter,
  SectorFilter,
} from "@/components/guest/FilterSection";
import MSMEList from "@/components/guest/MSMEList";
import GuestPagePagination from "./GuestPagePagination";

import { useMSMEContext } from "@/contexts/MSMEContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Loader2, Search } from "lucide-react";

import type { Sector } from "@/types/sector";
import type { MSME } from "@/types/MSME";

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
  const [municipalitySearchQuery, setMunicipalitySearchQuery] =
    useState<string>("");

  const msmesWithSectorNames = useMemo(() => {
    return (pagedMSMEs || []).map((msme: MSME) => ({
      ...msme,
      sectorName:
        sectors.find((sector: Sector) => sector.id === msme.sectorId)?.name ??
        "Unknown Sector",
    }));
  }, [pagedMSMEs, sectors]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (query.trim() === "") {
        setCurrentPage(1);
        if (selectedSector) {
          await fetchMSMEsBySector(
            selectedSector,
            1,
            sort === "z-a",
            selectedMunicipalities,
          );
        } else {
          await fetchPagedMSMEs(1);
        }
        setCurrentPage(1); // <-- Always reset after fetch
        setSearchActive(false);
        return;
      }

      if (query.length < 2) {
        toast.error("Search term must be at least 2 characters long", {
          duration: 3000,
          description: "Please enter a longer search term.",
        });
        return;
      }

      setCurrentPage(1);
      setSearchActive(true);
      try {
        await searchMSMEs(query);
      } catch (error) {
        console.error("Error during search:", error);
        toast.error("Search failed. Please try again.");
      }
    },
    [
      searchMSMEs,
      fetchPagedMSMEs,
      fetchMSMEsBySector,
      selectedSector,
      selectedMunicipalities,
      sort,
    ],
  );

  const handleInputChange = useCallback(
    (query: string) => {
      setCurrentPage(1);
      if (query && query.trim().length >= 2) {
        setSearchActive(true);
      } else if (!query || query.trim() === "") {
        setCurrentPage(1);
        setSearchActive(false);
      }

      if (selectedSector) {
        searchMSMEsDebounced(
          query,
          sort === "z-a",
          selectedMunicipalities,
          selectedSector,
        );
      } else {
        searchMSMEsDebounced(query, sort === "z-a", selectedMunicipalities);
      }
    },
    [searchMSMEsDebounced, sort, selectedMunicipalities, selectedSector],
  );

  const sortMSMEs = useCallback(
    async (order: string) => {
      setSort(order);

      try {
        const isDescending = order === "z-a"; // Determine if sorting is descending

        if (selectedSector) {
          // Fetch MSMEs by sector with the current sort order
          await fetchMSMEsBySector(
            selectedSector,
            1,
            isDescending,
            selectedMunicipalities,
          );
        } else {
          // Fetch all paged MSMEs with the current sort order
          await fetchPagedMSMEs(1, isDescending, selectedMunicipalities);
        }

        setCurrentPage(1); // Reset to the first page
      } catch (error) {
        console.error("Error sorting MSMEs:", error);
        toast.error("Failed to sort MSMEs. Please try again.");
      }
    },
    [
      fetchPagedMSMEs,
      fetchMSMEsBySector,
      selectedSector,
      selectedMunicipalities,
    ],
  );

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

    return filtered;
  }, [msmesWithSectorNames, selectedSector, selectedMunicipalities]);

  useEffect(() => {
    void sortMSMEs(sort);
  }, [sort, sortMSMEs]);

  const handlePageChange = useCallback(
    async (page: number) => {
      setCurrentPage(page);
      if (selectedSector !== null) {
        if (selectedSector) {
          await fetchMSMEsBySector(
            selectedSector,
            page,
            sort === "z-a",
            selectedMunicipalities,
          );
          return;
        }
      } else {
        void fetchPagedMSMEs(page, sort === "z-a", selectedMunicipalities);
      }
    },
    [
      fetchPagedMSMEs,
      fetchMSMEsBySector,
      sort,
      selectedMunicipalities,
      selectedSector,
    ],
  );

  const resetFilters = useCallback(async () => {
    // setSelectedSector(null);
    setSelectedMunicipalities([]);
    setMunicipalitySearchQuery("");
    setSearchActive(false);
    setCurrentPage(1);
    if (selectedSector) {
      await fetchMSMEsBySector(selectedSector, 1);
    } else {
      await fetchPagedMSMEs(1);
    }
    setIsFilterOpen(false);
  }, [fetchPagedMSMEs, fetchMSMEsBySector, selectedSector]);

  const handleSectorChange = useCallback(
    async (sector: string) => {
      if (sector === "All") {
        setSelectedSector(null);
        setCurrentPage(1);
        await fetchPagedMSMEs(1);
      } else {
        setSelectedSector(sector);
        setCurrentPage(1);
        await fetchMSMEsBySector(
          sector,
          1,
          sort === "z-a",
          selectedMunicipalities,
        );
      }
      setSearchQuery("");
      setSearchActive(false);
      if (searchQuery) {
        searchMSMEsDebounced("");
      }
    },
    [
      searchQuery,
      searchMSMEsDebounced,
      fetchMSMEsBySector,
      fetchPagedMSMEs,
      sort,
      selectedMunicipalities,
    ],
  );

  const handleMunicipalitySelection = useCallback(
    async (municipality: string) => {
      setSelectedMunicipalities((prev) => {
        const updated = prev.includes(municipality)
          ? prev.filter((item) => item !== municipality)
          : [...prev, municipality];

        // Re-fetch MSMEs with the updated municipalities filter
        const isDescending = sort === "z-a";
        if (selectedSector) {
          void fetchMSMEsBySector(selectedSector, 1, isDescending, updated);
        } else {
          void fetchPagedMSMEs(1, isDescending, updated);
        }
        setCurrentPage(1);
        return updated;
      });
    },
    [fetchPagedMSMEs, fetchMSMEsBySector, selectedSector, sort],
  );

  useEffect(() => {
    void fetchPagedMSMEs(1);
  }, [fetchPagedMSMEs]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white p-8 shadow-lg">
          <Spinner className="h-12 w-12 text-amber-600" />
          <p className="mt-4 text-center font-medium text-amber-800">
            Loading MSME details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <main
        className={cn(
          "bg-gradient-to-b from-[#8B4513] to-amber-700 p-8 shadow-md transition-all duration-300",
          searchActive ? "bg-opacity-90" : "bg-opacity-100",
        )}
      >
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-center text-4xl font-bold text-white drop-shadow-md">
            Discover Local MSMEs
          </h1>
          <div className="mx-auto mb-8 h-1 w-24 rounded bg-amber-300"></div>
          <p className="mb-10 text-center text-lg text-amber-100">
            A curated collection of the best local micro, small, and medium
            enterprises. Support local businesses hand-picked for you.
          </p>

          <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-white/10 p-6 backdrop-blur-sm sm:flex-row">
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
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
          <MunicipalityFilter
            setIsFilterOpen={setIsFilterOpen}
            searchQuery={municipalitySearchQuery}
            setSearchQuery={setMunicipalitySearchQuery}
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

      <div className="mx-auto py-6">
        {displayedMSME.length === 0 &&
          !isSearching &&
          !isChangingPage &&
          !isChangingSector &&
          searchActive && (
            <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 py-16 text-center shadow-md">
              <div className="mb-4 rounded-full bg-amber-100 p-4">
                <Search className="h-10 w-10 text-amber-600" />
              </div>
              <p className="mb-2 text-2xl font-semibold text-gray-800">
                No MSMEs found
              </p>
              <p className="mb-6 text-gray-600">
                Try adjusting your search or filters
              </p>
              <button
                onClick={resetFilters}
                className="rounded-md bg-amber-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-amber-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Reset All Filters
              </button>
            </div>
          )}

        {isSearching || isChangingPage || isChangingSector ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-white p-12 py-16 shadow-md">
            <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
            <p className="mt-4 text-xl font-medium text-amber-800">
              {isSearching ? "Searching MSMEs..." : "Loading MSMEs..."}
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "transition-all duration-500",
              displayedMSME.length === 0 ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="rounded-xl bg-white p-6 shadow-md">
              <MSMEList msmes={displayedMSME} />
            </div>
          </div>
        )}

        {totalPages > 1 && !searchActive && (
          <div className="mt-8">
            <GuestPagePagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

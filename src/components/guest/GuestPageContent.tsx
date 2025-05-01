"use client";

import { useEffect } from "react";
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

export default function GuestPage() {
  const {
    pagedMSMEs,
    searchMSMEs,
    isSearching,
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
  const [searchResults, setSearchResults] = useState<MSMEWithSectorName[]>([]);

  const msmesWithSectorNames = useMemo(() => {
    return (pagedMSMEs || []).map((msme) => ({
      ...msme,
      sectorName:
        sectors.find((sector) => sector.id === msme.sectorId)?.name ??
        "Unknown Sector",
    }));
  }, [pagedMSMEs, sectors]);

  const handleSearch = async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
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

    try {
      const results = (await searchMSMEs(
        query,
      )) as unknown as MSMEWithSectorName[];

      setSearchResults(
        (results ?? []).map((msme) => ({
          ...msme,
          sectorName:
            sectors.find((sector) => sector.id === msme.sectorId)?.name ??
            "Unknown Sector",
        })),
      );
    } catch (error) {
      console.error("Error during searchMSMEs: ", error);
      setSearchResults([]); // Handle errors gracefully
    }
  };

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
    // If we have search results, use those
    if (searchResults.length > 0) {
      let filtered = searchResults;

      if (selectedSector) {
        filtered = filtered.filter(
          (msme) => msme.sectorName === selectedSector,
        );
      }

      if (selectedMunicipalities.length > 0) {
        filtered = filtered.filter((msme) =>
          selectedMunicipalities.includes(msme.cityMunicipalityAddress),
        );
      }

      return sortMSMEs(filtered, sort);
    }

    // Otherwise use the paged data
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
  }, [
    msmesWithSectorNames,
    sort,
    selectedSector,
    selectedMunicipalities,
    searchResults,
  ]);

  const handlePageChange = (page: number) => {
    fetchPagedMSMEs(page)
      .then(() => {
        setCurrentPage(page);
        setSearchResults([]);
      })
      .catch((error) => {
        console.error("Error fetching paged MSMEs:", error);
        toast.error("Failed to fetch paged MSMEs");
      });
  };

  const handleSectorChange = async (sector: string) => {
    if (sector === "All") {
      setSelectedSector(null);
    } else {
      setSelectedSector(sector);
    }
    setSearchQuery("");
    setSearchResults([]);
    setCurrentPage(1);
    await fetchPagedMSMEs(1);
  };

  const resetFilters = async () => {
    setSelectedSector(null);
    setSelectedMunicipalities([]);
    setSearchQuery("");
    setSearchResults([]);
    setCurrentPage(1);
    await fetchPagedMSMEs(1);
    setIsFilterOpen(false);
  };

  const handleMunicipalitySelection = (municipality: string) => {
    setSelectedMunicipalities((prev) =>
      prev.includes(municipality)
        ? prev.filter((item) => item !== municipality)
        : [...prev, municipality],
    );
    setCurrentPage(1);
    setSearchResults([]);
  };

  useEffect(() => {
    void fetchPagedMSMEs(currentPage);
  }, [currentPage]);

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
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={() => void handleSearch(searchQuery)}
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
        {isSearching ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <MSMEList msmes={displayedMSME} />
        )}
        {searchResults.length === 0 && totalPages > 1 && (
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

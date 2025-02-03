"use client";

import { msmeLines, sectors } from "mock_data/dummyData";
import type { MSME } from "@/types/MSME";
import React, { useState, useMemo } from "react";
import MSMEModal from "@/components/modals/MSMEModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, ArrowRight } from "lucide-react";
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

interface LocalMSME {
  id: number;
  name: string;
  category: string;
  description: string;
  contactPerson: string;
  address: string;
  contactNumber: string;
  productGallery: string[];
  majorProductLines: never[];
}

const itemsPerPage = 15;

export default function GuestPage() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("name");
  const [searchResult, setSearchResult] = useState<LocalMSME[]>(msmeLines);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const searchMSME = (query: string) => {
    setSearchResult(
      msmeLines.filter((msme) =>
        msme.name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
    setCurrentPage(1);
  };

  const sortMSMEs = (MSMEs: LocalMSME[], sortType: string) => {
    switch (sortType) {
      case "name":
        return [...MSMEs].sort((a, b) => a.name.localeCompare(b.name));
      case "sector":
        return [...MSMEs].sort((a, b) => a.category.localeCompare(b.category));
      case "municipality":
        return [...MSMEs].sort((a, b) => a.address.localeCompare(b.address));
      default:
        return MSMEs;
    }
  };

  const filteredMSME = selectedSector
    ? msmeLines.filter((msme) => msme.category === selectedSector)
    : msmeLines;

  const displayedMSME = useMemo(() => {
    const sorted = searchQuery ? searchResult : sortMSMEs(filteredMSME, sort);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sorted.slice(startIndex, endIndex);
  }, [searchQuery, searchResult, filteredMSME, sort, currentPage]);

  const totalPages = Math.ceil(
    (searchQuery ? searchResult : filteredMSME).length / itemsPerPage,
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query) {
      searchMSME(query);
    } else {
      setSearchResult(msmeLines);
    }
    setCurrentPage(1);
  };

  const handleSectorChange = (sector: string) => {
    if (sector === "All") {
      setSelectedSector(null);
    } else {
      setSelectedSector(sector);
    }
    setSearchQuery("");
    setSearchResult(msmeLines);
    setCurrentPage(1);
  };

  const handleSortChange = (sortType: string) => {
    setSort(sortType);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                onChange={handleSearch}
                type="text"
                placeholder="Search MSMEs..."
                className="w-full bg-white pl-10 text-[#8B4513]"
              />
            </div>
            <div className="mt-4 flex w-full gap-4 sm:mt-0 sm:w-auto">
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="w-full bg-white text-[#8B4513] sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="sector">Sector</SelectItem>
                  <SelectItem value="municipality">Municipality</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={handleSectorChange}>
                <SelectTrigger className="w-full bg-white text-[#8B4513] sm:w-[180px]">
                  <SelectValue placeholder="All sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Sectors</SelectItem>
                  {sectors.slice(1).map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </main>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedMSME.length > 0 ? (
            displayedMSME.map((msme) => (
              <Dialog key={msme.id}>
                <DialogTrigger asChild>
                  <Card className="flex min-h-[400px] cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-md">
                    <CardHeader className="p-0">
                      <Image
                        src={msme.productGallery[0] ?? "/placeholder.png"}
                        alt={msme.name}
                        width={400}
                        height={200}
                        className="h-48 w-full object-cover"
                      />
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col p-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-[#8B4513]">
                            {msme.name}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {msme.category}
                          </Badge>
                        </div>
                        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                          {msme.description}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between text-sm">
                        <span className="max-w-[150px] truncate text-gray-500">
                          {msme.address}
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
                <MSMEModal MSME={msme} />
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

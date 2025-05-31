"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  bambooMSMEs,
  coconutMSMEs,
  coffeeMSMEs,
  weavingMSMEs,
  foodMSMEs,
} from "@/lib/mock-data";
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

const allMSMEs = [
  ...bambooMSMEs,
  ...coconutMSMEs,
  ...coffeeMSMEs,
  ...weavingMSMEs,
  ...foodMSMEs,
].map((msme) => ({
  ...msme,
  date: new Date(msme.date),
}));

export default function AllMSMEs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMSMEs, setSelectedMSMEs] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState(6); // State for items per page

  const filteredMSMEs = useMemo(() => {
    return allMSMEs.filter((msme) => {
      const matchesSearch = Object.values(msme).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      const matchesDateRange =
        (!startDate || msme.date >= new Date(startDate)) &&
        (!endDate || msme.date <= new Date(endDate));

      return matchesSearch && matchesDateRange;
    });
  }, [searchTerm, startDate, endDate]);

  const paginatedMSMEs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMSMEs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMSMEs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);

  const toggleMSMESelection = (id: number) => {
    setSelectedMSMEs((prev) =>
      prev.includes(id) ? prev.filter((eId) => eId !== id) : [...prev, id],
    );
  };

  const toggleAllMSMEs = () => {
    const currentPageIds = paginatedMSMEs.map((msme) => msme.id);
    const allSelected = currentPageIds.every((id) =>
      selectedMSMEs.includes(id),
    );

    if (allSelected) {
      setSelectedMSMEs((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
      setSelectedMSMEs((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const handleExportData = () => {
    allMSMEs.filter((msme) => selectedMSMEs.includes(msme.id));
  };

  const renderPaginationItems = () => {
    const items = [];

    // Helper function to add page number
    const addPageNumber = (pageNum: number) => {
      items.push(
        <PaginationItem key={pageNum}>
          <PaginationLink
            onClick={() => setCurrentPage(pageNum)}
            isActive={currentPage === pageNum}
            className={cn(
              "min-w-9 rounded-md",
              currentPage === pageNum
                ? "bg-[#996439] text-white hover:bg-[#bb987a]"
                : "text-[#996439] hover:bg-[#996439]/10",
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
            <PaginationEllipsis className="text-[#996439]" />
          </PaginationItem>,
        );
      } else if (currentPage >= totalPages - 2) {
        // Near end
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="text-[#996439]" />
          </PaginationItem>,
        );
        for (let i = totalPages - 3; i < totalPages; i++) {
          addPageNumber(i);
        }
      } else {
        // In middle
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="text-[#996439]" />
          </PaginationItem>,
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          addPageNumber(i);
        }
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis className="text-[#996439]" />
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
    <div className="flex min-h-screen flex-col bg-gray-100 lg:flex-row">
      <main className="flex-1 overflow-x-hidden bg-gray-100">
        <div className="p-4 md:p-6">
          <Card className="border-[#996439]">
            <div className="p-6">
              <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h1 className="text-2xl font-bold">All MSMEs</h1>
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                  <div className="relative flex-1 sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-8"
                    />
                  </div>
                  <Button
                    onClick={handleExportData}
                    className="bg-[#996439] text-white hover:bg-[#996439]/90"
                  >
                    Export Data ({selectedMSMEs.length})
                  </Button>
                </div>
              </div>
              <div className="mb-4 justify-items-end">
                <label className="block text-sm font-medium">
                  Items Per Page
                </label>
                <input
                  type="number"
                  value={itemsPerPage}
                  onChange={(e) => {
                    const value = Math.min(
                      30,
                      Math.max(1, Number(e.target.value)),
                    );
                    setItemsPerPage(value);
                  }}
                  className="rounded border p-2"
                  min="1"
                />
              </div>

              <div className="mb-4 flex space-x-4">
                <div>
                  <label className="block text-sm font-medium">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={paginatedMSMEs.every((msme) =>
                      selectedMSMEs.includes(msme.id),
                    )}
                    onCheckedChange={toggleAllMSMEs}
                  />
                  <span className="text-sm">Select All on This Page</span>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedMSMEs.map((msme) => (
                  <Card
                    key={msme.id}
                    className="border-[#996439] transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-lg font-semibold">{msme.name}</h3>
                        <Checkbox
                          checked={selectedMSMEs.includes(msme.id)}
                          onCheckedChange={() => toggleMSMESelection(msme.id)}
                        />
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-semibold">Location:</span>{" "}
                          {msme.address}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span> +63{" "}
                          {msme.contactNumber}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span>{" "}
                          {msme.date.toDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredMSMEs.length)}{" "}
                    of {filteredMSMEs.length} entries
                  </div>
                  <Pagination>
                    <PaginationContent className="gap-2">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          className={cn(
                            "rounded-md border-[#996439] text-[#996439] hover:bg-[#996439]/10",
                            currentPage === 1 &&
                              "pointer-events-none opacity-50",
                          )}
                        />
                      </PaginationItem>
                      {renderPaginationItems()}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1),
                            )
                          }
                          className={cn(
                            "rounded-md border-[#996439] text-[#996439] hover:bg-[#996439]/10",
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
          </Card>
        </div>
      </main>
    </div>
  );
}

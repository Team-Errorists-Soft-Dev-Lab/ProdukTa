"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  bambooMSMEs,
  coconutMSMEs,
  coffeeMSMEs,
  weavingMSMEs,
  foodMSMEs,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const ITEMS_PER_PAGE = 6;

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allMSMEs = useMemo(
    () => [
      ...bambooMSMEs,
      ...coconutMSMEs,
      ...coffeeMSMEs,
      ...weavingMSMEs,
      ...foodMSMEs,
    ],
    [],
  );

  const filteredMSMEs = useMemo(() => {
    return allMSMEs.filter(
      (msme) =>
        msme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msme.address.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, allMSMEs]);

  const totalPages = Math.ceil(filteredMSMEs.length / ITEMS_PER_PAGE);
  const paginatedMSMEs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMSMEs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMSMEs, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="border-[#996439]">
              <CardHeader>
                <CardTitle>Total Registered MSMEs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{allMSMEs.length}</p>
              </CardContent>
            </Card>
            <Card className="max-w-[200px] border-[#996439]">
              <CardHeader></CardHeader>
              <CardContent>
                <Link href="/admin/export-data">
                  <Button className="w-full max-w-[200px] bg-[#996439] text-white hover:bg-[#bb987a]">
                    Export Data
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[#996439]">
            <CardHeader>
              <CardTitle>List of Enterprises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center space-x-2">
                <Search className="text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search by name or location"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1"
                />
              </div>

              {paginatedMSMEs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedMSMEs.map((msme) => (
                    <Card key={msme.id} className="border-[#996439]">
                      <CardContent className="p-4">
                        <h3 className="mb-2 text-lg font-semibold">
                          {msme.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <strong>Location:</strong> {msme.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Email:</strong> {msme.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Phone:</strong> {msme.contactNumber}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No matching MSMEs found.
                </p>
              )}

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredMSMEs.length,
                    )}{" "}
                    of {filteredMSMEs.length} entries
                  </div>
                  <Pagination>
                    <PaginationContent className="gap-2">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
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
                            handlePageChange(
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

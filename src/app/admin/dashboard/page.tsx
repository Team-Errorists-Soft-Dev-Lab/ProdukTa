"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MSMECardView } from "@/components/admin/DashboardCardView";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
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

const sectorName = "coffee";

export default function MSMEPage() {
  const { msmes, sectors, isLoading } = useMSMEContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const sector = sectors.find(
    (sector) => sector.name.toLowerCase() === sectorName.toLocaleLowerCase(),
  );

  const filteredMSMEs = msmes.filter(
    (msme) =>
      msme.sectorId === sector?.id &&
      msme.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);

  const currentMSMEs = filteredMSMEs.filter((_, index) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return index >= startIndex && index < endIndex;
  });

  const getSectorName = (id: number) => {
    return sectors.find((sector) => sector.id === id)?.name ?? "Unknown Sector";
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {sectorName.toLocaleUpperCase()} MSME Dashboard
        </h1>
        <Link href="/admin/export-data">
          <Button>
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </Link>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-lg">
          Total Registered MSMEs:{" "}
          <span className="font-bold">{filteredMSMEs.length}</span>
        </p>
        <Input
          type="text"
          placeholder="Search MSMEs..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <MSMECardView
        msmes={currentMSMEs}
        isLoading={isLoading}
        getSectorName={getSectorName}
      />
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
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
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MSMECardView } from "@/components/admin/DashboardCardView";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { Download, Search } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    (sector) => sector.name.toLowerCase() === sectorName.toLowerCase(),
  );

  const filteredMSMEs = msmes.filter(
    (msme) =>
      msme.sectorId === sector?.id &&
      msme.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredMSMEs.length);
  const currentMSMEs = filteredMSMEs.slice(startIndex, endIndex);

  const getSectorName = (id: number) => {
    return sectors.find((sector) => sector.id === id)?.name ?? "Unknown Sector";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const edit = () => {
    // Edit functionality
  };

  const deleteMSME = () => {
    // Delete functionality
  };

  const renderPaginationItems = () => {
    const items = [];

    const addPageNumber = (pageNum: number) => {
      items.push(
        <PaginationItem key={pageNum}>
          <PaginationLink
            onClick={() => handlePageChange(pageNum)}
            isActive={currentPage === pageNum}
            className={cn(
              "h-9 min-w-9 rounded-md border border-input bg-background",
              currentPage === pageNum
                ? "border-[#996439] bg-[#996439] text-white hover:bg-[#bb987a] hover:text-white"
                : "text-[#996439] hover:border-[#996439] hover:bg-[#996439]/10",
            )}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>,
      );
    };

    addPageNumber(1);

    if (totalPages <= 5) {
      for (let i = 2; i <= totalPages; i++) {
        addPageNumber(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          addPageNumber(i);
        }
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis className="text-[#996439]" />
          </PaginationItem>,
        );
      } else if (currentPage >= totalPages - 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="text-[#996439]" />
          </PaginationItem>,
        );
        for (let i = totalPages - 3; i < totalPages; i++) {
          addPageNumber(i);
        }
      } else {
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

      if (totalPages > 1) {
        addPageNumber(totalPages);
      }
    }

    return items;
  };

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <Card className="border-2 border-[#996439]/20 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-[#996439]/10 pb-7">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-[#996439]">
              {sectorName.toUpperCase()} MSME Dashboard
            </CardTitle>
            <p className="text-lg text-gray-600">
              Total Registered MSMEs:{" "}
              <span className="font-bold text-[#996439]">
                {filteredMSMEs.length}
              </span>
            </p>
          </div>
          <Link href="/admin/export-data">
            <Button
              className="bg-[#996439] text-white shadow-sm transition-colors hover:bg-[#bb987a]"
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search MSMEs..."
              className="max-w-xs pl-10 focus-visible:ring-[#996439]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <MSMECardView
            onEdit={edit}
            onDelete={deleteMSME}
            msmes={currentMSMEs}
            isLoading={isLoading}
            getSectorName={getSectorName}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#996439]/10 pt-6">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium text-[#996439]">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-[#996439]">{endIndex}</span>{" "}
                of{" "}
                <span className="font-medium text-[#996439]">
                  {filteredMSMEs.length}
                </span>{" "}
                entries
              </div>
              <Pagination>
                <PaginationContent className="gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={cn(
                        "rounded-md border border-input bg-background text-[#996439] shadow-sm transition-colors hover:border-[#996439] hover:bg-[#996439]/10",
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
                        "rounded-md border border-input bg-background text-[#996439] shadow-sm transition-colors hover:border-[#996439] hover:bg-[#996439]/10",
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
  );
}

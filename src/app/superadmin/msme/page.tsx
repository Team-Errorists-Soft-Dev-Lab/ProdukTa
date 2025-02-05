"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Plus,
  Search,
  Building2,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMSMEContext } from "@/contexts/MSMEContext";
import AddMSMEModal from "@/components/modals/AddMSMEModal";
import EditMSMEModal from "@/components/modals/EditMSMEModal";
import type { MSME } from "@/types/superadmin";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MSMETableView } from "@/components/msme/MSMETableView";
import { MSMECardView } from "@/components/msme/MSMECardView";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type ViewMode = "card" | "table";

export default function ManageMSME() {
  const { msmes, sectors, handleDeleteMSME, isLoading } = useMSMEContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [isAddMSMEModalOpen, setIsAddMSMEModalOpen] = useState(false);
  const [isEditMSMEModalOpen, setIsEditMSMEModalOpen] = useState(false);
  const [currentMSME, setCurrentMSME] = useState<MSME | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  const filteredMSMEs = msmes.filter(
    (msme) =>
      msme.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msme.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msme.companyDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      msme.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedMSMEs = filteredMSMEs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredMSMEs.length);

  const handleEdit = (msme: MSME) => {
    setCurrentMSME(msme);
    setIsEditMSMEModalOpen(true);
  };

  const getSectorName = (sectorId: number) => {
    return sectors.find((s) => s.id === sectorId)?.name ?? "Unknown";
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 2; // Show 2 pages on each side of current page

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
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "text-emerald-600 hover:bg-emerald-50",
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
            <PaginationEllipsis className="text-emerald-600" />
          </PaginationItem>,
        );
      } else if (currentPage >= totalPages - 2) {
        // Near end
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="text-emerald-600" />
          </PaginationItem>,
        );
        for (let i = totalPages - 3; i < totalPages; i++) {
          addPageNumber(i);
        }
      } else {
        // In middle
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="text-emerald-600" />
          </PaginationItem>,
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          addPageNumber(i);
        }
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis className="text-emerald-600" />
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
    <div className="p-4 md:p-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Manage MSMEs
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-lg font-bold text-gray-600">
            Total: {msmes?.length ?? 0} MSMEs
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("card")}
                  className={cn(
                    "h-8 w-8",
                    viewMode === "card" &&
                      "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Card View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "h-8 w-8",
                    viewMode === "table" &&
                      "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                  )}
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Table View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            onClick={() => setIsAddMSMEModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add MSME
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="mb-4">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search MSMEs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 focus:ring-emerald-600"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {viewMode === "table" ? (
          <MSMETableView
            msmes={paginatedMSMEs}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteMSME}
            getSectorName={getSectorName}
          />
        ) : (
          <MSMECardView
            msmes={paginatedMSMEs}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteMSME}
            getSectorName={getSectorName}
          />
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex} to {endIndex} of {filteredMSMEs.length}{" "}
              entries
            </div>
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={cn(
                      "rounded-md border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600",
                      currentPage === 1 && "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={cn(
                      "rounded-md border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600",
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

      <AddMSMEModal
        isOpen={isAddMSMEModalOpen}
        onClose={() => setIsAddMSMEModalOpen(false)}
      />
      <EditMSMEModal
        isOpen={isEditMSMEModalOpen}
        onClose={() => setIsEditMSMEModalOpen(false)}
        msme={currentMSME}
      />
    </div>
  );
}

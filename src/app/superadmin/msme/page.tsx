"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  Download,
  X,
  Check,
  FileDown,
} from "lucide-react";
import { useMSMEContext } from "@/contexts/MSMEContext";
// import AddMSMEModal from "@/components/modals/AddMSMEModal";
// import EditMSMEModal from "@/components/modals/EditMSMEModal";
import type { MSME } from "@/types/MSME";
import { MSMETableView } from "@/components/msme/MSMETable";
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
import { MSMEFilters } from "@/components/msme/MSMEFilters";
import type { SortState, FilterState } from "@/types/table";
import { toast } from "sonner";
import { CSVLink } from "react-csv";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  csvHeaders,
  getSectorName as getSectorNameUtil,
  handleSort as handleSortUtil,
  getCsvData,
  filterMSMEs,
  sortMSMEs,
} from "@/lib/msme-utils";
// import type { MSMEWithProducts } from "@/lib/msme-utils";
import Link from "next/link";

export default function ManageMSME() {
  const router = useRouter();
  const { msmes, sectors, handleDeleteMSME, isLoading } = useMSMEContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  // const [isAddMSMEModalOpen, setIsAddMSMEModalOpen] = useState(false);
  // const [isEditMSMEModalOpen, setIsEditMSMEModalOpen] = useState(false);
  // const [currentMSME, setCurrentMSME] = useState<MSMEWithProducts | null>(null);
  const [sortState, setSortState] = useState<SortState>({
    column: "",
    direction: "default",
  });
  const [filters, setFilters] = useState<FilterState>({
    sectors: [],
    cities: [],
  });
  const [isExportMode, setIsExportMode] = useState(false);
  const [selectedMSMEs, setSelectedMSMEs] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const getSectorName = (sectorId: number) =>
    getSectorNameUtil(sectors, sectorId);

  const handleSort = (column: string) => {
    setSortState((prev) => handleSortUtil(prev, column));
  };

  const handleSelectMSME = (id: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedMSMEs((prev) => [...prev, id]);
    } else {
      setSelectedMSMEs((prev) => prev.filter((msmeId) => msmeId !== id));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    setSelectAll(isSelected);
    if (isSelected) {
      setSelectedMSMEs(filteredMSMEs.map((msme) => msme.id));
    } else {
      setSelectedMSMEs([]);
    }
  };

  const handleExportModeToggle = () => {
    setIsExportMode((prev) => !prev);
    if (isExportMode) {
      setSelectedMSMEs([]);
      setSelectAll(false);
    }
  };

  const handleEdit = (msme: MSME) => {
    // setCurrentMSME(msme as MSMEWithProducts);
    // setIsEditMSMEModalOpen(true);
    router.push(`/superadmin/msme/edit-msme/${msme.id}`);
  };

  const recordExport = async () => {
    try {
      for (const id of selectedMSMEs) {
        await fetch("/api/admin/export", {
          method: "POST",
          body: JSON.stringify({ msmeId: id }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Error recording export:", error);
    }
  };

  const filteredMSMEs = sortMSMEs(
    filterMSMEs(msmes, searchTerm, filters),
    sortState,
    getSectorName,
  );

  const paginatedMSMEs = filteredMSMEs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredMSMEs.length);

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
                ? "bg-emerald-600 text-white hover:bg-emerald-600"
                : "text-emerald-600 hover:bg-emerald-600",
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
    <div className="h-screen max-h-screen p-2 md:p-4 lg:p-6">
      <div className="flex h-full flex-col">
        <CardHeader className="flex-none flex-col space-y-2 px-0 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2">
              <Building2 className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
                Manage MSMEs
              </CardTitle>
              <CardDescription className="mt-1 text-sm font-bold text-gray-600 sm:text-base lg:text-lg">
                Total: {msmes?.length ?? 0} MSMEs
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-visible px-0">
          <div className="mb-4 flex-none">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-64">
                  <Input
                    type="text"
                    placeholder="Search MSMEs..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 focus-visible:outline-emerald-600"
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                </div>
                <MSMEFilters
                  sectors={sectors}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {isExportMode ? (
                  <>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <Badge
                        variant="outline"
                        className="h-8 border-2 border-emerald-600 bg-emerald-50 px-3 py-1.5"
                      >
                        <Check className="mr-1 h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span className="max-w-[120px] truncate text-sm font-medium text-emerald-700 sm:max-w-none">
                          {selectedMSMEs.length} MSMEs selected
                        </span>
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className={cn(
                              "bg-emerald-600 text-white hover:bg-emerald-700",
                              selectedMSMEs.length === 0 &&
                                "cursor-not-allowed opacity-50",
                            )}
                            disabled={selectedMSMEs.length === 0}
                          >
                            <FileDown className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">
                              Export Selected
                            </span>
                            <span className="sm:hidden">Export</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            disabled={selectedMSMEs.length === 0 || isExporting}
                            onClick={async () => {
                              if (selectedMSMEs.length === 0) {
                                toast.error(
                                  "Please select at least one MSME to export",
                                );
                                return;
                              }
                              setIsExporting(true);
                              try {
                                document
                                  .querySelector<HTMLAnchorElement>(
                                    ".csv-download-link",
                                  )
                                  ?.click();

                                await recordExport();
                              } finally {
                                setIsExporting(false);
                              }
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Export as CSV
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            disabled={selectedMSMEs.length === 0 || isExporting}
                            asChild
                          >
                            <Link
                              href={`/superadmin/pdf-export?selectedId=${JSON.stringify(selectedMSMEs)}`}
                              onClick={(e) => {
                                if (selectedMSMEs.length === 0) {
                                  e.preventDefault();
                                  toast.error(
                                    "Please select at least one MSME to export",
                                  );
                                  return;
                                }
                                setIsExporting(true);
                              }}
                            >
                              <Download
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isExporting && "animate-spin",
                                )}
                              />
                              {isExporting
                                ? "Preparing PDF..."
                                : "Export as PDF"}
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Hidden CSVLink component */}
                      <div className="hidden">
                        <CSVLink
                          data={getCsvData(msmes, selectedMSMEs, getSectorName)}
                          headers={csvHeaders}
                          filename="msme-data.csv"
                          className="csv-download-link"
                        />
                      </div>

                      <Button
                        variant="outline"
                        onClick={handleExportModeToggle}
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <X className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">
                          Cancel Selection
                        </span>
                        <span className="sm:hidden">Cancel</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleExportModeToggle}
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Select & Export</span>
                      <span className="sm:hidden">Export</span>
                    </Button>
                    <Button
                      onClick={() => router.push("/superadmin/msme/add-msme")}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Add MSME</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex h-[calc(100%-4rem)] flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <MSMETableView
                msmes={paginatedMSMEs}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteMSME}
                getSectorName={getSectorName}
                sortState={sortState}
                onSort={handleSort}
                isExportMode={isExportMode}
                selectedMSMEs={selectedMSMEs}
                onSelectMSME={handleSelectMSME}
                selectAll={selectAll}
                onSelectAll={handleSelectAll}
              />
            </div>

            {totalPages > 1 && (
              <div className="flex-none border-t bg-white py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-center text-sm text-gray-500 sm:text-left">
                    Showing {startIndex} to {endIndex} of {filteredMSMEs.length}{" "}
                    entries
                  </div>
                  <Pagination>
                    <PaginationContent className="gap-1 sm:gap-2">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          className={cn(
                            "h-8 w-8 rounded-md border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white sm:h-auto sm:w-auto sm:px-4",
                            currentPage === 1 &&
                              "pointer-events-none opacity-50",
                          )}
                        />
                      </PaginationItem>
                      {renderPaginationItems()}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          className={cn(
                            "h-8 w-8 rounded-md border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white sm:h-auto sm:w-auto sm:px-4",
                            currentPage === totalPages &&
                              "pointer-events-none opacity-50",
                          )}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      {/* <AddMSMEModal
        isOpen={isAddMSMEModalOpen}
        onClose={() => setIsAddMSMEModalOpen(false)}
      /> */}
      {/* <EditMSMEModal
        isOpen={isEditMSMEModalOpen}
        onClose={() => setIsEditMSMEModalOpen(false)}
        msme={currentMSME}
      /> */}
    </div>
  );
}

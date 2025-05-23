"use client";

import { useState } from "react";
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
import Link from "next/link";

export default function ManageMSME() {
  const router = useRouter();
  const { msmes, sectors, handleDeleteMSME, isLoading } = useMSMEContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
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
    router.push(`/superadmin/msme/edit-msme/${msme.id}`);
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
    <div className="flex h-full flex-col p-4 md:p-6">
      <div className="flex h-full flex-col">
        <CardHeader className="flex-none flex-row items-center justify-between space-y-0 px-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Manage MSMEs
              </CardTitle>
              <CardDescription className="mt-1 text-lg font-bold text-gray-600">
                Total: {msmes?.length ?? 0} MSMEs
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col overflow-hidden px-0">
          <div className="mb-4 flex-none">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-64">
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
              <div className="flex items-center gap-4">
                {isExportMode ? (
                  <>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className="h-8 border-2 border-emerald-600 bg-emerald-50 px-3 py-1.5"
                      >
                        <Check className="mr-1 h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">
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
                            Export Selected
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
                        Cancel Selection
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
                      Select & Export
                    </Button>
                    <Button
                      onClick={() => router.push("/superadmin/msme/add-msme")}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add MSME
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden pb-16">
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
          </div>
          {totalPages > 1 && (
            <div
              className="fixed bottom-0 z-50 border-t bg-white py-4"
              style={{
                left: "16rem", // 16rem = 256px = w-64
                width: "calc(100vw - 16rem)",
              }}
            >
              <div className="flex w-full flex-col items-center justify-center gap-2">
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
                          "rounded-md border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white",
                          currentPage === 1 && "pointer-events-none opacity-50",
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
                          "rounded-md border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white",
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
        </CardContent>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
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
  Download,
  Store,
  X,
  Check,
  FileDown,
} from "lucide-react";
import { useMSMEContext } from "@/contexts/MSMEContext";
import AdminAddMSMEModal from "@/components/modals/AdminAddMSMEModal";
import AdminEditMSMEModal from "@/components/modals/AdminEditMSMEModal";
import type { MSME } from "@/types/superadmin";
import { MSMETableView } from "@/components/admin/MSMETable";
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
import { MSMEFilters } from "@/components/admin/MSMEFilters";
import type { SortState, FilterState } from "@/types/table";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function MSMEPage({
  params,
}: {
  params: { sectorName: string };
}) {
  const { msmes, sectors, handleDeleteMSME, isLoading } = useMSMEContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isAddMSMEModalOpen, setIsAddMSMEModalOpen] = useState(false);
  const [isEditMSMEModalOpen, setIsEditMSMEModalOpen] = useState(false);
  const [currentMSME, setCurrentMSME] = useState<MSME | null>(null);
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
  const { sectorName } = params;

  const Sector = sectors.find(
    (sector) =>
      sector.name.toLowerCase().replace(/\s+/g, "") ===
      sectorName.toLowerCase(),
  );

  const getSectorName = (sectorId: number) => {
    return sectors.find((s) => s.id === sectorId)?.name ?? "Unknown";
  };

  const handleSort = (column: string) => {
    setSortState((prev) => ({
      column,
      direction:
        prev.column === column
          ? prev.direction === "default"
            ? "asc"
            : prev.direction === "asc"
              ? "desc"
              : "default"
          : "asc",
    }));
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

  const filteredMSMEs = msmes
    .filter((msme) => msme.sectorId === Sector?.id) // Keep sector-specific filtering
    .filter((msme) => {
      if (
        filters.cities.length > 0 &&
        !filters.cities.includes(msme.cityMunicipalityAddress)
      )
        return false;
      return (
        msme.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msme.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msme.companyDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        msme.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortState.direction === "default") return 0;

      const direction = sortState.direction === "asc" ? 1 : -1;
      const column = sortState.column;

      switch (column) {
        case "companyName":
          return direction * a.companyName.localeCompare(b.companyName);
        case "sector":
          return (
            direction *
            getSectorName(a.sectorId).localeCompare(getSectorName(b.sectorId))
          );
        case "contact":
          return (
            direction *
            (a.contactPerson || "").localeCompare(b.contactPerson || "")
          );
        case "location":
          return (
            direction *
            (a.cityMunicipalityAddress || "").localeCompare(
              b.cityMunicipalityAddress || "",
            )
          );
        case "dti":
          return direction * ((a.dti_number || 0) - (b.dti_number || 0));
        default:
          return 0;
      }
    });

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

  // Add this useEffect to reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

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
    <div className="h-screen max-h-screen overflow-hidden">
      <div className="flex h-full flex-col">
        <CardHeader className="flex-none flex-row items-center justify-between space-y-0 px-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-50 p-2">
              <Store className="h-6 w-6 text-[#996439]" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-[#996439]">
                {sectorName.toLocaleUpperCase()} SECTOR
              </CardTitle>
              <CardDescription className="mt-1 text-lg font-bold text-[#996439]">
                Total: {filteredMSMEs?.length ?? 0} MSMEs
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-visible px-0">
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
                  sectors={[]} // Empty array to hide sector filter
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
                        className="h-8 border-2 border-[#996439] bg-amber-50 px-3 py-1.5"
                      >
                        <Check className="mr-1 h-4 w-4 text-[#996439]" />
                        <span className="text-sm font-medium text-[#996439]">
                          {selectedMSMEs.length} MSMEs selected
                        </span>
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className={cn(
                              "bg-[#996439] text-white hover:bg-[#ce9261]",
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
                            asChild
                          >
                            <Link
                              href={{
                                pathname: "/admin/csv-export",
                                query: {
                                  selectedId: JSON.stringify(selectedMSMEs),
                                },
                              }}
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
                              <Download className="mr-2 h-4 w-4" />
                              Export as CSV
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            disabled={selectedMSMEs.length === 0 || isExporting}
                            asChild
                          >
                            <Link
                              href={{
                                pathname: "/admin/pdf-export",
                                query: {
                                  selectedId: JSON.stringify(selectedMSMEs),
                                },
                              }}
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
                              Export as PDF
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant="outline"
                        onClick={handleExportModeToggle}
                        className="border-[#996439] text-[#996439] hover:bg-[#996439] hover:text-white"
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
                      className="border-[#996439] text-[#996439] hover:bg-[#996439] hover:text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Select & Export
                    </Button>
                    <Button
                      onClick={() => setIsAddMSMEModalOpen(true)}
                      className="bg-[#996439] hover:bg-[#ce9261]"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add MSME
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
                <div className="flex items-center justify-between">
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
          </div>
        </CardContent>
      </div>

      <AdminAddMSMEModal
        isOpen={isAddMSMEModalOpen}
        onClose={() => setIsAddMSMEModalOpen(false)}
      />
      <AdminEditMSMEModal
        isOpen={isEditMSMEModalOpen}
        onClose={() => setIsEditMSMEModalOpen(false)}
        msme={currentMSME}
      />
    </div>
  );
}

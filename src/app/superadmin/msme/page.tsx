"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus, Search, Building2, Download } from "lucide-react";
import { useMSMEContext } from "@/contexts/MSMEContext";
import AddMSMEModal from "@/components/modals/AddMSMEModal";
import EditMSMEModal from "@/components/modals/EditMSMEModal";
import type { MSME } from "@/types/superadmin";
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
import Link from "next/link";
import { toast } from "sonner";
import { CSVLink } from "react-csv";

// Add interface extension for local use
interface MSMEWithProducts extends MSME {
  products: string[];
}

export default function ManageMSME() {
  const { msmes, sectors, handleDeleteMSME, isLoading } = useMSMEContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isAddMSMEModalOpen, setIsAddMSMEModalOpen] = useState(false);
  const [isEditMSMEModalOpen, setIsEditMSMEModalOpen] = useState(false);
  const [currentMSME, setCurrentMSME] = useState<MSMEWithProducts | null>(null);
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

  const handleExport = () => {
    if (selectedMSMEs.length === 0) {
      toast.error("Please select at least one MSME to export", {
        position: "top-center",
      });
      return;
    }
  };

  const csvHeaders = [
    { label: "Company Name", key: "companyName" },
    { label: "Contact Person", key: "contactPerson" },
    { label: "Contact Number", key: "contactNumber" },
    { label: "Email", key: "email" },
    { label: "Address", key: "cityMunicipalityAddress" },
    { label: "Sector", key: "sector" },
  ];

  const getCsvData = () => {
    return filteredMSMEs
      .filter((msme) => selectedMSMEs.includes(msme.id))
      .map((msme) => ({
        ...msme,
        sector: getSectorName(msme.sectorId),
        products: (msme as MSMEWithProducts).products?.join(", ") || "",
      }));
  };

  const filteredMSMEs = msmes
    .filter((msme) => {
      if (
        filters.sectors.length > 0 &&
        !filters.sectors.includes(msme.sectorId)
      )
        return false;
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
    setCurrentMSME(msme as MSMEWithProducts);
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
    <div className="h-screen max-h-screen overflow-hidden p-4 md:p-6">
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
                  sectors={sectors}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
              <div className="flex items-center gap-4">
                {isExportMode ? (
                  <>
                    {selectedMSMEs.length > 0 ? (
                      <div className="flex space-x-2">
                        <CSVLink
                          data={getCsvData()}
                          headers={csvHeaders}
                          filename="msme-data.csv"
                          className="inline-flex"
                        >
                          <Button className="bg-emerald-600 hover:bg-[#51d14a]">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                          </Button>
                        </CSVLink>
                        <Link
                          href={{
                            pathname: "/superadmin/pdf-export",
                            query: {
                              selectedId: JSON.stringify(selectedMSMEs),
                            },
                          }}
                        >
                          <Button className="bg-emerald-600 hover:bg-[#51d14a]">
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Button
                        className="bg-emerald-600 font-bold opacity-50"
                        onClick={handleExport}
                      >
                        <Download className="mr-2 h-4 w-4" /> Export Data
                        <span className="ml-2 text-xl font-bold text-white">
                          [0]
                        </span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleExportModeToggle}
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleExportModeToggle}
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-emerald-50"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                    <Button
                      onClick={() => setIsAddMSMEModalOpen(true)}
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

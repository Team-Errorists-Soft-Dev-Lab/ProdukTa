"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Search,
  LayoutGrid,
  TableIcon,
  ChevronLeft,
  ChevronRight,
  Store,
  SquarePlus,
  X,
  Check,
} from "lucide-react";
import { useMSMEContext } from "@/contexts/MSMEContext";
import AdminAddMSMEModal from "@/components/modals/AdminAddMSMEModal";
import AdminEditMSMEModal from "@/components/modals/AdminEditMSMEModal";
import type { MSME } from "@/types/superadmin";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MSMETableView } from "@/components/msme/MSMETable";
import { MSMECardView } from "@/components/admin/cardView";
import { cn } from "@/lib/utils";
import { ILOILO_LOCATIONS } from "@/lib/iloilo-locations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

type ViewMode = "card" | "table";

export default function MSMEPage({
  params,
}: {
  params: { sectorName: string };
}) {
  const { msmes, sectors, handleDeleteMSME, isLoading } = useMSMEContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isAddMSMEModalOpen, setIsAddMSMEModalOpen] = useState(false);
  const [isEditMSMEModalOpen, setIsEditMSMEModalOpen] = useState(false);
  const [currentMSME, setCurrentMSME] = useState<MSME | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [municipalityFilter, setMunicipalityFilter] = useState<string[]>([]);
  const { sectorName } = params;

  const Sector = sectors.find(
    (sector) =>
      sector.name.toLowerCase().replace(/\s+/g, "") ===
      sectorName.toLowerCase(),
  );

  const filteredMSMEs = msmes
    .filter((msme) => msme.sectorId === Sector?.id)
    .filter(
      (msme) =>
        (msme.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msme.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msme.companyDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          msme.contactPerson
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (municipalityFilter.length === 0 ||
          municipalityFilter.includes(msme.cityMunicipalityAddress)),
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

  return (
    <div className="overflow-x-hidden">
      <CardHeader className="flex flex-col space-y-4 px-0 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-50 p-3">
              <Store className="h-6 w-6 text-[#996439]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#996439] sm:text-3xl">
              {sectorName.toLocaleUpperCase()}
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-base font-bold text-[#996439] sm:text-lg">
            Total: {filteredMSMEs?.length ?? 0} MSMEs
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setViewMode("card");
                    setItemsPerPage(3);
                  }}
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
                  onClick={() => {
                    setViewMode("table");
                    setItemsPerPage(4);
                  }}
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
            className="bg-[#996439] font-bold hover:bg-[#ce9261]"
          >
            <SquarePlus className="mr-2 h-4 w-4" />
            Add MSME
          </Button>
          <Button
            className="bg-[#996439] font-bold hover:bg-[#ce9261]"
            onClick={() => {
              setCurrentPage(1);
              if (itemsPerPage === 3) {
                setItemsPerPage(999999999);
              } else {
                setItemsPerPage(3);
              }
            }}
          >
            {itemsPerPage === 3 ? "Display All" : "Display Less"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="mb-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="relative w-full sm:w-64">
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
            <div className="relative flex w-full items-center sm:w-64">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-[#996439] sm:w-[200px]"
                  >
                    {municipalityFilter.length > 0 ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {municipalityFilter.length} selected
                      </>
                    ) : (
                      "Select locations..."
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup>
                        {ILOILO_LOCATIONS.map((location) => (
                          <CommandItem
                            key={location.name}
                            onSelect={() => {
                              setMunicipalityFilter((prev) =>
                                prev.includes(location.name)
                                  ? prev.filter(
                                      (item) => item !== location.name,
                                    )
                                  : [...prev, location.name],
                              );
                            }}
                          >
                            <Checkbox
                              checked={municipalityFilter.includes(
                                location.name,
                              )}
                              className="mr-2"
                            />
                            {location.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMunicipalityFilter([])}
                className="ml-2 h-8 border border-[#996439] px-8 hover:bg-[#996439] lg:px-3"
              >
                Reset filter
                <X className="ml-2 h-4 w-4" />
              </Button>
            </div>
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
          <div className="">
            <MSMECardView
              msmes={paginatedMSMEs}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDeleteMSME}
              getSectorName={getSectorName}
            />
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
            <div className="text-sm text-gray-500">
              Showing {startIndex} to {endIndex} of {filteredMSMEs.length}{" "}
              entries
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? "bg-emerald-600 hover:bg-emerald-700"
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
          </div>
        )}
      </CardContent>

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

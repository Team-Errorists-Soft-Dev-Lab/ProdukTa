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
  TableIcon,
  ChevronLeft,
  ChevronRight,
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
import { MSMETableView } from "@/components/msme/MSMETableView";
import { MSMECardView } from "@/components/admin/cardView";
import { cn } from "@/lib/utils";

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
  const { sectorName } = params;

  const Sector = sectors.find(
    (s) => s.name.toLocaleLowerCase() === sectorName.toLocaleLowerCase(),
  );

  const filteredMSMEs = msmes
    .filter((msme) => msme.sectorId === Sector?.id)
    .filter(
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

  return (
    <div className="overflow-x-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              {sectorName.toLocaleUpperCase()}
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-lg font-bold text-gray-600">
            Total: {filteredMSMEs?.length ?? 0} MSMEs
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
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
            className="bg-[#996439] hover:bg-[#ce9261]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add MSME
          </Button>
          <Button
            className="bg-[#996439] hover:bg-[#ce9261]"
            onClick={() => {
              setCurrentPage(1);
              if (itemsPerPage === 3) {
                setItemsPerPage(9999999);
              } else {
                setItemsPerPage(3);
              }
            }}
          >
            Display All
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
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex} to {endIndex} of {filteredMSMEs.length}{" "}
              entries
            </div>
            <div className="flex items-center gap-2">
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

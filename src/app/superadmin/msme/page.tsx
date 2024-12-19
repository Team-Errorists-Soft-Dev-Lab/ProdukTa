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
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { MSMETableView } from "@/components/msme/MSMETableView";
import { MSMECardView } from "@/components/msme/MSMECardView";
import { cn } from "@/lib/utils";

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

  const handleDelete = async (msmeId: number) => {
    try {
      await handleDeleteMSME(msmeId);
    } catch (error) {
      console.error("Failed to delete MSME:", error);
    }
  };

  const getSectorName = (sectorId: number) => {
    return sectors.find((s) => s.id === sectorId)?.name ?? "Unknown Sector";
  };

  const handleEdit = (msme: MSME) => {
    setCurrentMSME(msme);
    setIsEditMSMEModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      <CardHeader className="px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-50 p-2">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                MSMEs
              </CardTitle>
            </div>
            <CardDescription className="text-base text-gray-600">
              Total:{" "}
              {isLoading ? (
                <Skeleton className="inline-block h-4 w-12" />
              ) : (
                <span>{msmes?.length ?? 0}</span>
              )}{" "}
              MSMEs registered
            </CardDescription>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search MSMEs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus-visible:ring-emerald-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-10 w-10",
                        viewMode === "card" && "bg-emerald-50 text-emerald-600",
                      )}
                      onClick={() => setViewMode("card")}
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Card view</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-10 w-10",
                        viewMode === "table" &&
                          "bg-emerald-50 text-emerald-600",
                      )}
                      onClick={() => setViewMode("table")}
                    >
                      <TableIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Table view</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsAddMSMEModalOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add MSME
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Register a new MSME</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {searchTerm && (
          <div className="mb-4">
            <Badge variant="secondary" className="h-8 gap-1 px-3 py-0">
              Filtered Results
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 rounded-full hover:text-gray-700"
              >
                ×
              </button>
            </Badge>
          </div>
        )}

        {viewMode === "card" ? (
          <MSMECardView
            msmes={paginatedMSMEs}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getSectorName={getSectorName}
          />
        ) : (
          <MSMETableView
            msmes={paginatedMSMEs}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getSectorName={getSectorName}
          />
        )}

        {paginatedMSMEs.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-500">
              Showing {startIndex} to {endIndex} of {filteredMSMEs.length} MSMEs
            </p>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Previous page</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Badge variant="outline" className="h-8 px-3 py-0">
                Page {currentPage} of {totalPages}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Next page</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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

"use client";

import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SECTOR_COLORS } from "@/lib/sector-colors";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { MSMETableViewProps } from "@/types/MSME";

export function MSMETableView({
  msmes,
  isLoading,
  onEdit,
  onDelete,
  getSectorName,
  sortState = { column: "", direction: "default" },
  onSort = (column: string) => {
    console.log(`Sorting by ${column}`);
  },
  isExportMode = false,
  selectedMSMEs = [],
  onSelectMSME,
  selectAll = false,
  onSelectAll,
}: MSMETableViewProps) {
  const SortIcon = ({ column }: { column: string }) => {
    if (sortState.column !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }
    if (sortState.direction === "default") {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortState.direction === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const columnWidths = {
    checkbox: "w-[50px]",
    companyName: "w-[250px]",
    sector: "w-[150px]",
    contact: "w-[200px]",
    location: "w-[200px]",
    actions: "w-[100px]",
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: string;
    children: React.ReactNode;
  }) => (
    <TableHead className={columnWidths[column as keyof typeof columnWidths]}>
      <button
        className={cn(
          "inline-flex items-center whitespace-nowrap hover:text-[#996439]",
          sortState.column === column &&
            sortState.direction !== "default" &&
            "font-medium text-[#996439]",
        )}
        onClick={() => onSort(column)}
      >
        {children}
        <SortIcon column={column} />
      </button>
    </TableHead>
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#996439]/20 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50/50">
              {isExportMode && <TableHead className="w-[50px]" />}
              <TableHead className="w-[250px]">Company Name</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              {!isExportMode && (
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {isExportMode && (
                  <TableCell>
                    <Skeleton className="h-4 w-4 bg-amber-100/10" />
                  </TableCell>
                )}
                <TableCell>
                  <Skeleton className="h-6 w-[200px] bg-amber-100/10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[150px] bg-amber-100/10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[180px] bg-amber-100/10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[200px] bg-amber-100/10" />
                </TableCell>
                {!isExportMode && (
                  <TableCell>
                    <Skeleton className="h-6 w-[80px] bg-amber-100/10" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (msmes.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#996439]/20 text-center">
        <p className="text-lg text-[#996439]">No MSMEs found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="text-lg font-extrabold">
          <TableRow>
            {isExportMode && (
              <TableHead className={columnWidths.checkbox}>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={(checked) => onSelectAll?.(checked === true)}
                  aria-label="Select all"
                  className="border-[#996439] data-[state=checked]:bg-[#996439] data-[state=checked]:text-white"
                />
              </TableHead>
            )}
            <SortableHeader column="companyName">Company Name</SortableHeader>
            <SortableHeader column="sector">Sector</SortableHeader>
            <SortableHeader column="contact">Contact</SortableHeader>
            <SortableHeader column="location">Location</SortableHeader>
            {!isExportMode && (
              <TableHead className={columnWidths.actions + " text-right"}>
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {msmes.map((msme) => {
            const sectorName = getSectorName(msme.sectorId);
            const sectorColor =
              SECTOR_COLORS[sectorName as keyof typeof SECTOR_COLORS] ??
              "#996439";
            return (
              <TableRow key={msme.id}>
                {isExportMode && (
                  <TableCell>
                    <Checkbox
                      checked={selectedMSMEs.includes(msme.id)}
                      onCheckedChange={(checked) =>
                        onSelectMSME?.(msme.id, checked === true)
                      }
                      aria-label={`Select ${msme.companyName}`}
                      className="border-[#996439] data-[state=checked]:bg-[#996439] data-[state=checked]:text-white"
                    />
                  </TableCell>
                )}
                <TableCell
                  className={cn("font-medium", columnWidths.companyName)}
                >
                  {msme.companyName}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: `${sectorColor}20`,
                      color: sectorColor,
                      borderColor: `${sectorColor}40`,
                    }}
                  >
                    {sectorName}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{msme.contactPerson}</div>
                    <a
                      href={`mailto:${msme.email}`}
                      className="text-sm text-[#996439] hover:text-[#ce9261]"
                    >
                      {msme.email}
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  {msme.cityMunicipalityAddress}
                  {msme.provinceAddress && `, ${msme.provinceAddress}`}
                </TableCell>
                {!isExportMode && (
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-amber-100"
                              onClick={() => onEdit?.(msme)}
                            >
                              <Edit className="h-4 w-4 text-[#996439]" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit MSME</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-red-200"
                                >
                                  <Trash className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete MSME
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete{" "}
                                    <span className="font-medium text-[#996439]">
                                      {msme.companyName}
                                    </span>
                                    ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDelete?.(msme.id)}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TooltipTrigger>
                          <TooltipContent>Delete MSME</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

import React from "react";
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
  sortState,
  onSort,
  isExportMode = false,
  selectedMSMEs = [],
  onSelectMSME,
  selectAll = false,
  onSelectAll,
}: MSMETableViewProps) {
  const SortIcon = ({ column }: { column: string }) => {
    if (sortState?.column !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }
    if (sortState?.direction === "default") {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortState?.direction === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const columnWidths = {
    checkbox: "w-[35px]",
    companyName: "min-w-[140px] max-w-[200px]",
    sector: "min-w-[100px] max-w-[140px]",
    contact: "min-w-[140px] max-w-[180px]",
    location: "min-w-[120px] max-w-[160px]",
    actions: "w-[70px]",
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: string;
    children: React.ReactNode;
  }) => (
    <TableHead
      className={cn(
        columnWidths[column as keyof typeof columnWidths],
        "px-2 sm:px-4",
      )}
    >
      <button
        className={cn(
          "inline-flex items-center whitespace-nowrap text-xs hover:text-emerald-600 sm:text-sm",
          sortState?.column === column &&
            sortState?.direction !== "default" &&
            "font-medium text-emerald-600",
        )}
        onClick={() => {
          if (onSort) {
            onSort(column);
          }
        }}
      >
        {children}
        <SortIcon column={column} />
      </button>
    </TableHead>
  );

  if (isLoading) {
    return (
      <div className="w-full overflow-auto">
        <div className="rounded-lg border border-emerald-100 shadow-sm">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-emerald-50/50">
                {isExportMode && <TableHead className="w-[35px] px-2" />}
                <TableHead className="min-w-[140px] px-2 sm:px-4">
                  Company Name
                </TableHead>
                <TableHead className="min-w-[100px] px-2 sm:px-4">
                  Sector
                </TableHead>
                <TableHead className="min-w-[140px] px-2 sm:px-4">
                  Contact
                </TableHead>
                <TableHead className="min-w-[120px] px-2 sm:px-4">
                  Location
                </TableHead>
                {!isExportMode && (
                  <TableHead className="w-[70px] px-2 text-right">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {isExportMode && (
                    <TableCell className="px-2">
                      <Skeleton className="h-4 w-4 bg-emerald-100/10" />
                    </TableCell>
                  )}
                  <TableCell className="px-2 sm:px-4">
                    <Skeleton className="h-6 w-[120px] bg-emerald-100/10 sm:w-[160px]" />
                  </TableCell>
                  <TableCell className="px-2 sm:px-4">
                    <Skeleton className="h-6 w-[80px] bg-emerald-100/10 sm:w-[120px]" />
                  </TableCell>
                  <TableCell className="px-2 sm:px-4">
                    <Skeleton className="h-6 w-[120px] bg-emerald-100/10 sm:w-[150px]" />
                  </TableCell>
                  <TableCell className="px-2 sm:px-4">
                    <Skeleton className="h-6 w-[100px] bg-emerald-100/10 sm:w-[140px]" />
                  </TableCell>
                  {!isExportMode && (
                    <TableCell className="px-2">
                      <Skeleton className="h-6 w-[50px] bg-emerald-100/10" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (msmes.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-200 text-center">
        <p className="text-base text-emerald-600 sm:text-lg">No MSMEs found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <div className="rounded-md border">
        <Table className="min-w-full table-fixed sm:table-auto">
          <TableHeader className="text-sm font-extrabold sm:text-lg">
            <TableRow>
              {isExportMode && (
                <TableHead className={cn(columnWidths.checkbox, "px-2")}>
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={(checked) =>
                      onSelectAll?.(checked === true)
                    }
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              <SortableHeader column="companyName">
                <span className="hidden sm:inline">Company Name</span>
                <span className="sm:hidden">Company</span>
              </SortableHeader>
              <SortableHeader column="sector">Sector</SortableHeader>
              <SortableHeader column="contact">Contact</SortableHeader>
              <SortableHeader column="location">Location</SortableHeader>
              {!isExportMode && (
                <TableHead
                  className={cn(columnWidths.actions, "px-2 text-right")}
                >
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
                "#4B5563";
              return (
                <TableRow key={msme.id}>
                  {isExportMode && (
                    <TableCell className="px-2">
                      <Checkbox
                        checked={selectedMSMEs.includes(msme.id)}
                        onCheckedChange={(checked) =>
                          onSelectMSME?.(msme.id, checked === true)
                        }
                        aria-label={`Select ${msme.companyName}`}
                      />
                    </TableCell>
                  )}
                  <TableCell
                    className={cn(
                      "px-2 font-medium sm:px-4",
                      columnWidths.companyName,
                    )}
                  >
                    <div className="truncate" title={msme.companyName}>
                      {msme.companyName}
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn(columnWidths.sector, "px-2 sm:px-4")}
                  >
                    <Badge
                      variant="secondary"
                      className="max-w-full text-xs sm:text-sm"
                      style={{
                        backgroundColor: `${sectorColor}20`,
                        color: sectorColor,
                        borderColor: `${sectorColor}40`,
                      }}
                    >
                      <span className="truncate" title={sectorName}>
                        {sectorName}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(columnWidths.contact, "px-2 sm:px-4")}
                  >
                    <div className="space-y-1">
                      <div
                        className="truncate text-xs sm:text-sm"
                        title={msme.contactPerson}
                      >
                        {msme.contactPerson}
                      </div>
                      <a
                        href={`mailto:${msme.email}`}
                        className="block truncate text-xs text-emerald-600 hover:text-emerald-700 sm:text-sm"
                        title={msme.email}
                      >
                        {msme.email}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn(columnWidths.location, "px-2 sm:px-4")}
                  >
                    <div
                      className="truncate text-xs sm:text-sm"
                      title={`${msme.cityMunicipalityAddress}${msme.provinceAddress ? `, ${msme.provinceAddress}` : ""}`}
                    >
                      {msme.cityMunicipalityAddress}
                      {msme.provinceAddress && (
                        <span className="hidden sm:inline">
                          , {msme.provinceAddress}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  {!isExportMode && (
                    <TableCell className={cn(columnWidths.actions, "px-2")}>
                      <div className="flex items-center justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-emerald-200 sm:h-8 sm:w-8"
                                onClick={() => onEdit?.(msme)}
                              >
                                <Edit className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" />
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
                                    className="h-6 w-6 hover:bg-red-200 sm:h-8 sm:w-8"
                                  >
                                    <Trash className="h-3 w-3 text-red-600 sm:h-4 sm:w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="mx-2 max-w-md sm:mx-auto sm:max-w-lg">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete MSME
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete{" "}
                                      <span className="font-medium text-emerald-600">
                                        {msme.companyName}
                                      </span>
                                      ? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
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
    </div>
  );
}

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
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import type { MSME } from "@/types/superadmin";
import type { SortState } from "@/types/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SECTOR_COLORS } from "@/lib/sector-colors";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface MSMETableViewProps {
  msmes: MSME[];
  isLoading: boolean;
  getSectorName: (id: number) => string;
  sortState: SortState;
  onSort: (column: string) => void;
  selectedMSMEs: number[];
  onSelectMSME: (id: number, isSelected: boolean) => void;
  selectAll: boolean;
  onSelectAll: (isSelected: boolean) => void;
}

export function MSMETableView({
  msmes,
  isLoading,
  getSectorName,
  sortState,
  onSort,
  selectedMSMEs,
  onSelectMSME,
  selectAll,
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
    dti: "w-[150px]",
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
          "inline-flex items-center whitespace-nowrap hover:text-emerald-600",
          sortState.column === column &&
            sortState.direction !== "default" &&
            "font-medium text-emerald-600",
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
      <div className="rounded-lg border border-emerald-100 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-emerald-50/50">
              <TableHead className="w-[250px]">Company Name</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-6 w-[200px] bg-emerald-100/10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[150px] bg-emerald-100/10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[180px] bg-emerald-100/10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[200px] bg-emerald-100/10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[80px] bg-emerald-100/10" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (msmes.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-200 text-center">
        <p className="text-lg text-emerald-600">No MSMEs found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="text-lg font-extrabold">
          <TableRow>
            <TableHead className={columnWidths.checkbox}>
              <Checkbox
                checked={selectAll}
                onCheckedChange={(checked) => onSelectAll(checked === true)}
                aria-label="Select all"
              />
            </TableHead>
            <SortableHeader column="companyName">Company Name</SortableHeader>
            <SortableHeader column="sector">Sector</SortableHeader>
            <SortableHeader column="contact">Contact</SortableHeader>
            <SortableHeader column="location">Location</SortableHeader>
            <SortableHeader column="dti">DTI Number</SortableHeader>
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
                <TableCell>
                  <Checkbox
                    checked={selectedMSMEs.includes(msme.id)}
                    onCheckedChange={(checked) =>
                      onSelectMSME(msme.id, checked === true)
                    }
                    aria-label={`Select ${msme.companyName}`}
                  />
                </TableCell>
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
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      {msme.email}
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  {msme.cityMunicipalityAddress}, {msme.provinceAddress}
                </TableCell>
                <TableCell>{msme.dti_number}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

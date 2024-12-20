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
import { Edit, Trash } from "lucide-react";
import type { MSME } from "@/types/superadmin";
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

interface MSMETableViewProps {
  msmes: MSME[];
  isLoading: boolean;
  onEdit: (msme: MSME) => void;
  onDelete: (id: number) => void;
  getSectorName: (id: number) => string;
}

export function MSMETableView({
  msmes,
  isLoading,
  onEdit,
  onDelete,
  getSectorName,
}: MSMETableViewProps) {
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
    <div className="rounded-lg border border-emerald-600 shadow-sm">
      <Table>
        <TableHeader className="text-base">
          <TableRow>
            <TableHead className="w-[250px]">Company Name</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>DTI Number</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
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
                <TableCell className="font-medium">
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
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-emerald-50"
                            onClick={() => onEdit(msme)}
                          >
                            <Edit className="h-4 w-4 text-emerald-600" />
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
                                className="h-8 w-8 hover:bg-red-50"
                              >
                                <Trash className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete MSME</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <span className="font-medium text-emerald-600">
                                    {msme.companyName}
                                  </span>
                                  ? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(msme.id)}
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

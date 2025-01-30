import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Mail, Phone, MapPin } from "lucide-react";
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
import { getSectorIcon } from "@/lib/utils";
import { SECTOR_COLORS } from "@/lib/sector-colors";

interface MSMECardViewProps {
  msmes: MSME[];
  isLoading: boolean;
  onEdit: (msme: MSME) => void;
  onDelete: (id: number) => void;
  getSectorName: (id: number) => string;
}

export function MSMECardView({
  msmes,
  isLoading,
  onEdit,
  onDelete,
  getSectorName,
}: MSMECardViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (msmes.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
        <p className="text-lg text-gray-500">No MSMEs found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {msmes.map((msme) => {
        const sectorName = getSectorName(msme.sectorId);
        const Icon = getSectorIcon(sectorName);
        const sectorColor =
          SECTOR_COLORS[sectorName as keyof typeof SECTOR_COLORS] ?? "#4B5563";
        return (
          <Card
            key={msme.id}
            className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ borderColor: sectorColor }}
          >
            <div
              className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 transform opacity-5 transition-opacity duration-300 group-hover:opacity-10"
              style={{ color: sectorColor }}
            >
              <Icon size={96} />
            </div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className="rounded-full p-2 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${sectorColor}20`,
                    color: sectorColor,
                  }}
                >
                  <Icon size={24} />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">
                    {msme.companyName}
                  </CardTitle>
                  <CardDescription>
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
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="line-clamp-2 text-sm text-gray-600">
                  {msme.companyDescription}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <a
                      href={`mailto:${msme.email}`}
                      className="hover:text-emerald-600"
                    >
                      {msme.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{msme.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {msme.cityMunicipalityAddress}, {msme.provinceAddress}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">
                      DTI Number: {msme.dti_number}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-emerald-200"
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
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-200"
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
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

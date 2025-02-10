"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
  Check,
  X,
  Trash2,
  Users2,
  Shield,
  UserPlus,
  Coffee,
  Candy,
  Palmtree,
  Monitor,
  Shirt,
  Utensils,
  Sprout,
  Store,
  type LucideIcon,
} from "lucide-react";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SECTOR_COLORS } from "@/lib/sector-colors";

// Map sector names to icons
const sectorIcons: Record<string, LucideIcon> = {
  Coffee: Coffee,
  Cacao: Candy,
  Coconut: Palmtree,
  Bamboo: Sprout,
  "IT - BPM": Monitor,
  "Processed Foods": Utensils,
  "Wearables and Homestyles": Shirt,
};

// Get icon for a sector, with fallback
function getSectorIcon(sectorName: string | undefined): LucideIcon {
  if (!sectorName) return Store;

  const parts = sectorName.split(/[&,]/);
  for (const part of parts) {
    const trimmedPart = part.trim();
    const icon = sectorIcons[trimmedPart];
    if (icon) return icon;

    const matchingSector = Object.keys(sectorIcons).find((key) =>
      trimmedPart.toLowerCase().includes(key.toLowerCase()),
    );
    if (matchingSector && sectorIcons[matchingSector]) {
      return sectorIcons[matchingSector];
    }
  }
  return Store;
}

export default function ManageAdmins() {
  const {
    activeAdmins,
    pendingAdmins,
    handleAcceptAdmin,
    handleRejectAdmin,
    handleDeleteAdmin,
  } = useSuperAdminContext();

  return (
    <div className="p-4 md:p-6">
      <CardHeader className="mb-6 px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-50 p-2">
                <Users2 className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Manage Admins
              </CardTitle>
            </div>
            <CardDescription className="text-base text-gray-600">
              Active: {activeAdmins.length} Admins | Pending:{" "}
              {pendingAdmins.length} Applications
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 gap-4">
            <TabsTrigger
              value="active"
              className="flex items-center gap-2 bg-white text-black hover:bg-emerald-50 hover:text-emerald-600 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4" />
              Active Admins ({activeAdmins.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="flex items-center gap-2 bg-white text-black hover:bg-emerald-50 hover:text-emerald-600 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <UserPlus className="h-4 w-4" />
              Pending Applications ({pendingAdmins.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeAdmins.map((admin) => (
                <Card
                  key={admin.id}
                  className="group relative overflow-hidden rounded-lg border border-emerald-600 bg-white shadow-md"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 transform opacity-5 transition-opacity duration-300 group-hover:opacity-10">
                    {React.createElement(
                      getSectorIcon(admin.sectors[0]?.sector.name),
                      { size: 96 },
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                          {React.createElement(
                            getSectorIcon(admin.sectors[0]?.sector.name),
                            { className: "h-6 w-6" },
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {admin.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {admin.email}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-600"
                      >
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2 grid grid-cols-1 gap-4">
                      <div className="rounded-lg p-3">
                        <p className="text-sm text-emerald-600">Sector</p>
                        {admin.sectors[0]?.sector.name && (
                          <div className="mt-2">
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor: `${SECTOR_COLORS[admin.sectors[0].sector.name as keyof typeof SECTOR_COLORS] ?? "#4B5563"}20`,
                                color:
                                  SECTOR_COLORS[
                                    admin.sectors[0].sector
                                      .name as keyof typeof SECTOR_COLORS
                                  ] ?? "#4B5563",
                                borderColor: `${SECTOR_COLORS[admin.sectors[0].sector.name as keyof typeof SECTOR_COLORS] ?? "#4B5563"}40`,
                              }}
                            >
                              {admin.sectors[0].sector.name}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <TooltipProvider>
                      <AlertDialog>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-500 text-red-600 transition-colors duration-200 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Access
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>Remove admin access</TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remove Admin Access
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {admin.name}
                              &apos;s admin access? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Remove Access
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingAdmins.map((admin) => (
                <Card
                  key={admin.id}
                  className="group relative overflow-hidden rounded-lg border border-emerald-600 bg-white shadow-md"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 transform opacity-5 transition-opacity duration-300 group-hover:opacity-10">
                    {React.createElement(getSectorIcon(admin.sector), {
                      size: 96,
                    })}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                          {React.createElement(getSectorIcon(admin.sector), {
                            className: "h-6 w-6",
                          })}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {admin.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {admin.email}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-600"
                      >
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2 grid grid-cols-1 gap-4">
                      <div className="rounded-lg bg-emerald-50 p-3">
                        <p className="text-sm text-emerald-600">Sector</p>
                        {admin.sector && (
                          <div className="mt-2">
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor: `${SECTOR_COLORS[admin.sector as keyof typeof SECTOR_COLORS] ?? "#4B5563"}20`,
                                color:
                                  SECTOR_COLORS[
                                    admin.sector as keyof typeof SECTOR_COLORS
                                  ] ?? "#4B5563",
                                borderColor: `${SECTOR_COLORS[admin.sector as keyof typeof SECTOR_COLORS] ?? "#4B5563"}40`,
                              }}
                            >
                              {admin.sector}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-3">
                        <p className="text-sm text-emerald-600">Applied</p>
                        <p className="text-lg font-semibold text-emerald-700">
                          {admin.dateApplied}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleAcceptAdmin(admin.id)}
                            variant="outline"
                            size="sm"
                            className="border-emerald-500 text-emerald-600 transition-colors duration-200 hover:bg-emerald-600 hover:text-white"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Accept
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Accept admin application
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleRejectAdmin(admin.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-600 transition-colors duration-200 hover:bg-red-600 hover:text-white"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Reject admin application
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
}

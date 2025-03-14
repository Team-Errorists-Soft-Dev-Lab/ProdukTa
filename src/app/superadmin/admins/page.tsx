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
  Search,
  RefreshCw,
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
import { Input } from "@/components/ui/input";
import { SECTOR_COLORS } from "@/lib/sector-colors";
import { getSectorIcon } from "@/lib/utils";

export default function ManageAdmins() {
  const {
    activeAdmins,
    pendingAdmins,
    handleAcceptAdmin,
    handleRejectAdmin,
    handleDeleteAdmin,
  } = useSuperAdminContext();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("active");

  // Filter admins based on search term
  const filteredActiveAdmins = activeAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.sectors[0]?.sector.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const filteredPendingAdmins = pendingAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.sector?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Simulate loading state for better UX
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 p-6 pb-16">
      <CardHeader className="mb-6 px-0">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-2.5 shadow-sm ring-1 ring-emerald-100">
                <Users2 className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-emerald-900">
                Manage Admins
              </CardTitle>
            </div>
            <CardDescription className="text-base text-emerald-600/80">
              Active:{" "}
              <span className="font-medium text-emerald-600">
                {activeAdmins.length} Admins
              </span>{" "}
              | Pending:{" "}
              <span className="font-medium text-amber-600">
                {pendingAdmins.length} Applications
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 border-emerald-200 bg-white text-emerald-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={handleRefresh}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh data</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-emerald-500" />
              <Input
                type="text"
                placeholder="Search admins..."
                className="h-10 w-full border-emerald-200 bg-white pl-9 text-emerald-900 placeholder:text-black focus-visible:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Tabs
          defaultValue="active"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6 grid w-full grid-cols-2 gap-4 bg-transparent">
            <TabsTrigger
              value="active"
              className="flex items-center gap-2 border border-emerald-200 bg-white text-emerald-700 shadow-sm transition-colors data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4" />
              Active Admins ({activeAdmins.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="flex items-center gap-2 border border-amber-200 bg-white text-amber-700 shadow-sm transition-colors data-[state=active]:border-amber-500 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              <UserPlus className="h-4 w-4" />
              Pending Applications ({pendingAdmins.length})
              {pendingAdmins.length > 0 && (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
                  {pendingAdmins.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="active"
            className="transition-all duration-300 ease-in-out"
          >
            {filteredActiveAdmins.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-emerald-300 bg-emerald-50/50 py-12 text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-3 text-emerald-600">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-emerald-900">
                  No admins found
                </h3>
                <p className="mt-1 text-sm text-emerald-600">
                  {searchTerm
                    ? "Try a different search term"
                    : "No active admins available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3">
                {filteredActiveAdmins.map((admin) => (
                  <Card
                    key={admin.id}
                    className="relative overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-emerald-50 p-2.5 text-emerald-600 ring-1 ring-emerald-200">
                            {React.createElement(
                              getSectorIcon(
                                admin.sectors[0]?.sector.name ?? "",
                              ),
                              { className: "h-5 w-5" },
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-emerald-900">
                              {admin.name}
                            </CardTitle>
                            <CardDescription className="mt-0.5 text-sm text-emerald-600">
                              {admin.email}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="border border-emerald-200 bg-emerald-50 text-emerald-700"
                        >
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2 grid grid-cols-1 gap-3">
                        <div className="rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100/20 p-3">
                          <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">
                            Sector
                          </p>
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
                                className="inline-flex items-center gap-1.5 px-2.5 py-1"
                              >
                                {React.createElement(
                                  getSectorIcon(
                                    admin.sectors[0]?.sector.name ?? "",
                                  ),
                                  { className: "h-3.5 w-3.5" },
                                )}
                                {admin.sectors[0].sector.name}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-2">
                      <TooltipProvider>
                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-200 text-red-600 transition-colors duration-200 hover:border-red-600 hover:bg-red-600 hover:text-white"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove Access
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Remove admin access</TooltipContent>
                          </Tooltip>
                          <AlertDialogContent className="sm:max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-red-600">
                                Remove Admin Access
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{" "}
                                <span className="font-medium">
                                  {admin.name}
                                </span>
                                &apos;s admin access? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="sm:justify-start">
                              <AlertDialogCancel className="border-gray-200 text-gray-600">
                                Cancel
                              </AlertDialogCancel>
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
            )}
          </TabsContent>

          <TabsContent
            value="pending"
            className="transition-all duration-300 ease-in-out"
          >
            {filteredPendingAdmins.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50/50 py-12 text-center">
                <div className="mb-4 rounded-full bg-amber-100 p-3 text-amber-600">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-amber-900">
                  No pending applications
                </h3>
                <p className="mt-1 text-sm text-amber-600">
                  {searchTerm
                    ? "Try a different search term"
                    : "No pending admin applications at the moment"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3">
                {filteredPendingAdmins.map((admin) => (
                  <Card
                    key={admin.id}
                    className="relative overflow-hidden rounded-lg border border-amber-200 bg-white shadow-sm"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-amber-50 p-2.5 text-amber-600 ring-1 ring-amber-200">
                            {React.createElement(
                              getSectorIcon(admin.sector ?? ""),
                              {
                                className: "h-5 w-5",
                              },
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-amber-900">
                              {admin.name}
                            </CardTitle>
                            <CardDescription className="mt-0.5 text-sm text-amber-600">
                              {admin.email}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="border border-amber-200 bg-amber-50 text-amber-700"
                        >
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2 grid grid-cols-1 gap-3">
                        <div className="rounded-lg border border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100/20 p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wider text-amber-700">
                                Sector
                              </p>
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
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1"
                                  >
                                    {React.createElement(
                                      getSectorIcon(admin.sector ?? ""),
                                      {
                                        className: "h-3.5 w-3.5",
                                      },
                                    )}
                                    {admin.sector}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium uppercase tracking-wider text-amber-700">
                                Applied
                              </p>
                              <p className="mt-1 text-sm font-medium text-amber-900">
                                {admin.dateApplied}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleAcceptAdmin(admin.id)}
                              variant="outline"
                              size="sm"
                              className="border-emerald-200 text-emerald-600 transition-colors duration-200 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
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
                              className="border-red-200 text-red-600 transition-colors duration-200 hover:border-red-600 hover:bg-red-600 hover:text-white"
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
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
}

"use client";
// TODO: REMOVE ALL MOCKS AND REPLACE WITH ACTUAL DATA AND API CALLS ONCE THEY ARE IMPLEMENTED
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";

import { ExportsLineChart } from "@/components/dashboard/ExportsLineChart";
import { SectorPieChart } from "@/components/dashboard/SectorPieChart";
import { getSectorIcon } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SECTOR_COLORS } from "@/lib/sector-colors";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 4;

export default function Dashboard() {
  const { sectors, msmes, isLoading, error } = useMSMEContext();
  const { activeAdmins } = useSuperAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (error) {
      console.error("Error fetching MSME data:", error);
    }
  }, [error]);

  // Export analytics data transformed for line chart
  const lineChartData = useMemo(
    () => [
      { month: "January", exports: 45 },
      { month: "February", exports: 65 },
      { month: "March", exports: 35 },
      { month: "April", exports: 55 },
      { month: "May", exports: 70 },
      { month: "June", exports: 40 },
    ],
    [],
  );

  // Calculate total exports from line chart data
  const totalExports = useMemo(() => {
    return lineChartData.reduce((acc, curr) => acc + curr.exports, 0);
  }, [lineChartData]);

  // Calculate sector data from MSMEs with proper type checking
  const sectorChartData = useMemo(() => {
    if (!sectors || !msmes || sectors.length === 0) return [];

    // Create a map of sector counts
    const counts = new Map<number, number>();
    msmes.forEach((msme) => {
      if (msme?.sectorId) {
        counts.set(msme.sectorId, (counts.get(msme.sectorId) ?? 0) + 1);
      }
    });

    // Map sectors to chart data format
    return sectors.map((sector) => ({
      name: sector.name,
      value: counts.get(sector.id) ?? 0,
    }));
  }, [sectors, msmes]);

  // Get colors array matching the sector order
  const sectorColors = useMemo(
    () =>
      sectorChartData.map(
        (sector) =>
          SECTOR_COLORS[sector.name as keyof typeof SECTOR_COLORS] || "#CBD5E1",
      ),
    [sectorChartData],
  );

  const filteredMSMEs = useMemo(() => {
    if (!msmes || isLoading) return [];

    return msmes
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .filter((msme) => {
        if (!msme) return false;

        const name = msme.companyName?.toLowerCase() ?? "";
        const email = msme.email?.toLowerCase() ?? "";
        const description = msme.companyDescription?.toLowerCase() ?? "";
        const contactNumber = msme.contactNumber?.toLowerCase() ?? "";
        const contactPerson = msme.contactPerson?.toLowerCase() ?? "";
        const address =
          `${msme.barangayAddress} ${msme.cityMunicipalityAddress} ${msme.provinceAddress}`.toLowerCase();

        const searchTermLower = searchTerm.toLowerCase();

        return (
          name.includes(searchTermLower) ||
          email.includes(searchTermLower) ||
          description.includes(searchTermLower) ||
          contactNumber.includes(searchTermLower) ||
          contactPerson.includes(searchTermLower) ||
          address.includes(searchTermLower)
        );
      });
  }, [msmes, isLoading, searchTerm]);

  const totalPages = Math.ceil(filteredMSMEs.length / ITEMS_PER_PAGE);
  const paginatedMSMEs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMSMEs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMSMEs, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Dashboard
        </h2>
        <p className="mt-1 text-center text-lg font-bold text-gray-600">
          Overview of MSMEs in Iloilo
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle className="text-center">Total Sectors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl font-bold text-emerald-600">
              {sectors?.length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle className="text-center">Active Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl font-bold text-emerald-600">
              {activeAdmins?.length ?? 0}
            </p>
            <p className="mt-1 text-center text-sm text-gray-500">
              Across {sectors?.length ?? 0} sectors
            </p>
          </CardContent>
        </Card>
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle className="text-center">Data Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl font-bold text-emerald-600">
              {totalExports}
            </p>
            <p className="mt-1 text-center text-sm text-gray-500">
              Total exports this year
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ExportsLineChart data={lineChartData} totalExports={totalExports} />
        <SectorPieChart sectors={sectorChartData} colors={sectorColors} />
      </div>

      <div className="mt-6">
        <Card className="border-emerald-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">
                  Recent MSMEs
                </CardTitle>
                <p className="mt-1 text-sm text-gray-500">
                  Latest registered MSMEs across all sectors
                </p>
              </div>
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search MSMEs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-md border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedMSMEs.map((msme) => {
                const sectorName =
                  sectors.find((s) => s.id === msme.sectorId)?.name ??
                  "Unknown";
                const Icon = getSectorIcon(sectorName);
                const sectorColor =
                  SECTOR_COLORS[sectorName as keyof typeof SECTOR_COLORS] ??
                  "#4B5563";
                return (
                  <div
                    key={msme.id}
                    className="group relative overflow-hidden rounded-lg border bg-white p-4 transition-all duration-300 hover:shadow-md"
                    style={{ borderColor: `${sectorColor}40` }}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="rounded-full p-2"
                            style={{
                              backgroundColor: `${sectorColor}20`,
                              color: sectorColor,
                            }}
                          >
                            <Icon size={20} />
                          </div>
                          <div>
                            <h3 className="font-medium">{msme.companyName}</h3>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
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
                              <span>•</span>
                              <span className="text-sm text-gray-500">
                                Added{" "}
                                {formatDistanceToNow(new Date(msme.createdAt))}{" "}
                                ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 pl-11 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{msme.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{msme.contactNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${msme.email}`}
                            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"
                          >
                            <Mail className="h-4 w-4 text-gray-400" />
                            {msme.email}
                          </a>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-1 h-4 w-4 text-gray-400" />
                          <span className="leading-relaxed">
                            {msme.barangayAddress},{" "}
                            {msme.cityMunicipalityAddress},{" "}
                            {msme.provinceAddress}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredMSMEs.length,
                    )}{" "}
                    of {filteredMSMEs.length} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
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
                          onClick={() => handlePageChange(page)}
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
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

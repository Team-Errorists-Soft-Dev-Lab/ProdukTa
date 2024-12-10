"use client";
// TODO: REMOVE ALL MOCKS AND REPLACE WITH ACTUAL DATA AND API CALLS ONCE THEY ARE IMPLEMENTED
import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
import type { MSME } from "@/types/MSME";
import { ExportsLineChart } from "@/components/dashboard/ExportsLineChart";
import { SectorPieChart } from "@/components/dashboard/SectorPieChart";
import { useEffect } from "react";

const ITEMS_PER_PAGE = 4;

const COLORS = [
  "#10B981", // Emerald
  "#6366F1", // Indigo
  "#F59E0B", // Ambers
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#0EA5E9", // Sky
  "#F97316", // Orange
  "#A855F7", // Fuchsia
  "#EA580C", // Orange (darker)
  "#3B82F6", // Blue
];

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

  // Prepare sector data for pie chart
  const sectorChartData = sectors.map((sector) => ({
    name: sector.name,
    value: sector.msmeCount,
  }));

  const filteredMSMEs = useMemo(() => {
    if (!msmes || isLoading) return [];

    return msmes.filter((msme) => {
      if (!msme) return false;

      const name = msme.companyName?.toLowerCase() ?? "";
      const email = msme.email?.toLowerCase() ?? "";
      const description = msme.companyDescription?.toLowerCase() ?? "";
      const contactNumber = msme.contactNumber?.toLowerCase() ?? "";

      const searchTermLower = searchTerm.toLowerCase();

      return (
        name.includes(searchTermLower) ||
        email.includes(searchTermLower) ||
        description.includes(searchTermLower) ||
        contactNumber.includes(searchTermLower)
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
              {sectors.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle className="text-center">Active Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl font-bold text-emerald-600">
              {activeAdmins.length}
            </p>
            <p className="mt-1 text-center text-sm text-gray-500">
              Across {sectors.length} sectors
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
        <SectorPieChart sectors={sectorChartData} colors={COLORS} />
      </div>

      <div className="mt-6">
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle>Recent MSMEs</CardTitle>
            <div className="relative w-full">
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
          </CardHeader>
          <CardContent>
            <div className="p-4">
              {paginatedMSMEs.map((msme) => {
                const typedMsme = msme as unknown as MSME;
                return (
                  <div
                    key={typedMsme.id}
                    className="mb-4 rounded-lg border border-emerald-600 bg-white p-4 shadow-md last:mb-0"
                  >
                    <h3 className="text-lg font-semibold">
                      {typedMsme.companyName}
                    </h3>
                    <p className="text-sm">
                      <strong>Email:</strong> {typedMsme.email}
                    </p>
                    <p className="text-sm">
                      <strong>Address:</strong>{" "}
                      {typedMsme.cityMunicipalityAddress}
                    </p>
                    <p className="text-sm">
                      <strong>Contact:</strong> {typedMsme.contactNumber}
                    </p>
                  </div>
                );
              })}

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredMSMEs.length,
                    )}{" "}
                    of {filteredMSMEs.length} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-md bg-gray-200 p-2 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`rounded-md px-3 py-1 ${
                            currentPage === page
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-gray-600 hover:bg-emerald-100"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-md bg-gray-200 p-2 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
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

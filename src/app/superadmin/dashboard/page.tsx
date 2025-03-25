"use client";

import { useEffect, useMemo } from "react";
import { Users, Download, Factory, Store } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
import { ExportsLineChart } from "@/components/dashboard/ExportsLineChart";
import { SectorPieChart } from "@/components/dashboard/SectorPieChart";
import { SECTOR_COLORS } from "@/lib/sector-colors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const { sectors, msmes, isLoading, error } = useMSMEContext();
  const { activeAdmins } = useSuperAdminContext();

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

  // Calculate total MSMEs
  const totalMSMEs = msmes?.length || 0;

  // Loading states
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-emerald-600">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 md:p-6">
      <div className="mb-6 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          MSME Dashboard
        </h2>
        <p className="mt-1 text-center text-base text-gray-600">
          Overview of MSMEs in Iloilo
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-100 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg text-emerald-800">
              Total MSMEs
            </CardTitle>
            <CardDescription>Registered businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-emerald-600">
                {totalMSMEs}
              </p>
              <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                <Store size={25} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg text-emerald-800">Sectors</CardTitle>
            <CardDescription>Business categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-emerald-600">
                {sectors?.length ?? 0}
              </p>
              <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                <Factory size={25} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg text-emerald-800">
              Active Admins
            </CardTitle>
            <CardDescription>Managing the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-emerald-600">
                {activeAdmins?.length ?? 0}
              </p>
              <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                <Users size={25} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg text-emerald-800">
              Data Exports
            </CardTitle>
            <CardDescription>Downloaded reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-emerald-600">
                {totalExports}
              </p>
              <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                <Download size={25} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="border-emerald-100 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Export Statistics</span>
              <Select defaultValue="6months">
                <SelectTrigger className="w-36 border-emerald-200 text-sm">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
            <CardDescription>Monthly data export trends</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ExportsLineChart data={lineChartData} />
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Sector Distribution</span>
            </CardTitle>
            <CardDescription>MSME sector breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <SectorPieChart sectors={sectorChartData} colors={sectorColors} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

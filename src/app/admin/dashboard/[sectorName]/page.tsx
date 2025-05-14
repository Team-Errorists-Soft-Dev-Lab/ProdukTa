"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Store, FileText, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { TopMunicipalitiesChart } from "@/components/admin/municipalityChart";
import { SectorPieChart } from "@/components/admin/sectorPieChart";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportsLineChart } from "@/components/dashboard/ExportsLineChart";
import { useExportDetailsContext } from "@/contexts/ExportDetailsContext";
import { useVisitorContext } from "@/contexts/VisitorContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function MSMEPage({
  params,
}: {
  params: { sectorName: string };
}) {
  const { msmes, sectors, isLoading } = useMSMEContext();
  const { sectorName } = params;
  const { exportDetails, fetchExportDetails, isLoadingExportData } =
    useExportDetailsContext();
  const { visitors, fetchVisitors, isLoadingVisitors } = useVisitorContext();
  const [lineChartData, setLineChartData] = useState<
    { month: string; exports: number }[]
  >([]);
  const [option, setOption] = useState("the last 6 months");

  const sector = sectors.find(
    (sector) =>
      sector.name.toLowerCase().replace(/\s+/g, "") ===
      sectorName.toLowerCase(),
  );

  useEffect(() => {
    fetchExportDetails(sectorName).catch((error) => {
      console.error("Error fetching export details:", error);
    });
    fetchVisitors(sectorName).catch((error) => {
      console.error("Error fetching visitors:", error);
    });
  }, [sectorName]);

  // Filter MSMEs for this sector
  const sectorMSMEs = useMemo(() => {
    return msmes.filter((msme) => msme.sectorId === sector?.id);
  }, [msmes, sector]);

  const formattedData = Object.entries(
    exportDetails?.monthlyExportCounts || {},
  ).map(([month, exports]) => ({
    month: new Date(`${month}-01`).toLocaleString("default", {
      month: "long",
    }), // Convert YYYY-MM to month name
    exports: exports,
  }));

  useEffect(() => {
    if (exportDetails) {
      setLineChartData(formattedData);
    }
  }, [exportDetails]);

  // Calculate total exports from line chart data
  const totalExports = useMemo(() => {
    return lineChartData.reduce((acc, curr) => acc + curr.exports, 0);
  }, [lineChartData]);

  const setExportOption = (value: string) => {
    if (value === "6months") {
      setOption("the last 6 months");
      setLineChartData(
        formattedData.slice(-6).map((data) => ({
          month: data.month,
          exports: data.exports,
        })),
      );
    } else if (value === "year") {
      setOption("the last year");
      setLineChartData(
        formattedData.slice(-12).map((data) => ({
          month: data.month,
          exports: data.exports,
        })),
      );
    } else {
      setOption("all time");
      setLineChartData(formattedData);
    }
  };

  // Calculate sector data for all sectors
  const sectorData = useMemo(() => {
    return sectors.map((s) => ({
      name: s.name,
      value: msmes.filter((msme) => msme.sectorId === s.id).length,
    }));
  }, [sectors, msmes]);

  // Colors for the charts
  const colors = [
    "#996439",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF77FF",
  ];

  // Get top 5 municipalities for this sector
  const topMunicipalities = useMemo(() => {
    const municipalityCounts = new Map<string, number>();

    sectorMSMEs.forEach((msme) => {
      const municipality = msme.cityMunicipalityAddress;
      municipalityCounts.set(
        municipality,
        (municipalityCounts.get(municipality) || 0) + 1,
      );
    });

    return Array.from(municipalityCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [sectorMSMEs]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#996439] border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-[#996439]">
            Loading sector data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 md:p-6">
      <div className="mb-6 rounded-xl border border-[#996439]/20 bg-white p-4 shadow-sm">
        <h2 className="text-center text-2xl font-bold text-[#996439]">
          {sector?.name || sectorName.toUpperCase()} SECTOR DASHBOARD
        </h2>
        <p className="mt-1 text-center text-base text-gray-600">
          Overview of {sector?.name || sectorName} MSMEs in Iloilo
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-[#996439]/20 shadow-sm transition-all duration-200 hover:border-[#996439]/40 hover:shadow-md">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg text-[#996439]">
              Total MSMEs
            </CardTitle>
            <CardDescription>
              In {sector?.name || sectorName} sector
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-[#996439]">
                {sectorMSMEs.length}
              </p>
              <div className="rounded-full bg-amber-100 p-2 text-[#996439]">
                <Store size={25} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#996439]/20 shadow-sm transition-all duration-200 hover:border-[#996439]/40 hover:shadow-md">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg text-[#996439]">
              Top Municipality
            </CardTitle>
            <CardDescription>Highest concentration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold text-[#996439]">
                {topMunicipalities.length > 0
                  ? topMunicipalities[0]?.name
                  : "N/A"}
              </p>
              <div className="rounded-full bg-blue-100 p-2 text-[#996439]">
                <MapPin size={25} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#996439]/20 shadow-sm transition-all duration-200 hover:border-[#996439]/40 hover:shadow-md">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg text-[#996439]">
              Sector Percentage
            </CardTitle>
            <CardDescription>Of total MSMEs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-[#996439]">
                {msmes.length > 0
                  ? Math.round((sectorMSMEs.length / msmes.length) * 100)
                  : 0}
                %
              </p>
              <div className="rounded-full bg-purple-100 p-2 text-[#996439]">
                <FileText size={25} />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoadingExportData ? (
          <div>
            <LoadingSpinner
              size="sm"
              color="primary"
              className="mx-auto mt-4"
              text="Loading export data..."
            />
          </div>
        ) : (
          <Card className="border-[#996439]/20 shadow-sm transition-all duration-200 hover:border-[#996439]/40 hover:shadow-md">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg text-[#996439]">
                Most Exported MSME
              </CardTitle>
              <CardDescription>
                By the top exported MSME: <br />
                <p className="text-md font-bold text-[#996439]">
                  {exportDetails?.msmeDetails?.companyName || "N/A"}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-[#996439]">
                  {exportDetails?.exportCount || 0}
                </p>
                <div className="rounded-full bg-amber-100 p-2 text-[#996439]">
                  <Download size={25} />
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/admin/msme/${sectorName}`}>
                  <Button className="w-full bg-[#996439] font-bold hover:bg-[#ce9261]">
                    <Download className="mr-2 h-4 w-4" /> Export Data
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoadingVisitors ? (
          <div>
            <LoadingSpinner
              size="sm"
              color="primary"
              className="mx-auto mt-4"
              text="Loading Visitors data..."
            />
          </div>
        ) : (
          <Card className="border-[#996439]/20 shadow-sm transition-all duration-200 hover:border-[#996439]/40 hover:shadow-md">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg text-[#996439]">
                Most Visited MSME
              </CardTitle>
              <CardDescription>
                Visit count:{" "}
                {visitors && visitors.length > 0
                  ? visitors[0]?.visitCount
                  : "No data available"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-xl font-bold text-[#996439]">
                  {visitors && visitors.length > 0
                    ? visitors[0]?.msmeData?.companyName
                    : "No data available"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-[#996439]/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center justify-between text-lg text-[#996439]">
              <span>Top 5 Municipalities</span>
              <div className="h-8 w-8"></div> {/* Spacer for alignment */}
            </CardTitle>
            <CardDescription>Geographic distribution</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <TopMunicipalitiesChart sectorName={sectorName} />
          </CardContent>
        </Card>

        <Card className="border-[#996439]/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center justify-between text-lg text-[#996439]">
              <span>Sector Distribution</span>
              <div className="h-8 w-8"></div> {/* Spacer for alignment */}
            </CardTitle>
            <CardDescription>MSME sector breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <SectorPieChart sectors={sectorData} colors={colors} />
          </CardContent>
        </Card>

        <Card className="border-[#996439]/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center justify-between text-lg text-[#996439]">
              <span>Export Statistics</span>
              <Select defaultValue="6months" onValueChange={setExportOption}>
                <SelectTrigger className="w-36 border-[#996439]/20 text-sm">
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
          {!isLoadingExportData ? (
            <div>
              {lineChartData.length === 0 && totalExports === 0 ? (
                <CardContent className="pb-4">
                  <p className="text-center text-gray-500">
                    No export data available for this sector.
                  </p>
                </CardContent>
              ) : (
                <CardContent className="pb-4">
                  <ExportsLineChart data={lineChartData} option={option} />
                </CardContent>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center p-4">
              <LoadingSpinner
                size="sm"
                color="primary"
                className="mx-auto mt-4"
                text="Loading export data..."
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

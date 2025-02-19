"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MSMECardView } from "@/components/admin/DashboardCardView";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { TopMunicipalitiesChart } from "@/components/admin/municipalityChart";
import { SectorPieChart } from "@/components/admin/sectorPieChart";
import { TotalSectorMSMEChart } from "@/components/admin/totalSectorMSMEChart";

export default function MSMEPage({
  params,
}: {
  params: { sectorName: string };
}) {
  const { msmes, sectors, isLoading } = useMSMEContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const { sectorName } = params;
  const sector = sectors.find(
    (sector) =>
      sector.name.toLowerCase().replace(/\s+/g, "") ===
      sectorName.toLowerCase(),
  );
  const [municipalityFilter, setMunicipalityFilter] = useState<string>("");
  const filteredMSMEs = msmes.filter(
    (msme) =>
      msme.sectorId === sector?.id &&
      msme.companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!municipalityFilter ||
        msme.cityMunicipalityAddress
          .toLowerCase()
          .includes(municipalityFilter.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);

  const currentMSMEs = filteredMSMEs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getSectorName = (id: number) => {
    return sectors.find((sector) => sector.id === id)?.name ?? "Unknown Sector";
  };

  const sectorData = useMemo(() => {
    return sectors.map((sector) => ({
      name: sector.name,
      value: msmes.filter((msme) => msme.sectorId === sector.id).length,
    }));
  }, [sectors, msmes]);

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF77FF",
    "#33FFAA",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="w-full">
          <TopMunicipalitiesChart sectorName={sectorName} />
        </div>
        <div className="w-full">
          <SectorPieChart sectors={sectorData} colors={colors} />
        </div>
        <div className="flex w-full flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="rounded-lg border border-[#996439] p-4">
            <div>
              <h1 className="mb-4 text-xl font-bold text-[#996439] sm:text-2xl">
                {sectorName.toUpperCase()} MSME DASHBOARD
              </h1>
              <p className="mb-4 text-base text-[#996439] sm:text-lg">
                Total Registered MSMEs:
              </p>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[200px]">
                  <TotalSectorMSMEChart
                    totalMSMEs={filteredMSMEs.length}
                    sectorName={sectorName}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <Link href={`/admin/export-data/${sectorName}`} className="block">
                <Button className="w-full bg-[#996439] font-bold hover:bg-[#ce9261]">
                  <Download className="mr-2 h-4 w-4" /> Export Data
                </Button>
              </Link>
              <Button
                className="w-full bg-[#996439] font-bold hover:bg-[#ce9261]"
                onClick={() => {
                  setCurrentPage(1);
                  setItemsPerPage(itemsPerPage === 3 ? 99999999 : 3);
                }}
              >
                {itemsPerPage === 3 ? "Display All" : "Display Less"}
              </Button>
              <Input
                type="text"
                placeholder="Search MSMEs..."
                className="w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Input
                type="text"
                placeholder="Filter by Municipality..."
                className="w-full"
                value={municipalityFilter}
                onChange={(e) => setMunicipalityFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <MSMECardView
        msmes={currentMSMEs}
        isLoading={isLoading}
        getSectorName={getSectorName}
      />
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center justify-between border-t pt-4 sm:flex-row">
          <p className="mb-2 text-sm text-gray-500 sm:mb-0">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

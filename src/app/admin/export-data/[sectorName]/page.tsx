"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MSMECardView } from "@/components/admin/exportCardView";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { Download, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function ExportDataPage({
  params,
}: {
  params: { sectorName: string };
}) {
  const { msmes, sectors, isLoading } = useMSMEContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [selectedMSMEs, setSelectedMSMEs] = useState<number[]>([]);
  const [startYear, setStartYear] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [municipalityFilter, setMunicipalityFilter] = useState<string>("");
  const { sectorName } = params;
  const sector = sectors.find(
    (sector) => sector.name.toLowerCase() === sectorName.toLowerCase(),
  );

  const filteredMSMEs = msmes
    .filter(
      (msme) =>
        msme.sectorId === sector?.id &&
        msme.companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!startYear ||
          parseInt(msme.yearEstablished.toString()) >= parseInt(startYear)) &&
        (!endYear ||
          parseInt(msme.yearEstablished.toString()) <= parseInt(endYear)) &&
        (!municipalityFilter ||
          msme.cityMunicipalityAddress
            .toLowerCase()
            .includes(municipalityFilter.toLowerCase())),
    )
    .sort(
      (a, b) =>
        parseInt(b.yearEstablished.toString()) -
        parseInt(a.yearEstablished.toString()),
    );

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);

  const currentMSMEs = filteredMSMEs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getSectorName = (id: number) => {
    return sectors.find((sector) => sector.id === id)?.name ?? "Unknown Sector";
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMSMEs(currentMSMEs.map((msme) => msme.id));
    } else {
      setSelectedMSMEs([]);
    }
  };

  const handleSelectMSME = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedMSMEs([...selectedMSMEs, id]);
    } else {
      setSelectedMSMEs(selectedMSMEs.filter((msmeId) => msmeId !== id));
    }
  };

  const resetAllFilters = () => {
    setStartYear("");
    setEndYear("");
    setMunicipalityFilter("");
    setSearchTerm("");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startYear, endYear, municipalityFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {sectorName.toLocaleUpperCase()} MSME Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <Button className="bg-[#996439] hover:bg-[#ce9261]">
            <Download className="mr-2 h-4 w-4" /> Export Data
            <span className="text-xl font-bold text-white">
              [{selectedMSMEs.length}]
            </span>
          </Button>
          <Button
            className="bg-[#996439] hover:bg-[#ce9261]"
            onClick={() => {
              setCurrentPage(1);
              setItemsPerPage(itemsPerPage === 3 ? 99999999 : 3);
            }}
          >
            {itemsPerPage === 3 ? "Display All" : "Display Less"}
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-lg">
            Total Registered MSMEs:{" "}
            <span className="font-bold">{filteredMSMEs.length}</span>
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="selectAll"
              checked={selectedMSMEs.length === currentMSMEs.length}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            />
            <label
              htmlFor="selectAll"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select All
            </label>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search MSMEs..."
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Filter by Municipality..."
            className="max-w-xs"
            value={municipalityFilter}
            onChange={(e) => setMunicipalityFilter(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Start Year"
              className="w-28"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              min="1900"
              max={new Date().getFullYear().toString()}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="End Year"
              className="w-28"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              min="1900"
              max={new Date().getFullYear().toString()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={resetAllFilters}
              className="h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <MSMECardView
        msmes={currentMSMEs}
        isLoading={isLoading}
        getSectorName={getSectorName}
        selectedMSMEs={selectedMSMEs}
        onSelectMSME={handleSelectMSME}
      />
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
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

"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  bambooMSMEs,
  coconutMSMEs,
  coffeeMSMEs,
  weavingMSMEs,
  foodMSMEs,
} from "@/lib/mock-data";

const allMSMEs = [
  ...bambooMSMEs,
  ...coconutMSMEs,
  ...coffeeMSMEs,
  ...weavingMSMEs,
  ...foodMSMEs,
].map((msme) => ({
  ...msme,
  date: new Date(msme.date),
}));

export default function AllMSMEs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMSMEs, setSelectedMSMEs] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const itemsPerPage = 6;

  const filteredMSMEs = useMemo(() => {
    return allMSMEs.filter((msme) => {
      const matchesSearch = Object.values(msme).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      const matchesDateRange =
        (!startDate || msme.date >= new Date(startDate)) &&
        (!endDate || msme.date <= new Date(endDate));

      return matchesSearch && matchesDateRange;
    });
  }, [searchTerm, startDate, endDate]);

  const paginatedMSMEs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMSMEs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMSMEs, currentPage]);

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);

  const toggleMSMESelection = (id: number) => {
    setSelectedMSMEs((prev) =>
      prev.includes(id) ? prev.filter((eId) => eId !== id) : [...prev, id],
    );
  };

  const toggleAllMSMEs = () => {
    const currentPageIds = paginatedMSMEs.map((msme) => msme.id);
    const allSelected = currentPageIds.every((id) =>
      selectedMSMEs.includes(id),
    );

    if (allSelected) {
      setSelectedMSMEs((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
      setSelectedMSMEs((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const handleExportData = () => {
    const selectedData = allMSMEs.filter((msme) =>
      selectedMSMEs.includes(msme.id),
    );
    console.log("Exporting data:", selectedData);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 lg:flex-row">
      <main className="flex-1 overflow-x-hidden bg-gray-100">
        <div className="p-4 md:p-6">
          <Card className="border-[#996439]">
            <div className="p-6">
              <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h1 className="text-2xl font-bold">All MSMEs</h1>
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                  <div className="relative flex-1 sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-8"
                    />
                  </div>
                  <Button
                    onClick={handleExportData}
                    className="bg-[#996439] text-white hover:bg-[#996439]/90"
                  >
                    Export Data ({selectedMSMEs.length})
                  </Button>
                </div>
              </div>

              <div className="mb-4 flex space-x-4">
                <div>
                  <label className="block text-sm font-medium">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={paginatedMSMEs.every((msme) =>
                      selectedMSMEs.includes(msme.id),
                    )}
                    onCheckedChange={toggleAllMSMEs}
                  />
                  <span className="text-sm">Select All on This Page</span>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedMSMEs.map((msme) => (
                  <Card
                    key={msme.id}
                    className="border-[#996439] transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-lg font-semibold">{msme.name}</h3>
                        <Checkbox
                          checked={selectedMSMEs.includes(msme.id)}
                          onCheckedChange={() => toggleMSMESelection(msme.id)}
                        />
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-semibold">Location:</span>{" "}
                          {msme.address}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {msme.contactNumber}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span>{" "}
                          {msme.date.toDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing 1 to {paginatedMSMEs.length} of {filteredMSMEs.length}{" "}
                  entries
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    {"<"}
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`h-8 w-8 p-0 ${
                          currentPage === page
                            ? "bg-[#996439] text-white hover:bg-[#996439]/90"
                            : ""
                        }`}
                      >
                        {page}
                      </Button>
                    ),
                  )}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    {">"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

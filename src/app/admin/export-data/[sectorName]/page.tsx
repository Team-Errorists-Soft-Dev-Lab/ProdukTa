"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MSMECardView } from "@/components/admin/exportCardView";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { Download, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { sectorName } = params;
  const sector = sectors.find(
    (sector) => sector.name.toLowerCase() === sectorName.toLowerCase(),
  );

  const filteredMSMEs = msmes
    .filter(
      (msme) =>
        msme.sectorId === sector?.id &&
        msme.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (date) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);

  const currentMSMEs = filteredMSMEs.filter((_, index) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return index >= startIndex && index < endIndex;
  });

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
              if (itemsPerPage === 3) {
                setItemsPerPage(999999);
              } else {
                setItemsPerPage(3);
              }
            }}
          >
            Display All
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={date ? "text-emerald-600" : "text-muted-foreground"}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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

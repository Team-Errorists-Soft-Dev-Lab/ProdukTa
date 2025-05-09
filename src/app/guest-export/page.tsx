"use client";

import type React from "react";
import { useCallback, useRef } from "react";
import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMSMEContext } from "@/contexts/MSMEContext";
import Link from "next/link";
import {
  Search,
  MapPin,
  Building,
  Download,
  ArrowUpDown,
  FileText,
  FileDown,
  X,
  Loader2,
  Leaf,
  CoffeeIcon,
  Palmtree,
  Wheat,
  UtensilsCrossed,
  ShoppingBag,
  MonitorSmartphone,
  CheckCircle2,
  CircleOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { MSMEWithSectorName } from "@/types/MSME";
// Import locations with proper error handling
import * as locationModule from "@/lib/iloilo-locations";

const itemsPerPage = 10;

// Define sectors based on the design requirements
const sectorOptions = [
  "Bamboo",
  "Cacao",
  "Coconut",
  "Coffee",
  "Processed Foods",
  "Wearables and Homestyles",
  "IT-BPM",
];

// Map sectors to icons
const sectorIcons: Record<string, React.ReactNode> = {
  Bamboo: <Leaf className="h-4 w-4" />,
  Cacao: <Wheat className="h-4 w-4" />,
  Coconut: <Palmtree className="h-4 w-4" />,
  Coffee: <CoffeeIcon className="h-4 w-4" />,
  "Processed Foods": <UtensilsCrossed className="h-4 w-4" />,
  "Wearables and Homestyles": <ShoppingBag className="h-4 w-4" />,
  "IT-BPM": <MonitorSmartphone className="h-4 w-4" />,
};

// Add this after the sectorOptions constant
const getLocations = () => {
  try {
    // Try different possible exports from the locations module
    if (locationModule.locations) {
      return locationModule.locations;
    } else if (locationModule.default) {
      return locationModule.default;
    } else {
      // If neither exists, return a fallback
      console.warn("Locations not found in import, using fallback data");
      return {
        "Iloilo City": ["City Proper", "Jaro", "La Paz", "Mandurriao", "Molo"],
        "1st District": [
          "Guimbal",
          "Igbaras",
          "Miagao",
          "Oton",
          "San Joaquin",
          "Tigbauan",
          "Tubungan",
        ],
        "2nd District": [
          "Alimodian",
          "Leganes",
          "Leon",
          "New Lucena",
          "Pavia",
          "San Miguel",
          "Santa Barbara",
          "Zarraga",
        ],
        "3rd District": [
          "Badiangan",
          "Bingawan",
          "Cabatuan",
          "Calinog",
          "Janiuay",
          "Lambunao",
          "Maasin",
          "Mina",
          "Pototan",
        ],
        "4th District": [
          "Anilao",
          "Banate",
          "Barotac Nuevo",
          "Dingle",
          "Dueñas",
          "Dumangas",
          "Passi",
          "San Enrique",
        ],
        "5th District": [
          "Ajuy",
          "Balasan",
          "Barotac Viejo",
          "Batad",
          "Carles",
          "Concepcion",
          "Estancia",
          "Lemery",
          "San Dionisio",
          "San Rafael",
          "Sara",
        ],
      };
    }
  } catch (error) {
    console.error("Error loading locations:", error);
    return {};
  }
};

// Type for export data
type ExportMSME = {
  id: string;
  companyName: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  cityMunicipalityAddress: string;
};

export default function GuestPage() {
  const { msmes, sectors, isLoading } = useMSMEContext();
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMSMEs, setSelectedMSMEs] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // PDF Export states
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportData, setExportData] = useState<ExportMSME[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const msmesWithSectorNames = useMemo(() => {
    return msmes.map((msme) => ({
      ...msme,
      sectorName:
        sectors.find((sector) => sector.id === msme.sectorId)?.name ??
        "Unknown Sector",
    }));
  }, [msmes, sectors]);

  // Count MSMEs per sector
  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sectorOptions.forEach((sector) => {
      counts[sector] = msmesWithSectorNames.filter(
        (msme) => msme.sectorName === sector,
      ).length;
    });
    return counts;
  }, [msmesWithSectorNames]);

  const searchMSME = useCallback(
    (query: string) => {
      return msmesWithSectorNames.filter(
        (msme) =>
          msme.companyName.toLowerCase().includes(query.toLowerCase()) ||
          msme.contactPerson?.toLowerCase().includes(query.toLowerCase()) ||
          msme.cityMunicipalityAddress
            ?.toLowerCase()
            .includes(query.toLowerCase()),
      );
    },
    [msmesWithSectorNames],
  );

  const sortMSMEs = (msmes: MSMEWithSectorName[]) => {
    return [...msmes].sort((a, b) => {
      const nameA = a.companyName.toLowerCase();
      const nameB = b.companyName.toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  };

  const displayedMSME = useMemo(() => {
    let filtered = msmesWithSectorNames;

    if (selectedSectors.length > 0) {
      filtered = filtered.filter((msme) =>
        selectedSectors.includes(msme.sectorName),
      );
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((msme) =>
        selectedLocations.includes(msme.cityMunicipalityAddress),
      );
    }

    if (searchQuery) {
      filtered = searchMSME(searchQuery);
    }

    const sorted = sortMSMEs(filtered);

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sorted.slice(startIndex, startIndex + itemsPerPage);
  }, [
    searchQuery,
    msmesWithSectorNames,
    sortOrder,
    selectedSectors,
    selectedLocations,
    currentPage,
    searchMSME,
  ]);

  const totalPages = Math.ceil(
    (searchQuery ? searchMSME(searchQuery) : msmesWithSectorNames).length /
      itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((item) => item !== sector)
        : [...prev, sector],
    );
    setCurrentPage(1);
  };

  const handleToggleAllSectors = () => {
    if (selectedSectors.length === sectorOptions.length) {
      setSelectedSectors([]);
    } else {
      setSelectedSectors([...sectorOptions]);
    }
    setCurrentPage(1);
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location],
    );
    setCurrentPage(1);
  };

  const handleSelectMSME = (id: string) => {
    setSelectedMSMEs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMSMEs([]);
    } else {
      setSelectedMSMEs(displayedMSME.map((msme) => msme.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already reactive through the searchQuery state
    setCurrentPage(1);
  };

  // PDF Export Functions
  const preparePDFExport = async () => {
    setExportLoading(true);
    setExportError(null);

    try {
      // Determine which MSMEs to export
      const msmeIdsToExport =
        selectedMSMEs.length > 0
          ? selectedMSMEs
          : displayedMSME.map((msme) => msme.id);

      // In a real implementation, you would fetch the data from an API
      // For now, we'll just use the data we already have
      const msmeDataToExport = msmesWithSectorNames
        .filter((msme) => msmeIdsToExport.includes(msme.id))
        .map((msme) => ({
          id: msme.id,
          companyName: msme.companyName,
          contactPerson: msme.contactPerson || "N/A",
          contactNumber: msme.contactNumber || "N/A",
          email: msme.email || "N/A",
          cityMunicipalityAddress: msme.cityMunicipalityAddress,
        }));

      setExportData(msmeDataToExport);
      setShowExportDialog(true);
    } catch (error) {
      console.error("Error preparing PDF export:", error);
      setExportError("Failed to prepare data for export");
    } finally {
      setExportLoading(false);
    }
  };

  const generatePDFContent = (
    msme: ExportMSME,
    actualMsmeWidth: number,
    actualMsmeHeight: number,
  ) => {
    const msmeElement = document.createElement("div");
    msmeElement.style.padding = "15px";
    msmeElement.style.borderRadius = "5px";
    msmeElement.style.width = `${actualMsmeWidth}mm`;
    msmeElement.style.height = `${actualMsmeHeight}mm`;
    msmeElement.style.overflow = "hidden";
    msmeElement.style.position = "relative";
    msmeElement.style.zIndex = "1";

    // Add gradient background
    const backgroundDiv = document.createElement("div");
    backgroundDiv.style.position = "absolute";
    backgroundDiv.style.top = "0";
    backgroundDiv.style.left = "0";
    backgroundDiv.style.width = "100%";
    backgroundDiv.style.height = "100%";

    backgroundDiv.style.zIndex = "-1";
    msmeElement.appendChild(backgroundDiv);

    // Content container with relative positioning
    const contentDiv = document.createElement("div");
    contentDiv.style.position = "relative";
    contentDiv.style.zIndex = "2";
    contentDiv.innerHTML = `
      <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">${msme.companyName}</h2>
      <p style="font-size: 14px; margin: 6px 0;"><strong>Contact Person:</strong> ${msme.contactPerson}</p>
      <p style="font-size: 14px; margin: 6px 0;">📞 ${msme.contactNumber}</p>
      <p style="font-size: 14px; margin: 6px 0;">✉️ ${msme.email}</p>
      <p style="font-size: 14px; margin: 6px 0;">📍 ${msme.cityMunicipalityAddress}</p>
    `;
    msmeElement.appendChild(contentDiv);

    return msmeElement;
  };

  const exportToPDF = async () => {
    if (!contentRef.current || exportData.length === 0) return;

    setExportLoading(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const margin = 10;
      const contentWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      const contentHeight = pdf.internal.pageSize.getHeight() - 2 * margin;
      const msmePerPage = 8;

      const msmeWidth = contentWidth / 2 - 5; // 2 columns with 5mm gap
      const msmeHeight = contentHeight / 4 - 5; // 4 rows with 5mm gap

      // Load the logo
      const logoImg = document.createElement("img");
      logoImg.src = "/DTI_logo.png";
      await new Promise<void>((resolve) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => resolve(); // Continue even if logo fails to load
      });

      for (let i = 0; i < exportData.length; i += msmePerPage) {
        if (i > 0) pdf.addPage();

        const pageContent = document.createElement("div");
        pageContent.style.width = `${contentWidth}mm`;
        pageContent.style.height = `${contentHeight}mm`;
        pageContent.style.display = "flex";
        pageContent.style.flexDirection = "column";
        pageContent.style.gap = "5mm";
        pageContent.style.position = "relative";

        // Add logo and text to the top of each page
        const headerContainer = document.createElement("div");
        headerContainer.style.width = `${contentWidth}mm`;
        headerContainer.style.height = "20mm";
        headerContainer.style.display = "flex";
        headerContainer.style.alignItems = "center";
        headerContainer.style.justifyContent = "flex-start";
        headerContainer.style.gap = "10px";

        const logoContainer = document.createElement("div");
        logoContainer.style.width = "100px";
        logoContainer.style.height = "100px";
        const logo = logoImg.cloneNode(true) as HTMLImageElement;
        logo.style.width = "100%";
        logo.style.height = "100%";
        logo.style.objectFit = "contain";
        logoContainer.appendChild(logo);

        const textContainer = document.createElement("div");
        textContainer.style.display = "flex";
        textContainer.style.flexDirection = "column";
        textContainer.style.justifyContent = "center";

        const titleText = document.createElement("h2");
        titleText.textContent = "ILOILO MSMEs";
        titleText.style.fontSize = "16px";
        titleText.style.fontWeight = "bold";
        titleText.style.margin = "0";

        textContainer.appendChild(titleText);

        headerContainer.appendChild(logoContainer);
        headerContainer.appendChild(textContainer);
        pageContent.appendChild(headerContainer);

        // MSME content container
        const msmeContainer = document.createElement("div");
        msmeContainer.style.display = "grid";
        msmeContainer.style.gridTemplateColumns = `repeat(2, 1fr)`;
        msmeContainer.style.gap = "5mm";

        const msmesOnThisPage = Math.min(msmePerPage, exportData.length - i);

        for (let j = 0; j < msmesOnThisPage; j++) {
          const msme = exportData[i + j];
          if (!msme) continue;

          const msmeElement = generatePDFContent(msme, msmeWidth, msmeHeight);
          msmeContainer.appendChild(msmeElement);
        }

        pageContent.appendChild(msmeContainer);

        document.body.appendChild(pageContent);
        const canvas = await html2canvas(pageContent);
        document.body.removeChild(pageContent);

        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          contentWidth,
          contentHeight,
        );
      }

      pdf.save("msme_data.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setExportError("Failed to generate PDF");
    } finally {
      setExportLoading(false);
    }
  };

  const exportToCSV = () => {
    // Determine which MSMEs to export
    const msmeIdsToExport =
      selectedMSMEs.length > 0
        ? selectedMSMEs
        : displayedMSME.map((msme) => msme.id);

    // Get the data to export
    const msmeDataToExport = msmesWithSectorNames
      .filter((msme) => msmeIdsToExport.includes(msme.id))
      .map((msme) => ({
        companyName: msme.companyName,
        contactPerson: msme.contactPerson || "N/A",
        contactNumber: msme.contactNumber || "N/A",
        email: msme.email || "N/A",
        cityMunicipalityAddress: msme.cityMunicipalityAddress,
        sector: msme.sectorName,
      }));

    if (msmeDataToExport.length === 0) {
      return;
    }

    // Create CSV header row
    const headers = [
      "Company Name",
      "Contact Person",
      "Contact Number",
      "Email",
      "Location",
      "Sector",
    ];

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    // Add data rows
    msmeDataToExport.forEach((msme) => {
      // Properly escape fields that might contain commas
      const row = [
        `"${msme.companyName.replace(/"/g, '""')}"`,
        `"${msme.contactPerson.replace(/"/g, '""')}"`,
        `"${msme.contactNumber.replace(/"/g, '""')}"`,
        `"${msme.email.replace(/"/g, '""')}"`,
        `"${msme.cityMunicipalityAddress.replace(/"/g, '""')}"`,
        `"${msme.sector.replace(/"/g, '""')}"`,
      ].join(",");
      csvContent += row + "\n";
    });

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link and trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "msme_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPaginationItems = () => {
    const items = [];

    // Helper function to add page number
    const addPageNumber = (pageNum: number) => {
      items.push(
        <PaginationItem key={pageNum}>
          <PaginationLink
            onClick={() => handlePageChange(pageNum)}
            isActive={currentPage === pageNum}
            className={cn(
              "min-w-9 rounded-md transition-colors",
              currentPage === pageNum
                ? "bg-[#8B4513] text-white hover:bg-[#A0522D]"
                : "text-[#8B4513] hover:bg-[#8B4513]/10",
            )}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>,
      );
    };

    // Always show first page
    if (totalPages > 0) {
      addPageNumber(1);
    }

    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      for (let i = 2; i <= totalPages; i++) {
        addPageNumber(i);
      }
    } else {
      if (currentPage <= 4) {
        // Near start
        for (let i = 2; i <= 5; i++) {
          addPageNumber(i);
        }
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis className="text-[#8B4513]" />
          </PaginationItem>,
        );
      } else if (currentPage >= totalPages - 3) {
        // Near end
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="text-[#8B4513]" />
          </PaginationItem>,
        );
        for (let i = totalPages - 4; i < totalPages; i++) {
          addPageNumber(i);
        }
      } else {
        // In middle
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="text-[#8B4513]" />
          </PaginationItem>,
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          addPageNumber(i);
        }
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis className="text-[#8B4513]" />
          </PaginationItem>,
        );
      }

      // Always show last page
      if (totalPages > 1) {
        addPageNumber(totalPages);
      }
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main banner with refined gradient */}
      <main className="bg-gradient-to-r from-[#8B4513] via-[#9E5D28] to-[#A0522D] px-6 py-10 shadow-md">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-center text-3xl font-light tracking-tight text-white sm:text-4xl">
            Export MSMEs
          </h1>

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <form
              onSubmit={handleSearch}
              className="relative w-full flex-1 sm:w-auto"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search"
                className="w-full rounded-full border-transparent bg-white/90 pl-10 pr-4 text-[#8B4513] shadow-sm backdrop-blur-sm transition-all focus-visible:border-white focus-visible:bg-white focus-visible:shadow-md"
              />
            </form>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full border-transparent bg-white/90 text-[#8B4513] shadow-sm backdrop-blur-sm transition-all hover:border-white hover:bg-white hover:shadow-md"
                >
                  Sort by <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl">
                <DropdownMenuItem
                  onClick={() => setSortOrder("asc")}
                  className="rounded-md"
                >
                  A to Z {sortOrder === "asc" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortOrder("desc")}
                  className="rounded-md"
                >
                  Z to A {sortOrder === "desc" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </main>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-light tracking-tight text-[#8B4513]">
            List of MSMEs
          </h2>

          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full border-[#8B4513]/20 bg-white text-[#8B4513] shadow-sm transition-all hover:border-[#8B4513] hover:shadow-md"
                >
                  <Building className="mr-2 h-4 w-4" /> Select Sector
                  {selectedSectors.length > 0 && (
                    <Badge className="ml-2 bg-[#8B4513] text-white">
                      {selectedSectors.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 rounded-xl p-0 shadow-lg">
                <div className="border-b border-gray-100 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium text-[#8B4513]">
                      Select Sectors
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleAllSectors}
                      className="h-8 text-xs text-gray-500 hover:text-[#8B4513]"
                    >
                      {selectedSectors.length === sectorOptions.length ? (
                        <>
                          <CircleOff className="mr-1 h-3 w-3" /> Deselect All
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Select All
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="mb-2 text-xs text-gray-500">
                    {selectedSectors.length} of {sectorOptions.length} sectors
                    selected
                  </p>
                </div>

                <div className="max-h-[300px] overflow-y-auto p-3">
                  {sectorOptions.map((sector) => (
                    <div
                      key={sector}
                      onClick={() => handleSectorToggle(sector)}
                      className={cn(
                        "mb-2 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-all",
                        selectedSectors.includes(sector)
                          ? "bg-[#8B4513] text-white hover:bg-[#A0522D]"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          selectedSectors.includes(sector)
                            ? "bg-white/20"
                            : "bg-white",
                        )}
                      >
                        {sectorIcons[sector] || (
                          <Building className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{sector}</p>
                        <p
                          className={cn(
                            "text-xs",
                            selectedSectors.includes(sector)
                              ? "text-white/70"
                              : "text-gray-500",
                          )}
                        >
                          {sectorCounts[sector] || 0} MSMEs
                        </p>
                      </div>
                      {selectedSectors.includes(sector) && (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      )}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full border-[#8B4513]/20 bg-white text-[#8B4513] shadow-sm transition-all hover:border-[#8B4513] hover:shadow-md"
                >
                  <MapPin className="mr-2 h-4 w-4" /> Select Location
                  {selectedLocations.length > 0 && (
                    <Badge className="ml-2 bg-[#8B4513] text-white">
                      {selectedLocations.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-h-[300px] w-56 overflow-y-auto rounded-xl p-4 shadow-lg">
                <div className="space-y-3">
                  {Object.entries(getLocations()).map(([district, places]) => (
                    <div key={district} className="mb-3">
                      <h3 className="mb-2 text-sm font-semibold text-[#8B4513]">
                        {district}
                      </h3>
                      {Array.isArray(places) &&
                        places.map((location) => (
                          <div
                            key={location}
                            className="mb-1.5 ml-2 flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`location-${location}`}
                              checked={selectedLocations.includes(location)}
                              onCheckedChange={() =>
                                handleLocationToggle(location)
                              }
                              className="rounded-sm border-[#8B4513]/30 data-[state=checked]:bg-[#8B4513] data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor={`location-${location}`}
                              className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {location}
                            </label>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                disabled={selectedMSMEs.length === 0}
              >
                <Button
                  className="rounded-full bg-[#8B4513] text-white shadow-sm transition-all hover:bg-[#A0522D] hover:shadow-md"
                  disabled={selectedMSMEs.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl">
                <DropdownMenuItem
                  onClick={preparePDFExport}
                  className="rounded-md"
                >
                  <FileText className="mr-2 h-4 w-4" /> PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToCSV} className="rounded-md">
                  <FileDown className="mr-2 h-4 w-4" /> CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {(selectedSectors.length > 0 || selectedLocations.length > 0) && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50/50 p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-gray-500">
              Active Filters
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedSectors.map((sector) => (
                <Badge
                  key={sector}
                  variant="outline"
                  className="rounded-full border-[#8B4513]/20 bg-white px-3 py-1 text-[#8B4513] shadow-sm transition-all hover:border-[#8B4513]/40"
                  onClick={() => handleSectorToggle(sector)}
                >
                  {sector} <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}

              {selectedLocations.map((location) => (
                <Badge
                  key={location}
                  variant="outline"
                  className="rounded-full border-[#8B4513]/20 bg-white px-3 py-1 text-[#8B4513] shadow-sm transition-all hover:border-[#8B4513]/40"
                  onClick={() => handleLocationToggle(location)}
                >
                  {location} <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          {selectedMSMEs.length > 0 && (
            <div className="border-b border-gray-200 bg-[#8B4513]/5 px-6 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-[#8B4513]">
                    {selectedMSMEs.length}
                  </span>{" "}
                  item
                  {selectedMSMEs.length !== 1 && "s"} selected
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full text-[#8B4513] hover:bg-[#8B4513]/10"
                    onClick={() => setSelectedMSMEs([])}
                  >
                    Clear selection
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-[50px] border-b-2 border-r border-gray-200">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className="rounded-sm border-[#8B4513]/30 data-[state=checked]:bg-[#8B4513] data-[state=checked]:text-white"
                    />
                  </TableHead>
                  <TableHead className="border-b-2 border-r border-gray-200 font-medium text-[#8B4513]">
                    NAME
                  </TableHead>
                  <TableHead className="border-b-2 border-r border-gray-200 font-medium text-[#8B4513]">
                    Location
                  </TableHead>
                  <TableHead className="border-b-2 border-r border-gray-200 font-medium text-[#8B4513]">
                    Sector
                  </TableHead>
                  <TableHead className="border-b-2 border-r border-gray-200 font-medium text-[#8B4513]">
                    Contact Person
                  </TableHead>
                  <TableHead className="border-b-2 border-gray-200 font-medium text-[#8B4513]">
                    Phone
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedMSME.length > 0 ? (
                  displayedMSME.map((msme, index) => (
                    <TableRow
                      key={msme.id}
                      className={cn(
                        "transition-colors hover:bg-gray-50",
                        selectedMSMEs.includes(msme.id) && "bg-[#8B4513]/5",
                      )}
                    >
                      <TableCell className="border-r border-gray-100">
                        <Checkbox
                          checked={selectedMSMEs.includes(msme.id)}
                          onCheckedChange={() => handleSelectMSME(msme.id)}
                          aria-label={`Select ${msme.companyName}`}
                          className="rounded-sm border-[#8B4513]/30 data-[state=checked]:bg-[#8B4513] data-[state=checked]:text-white"
                        />
                      </TableCell>
                      <TableCell className="border-r border-gray-100 font-medium text-[#8B4513]">
                        <Link
                          href={`/msme/${msme.id}`}
                          className="transition-colors hover:text-[#A0522D] hover:underline"
                        >
                          {msme.companyName}
                        </Link>
                      </TableCell>
                      <TableCell className="border-r border-gray-100 text-gray-600">
                        {msme.cityMunicipalityAddress}
                      </TableCell>
                      <TableCell className="border-r border-gray-100 text-gray-600">
                        {msme.sectorName}
                      </TableCell>
                      <TableCell className="border-r border-gray-100 text-gray-600">
                        {msme.contactPerson || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {msme.contactNumber || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 text-gray-500">
                        <div className="rounded-full bg-gray-100 p-3">
                          <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-lg font-light">No results found</p>
                        <p className="text-sm text-gray-400">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={cn(
                      "rounded-full border-[#8B4513]/20 text-[#8B4513] transition-colors hover:bg-[#8B4513]/10",
                      currentPage === 1 && "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={cn(
                      "rounded-full border-[#8B4513]/20 text-[#8B4513] transition-colors hover:bg-[#8B4513]/10",
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* PDF Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#8B4513]">
              Export Data
            </DialogTitle>
            <DialogDescription>
              Selected MSMEs: {exportData.length}
            </DialogDescription>
          </DialogHeader>

          <div ref={contentRef} className="px-0">
            {exportError && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-red-500">
                {exportError}
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px] text-center">#</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportData.map((msme, index) => (
                    <TableRow key={msme.id || index}>
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {msme.companyName}
                      </TableCell>
                      <TableCell>{msme.contactPerson}</TableCell>
                      <TableCell>{msme.contactNumber}</TableCell>
                      <TableCell>{msme.email}</TableCell>
                      <TableCell>{msme.cityMunicipalityAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={exportToPDF}
              className="bg-[#8B4513] hover:bg-[#A0522D]"
              disabled={exportLoading || exportData.length === 0}
            >
              {exportLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export to PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ExportMSME } from "@/types/MSME";

export default function ExportData() {
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [msmeData, setMsmeData] = useState<ExportMSME[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    try {
      const selectedIdParam = searchParams.get("selectedId");
      if (selectedIdParam) {
        const parsedIds = JSON.parse(selectedIdParam) as string[];
        setSelectedId(parsedIds);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error parsing selectedId:", error);
      setError("Invalid selected IDs format");
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchMsmeData = async () => {
      if (selectedId.length === 0 || hasFetchedRef.current) return;

      try {
        const response = await fetch(`/api/pdf?ids=${selectedId.join(",")}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = ((await response.json()) as { msmes: ExportMSME[] }).msmes;
        setMsmeData(data);
        hasFetchedRef.current = true;
      } catch (error) {
        console.error("Error fetching MSME data:", error);
        setError("Failed to fetch MSME data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMsmeData().catch((error) => {
      console.error("Error in fetchMsmeData:", error);
    });
  }, [selectedId]);

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
      <p style="font-size: 14px; margin: 6px 0;">📞 +63 ${msme.contactNumber}</p>
      <p style="font-size: 14px; margin: 6px 0;">✉️ ${msme.email}</p>
      <p style="font-size: 14px; margin: 6px 0;">📍 ${msme.cityMunicipalityAddress}</p>
    `;
    msmeElement.appendChild(contentDiv);

    return msmeElement;
  };

  const recordExport = async (msmeId: string) => {
    try {
      await fetch("/api/admin/export", {
        method: "POST",
        body: JSON.stringify({ msmeId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error recording export:", error);
    }
  };

  const exportToPDF = async () => {
    // note: call analytics api here to trigger increase in export count

    if (!contentRef.current) return;

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

    for (let i = 0; i < msmeData.length; i += msmePerPage) {
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

      const msmesOnThisPage = Math.min(msmePerPage, msmeData.length - i);

      for (let j = 0; j < msmesOnThisPage; j++) {
        const msme = msmeData[i + j];
        if (!msme) continue;

        const msmeElement = generatePDFContent(msme, msmeWidth, msmeHeight);
        msmeContainer.appendChild(msmeElement);
      }

      pageContent.appendChild(msmeContainer);

      document.body.appendChild(pageContent);
      const canvas = await html2canvas(pageContent);
      document.body.removeChild(pageContent);

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight);
    }

    pdf.save("msme_data.pdf");

    for (const id of selectedId) {
      if (id !== undefined) {
        await recordExport(id);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="border-[#996439]/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Export Data</CardTitle>
            <CardDescription className="mt-1">
              Selected MSMEs: {msmeData.length}
            </CardDescription>
          </div>
          <Button
            onClick={exportToPDF}
            className="bg-amber-800 hover:bg-[#996439]"
            disabled={isLoading || msmeData.length === 0}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export to PDF
          </Button>
        </CardHeader>
        <CardContent ref={contentRef} className="px-0">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-500">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#996439]" />
              <span className="ml-2">Loading MSMEs data...</span>
            </div>
          ) : msmeData.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-gray-500">
              No MSMEs selected for export
            </div>
          ) : (
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
                  {msmeData.map((msme, index) => (
                    <TableRow key={msme.id || index}>
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {msme.companyName}
                      </TableCell>
                      <TableCell>{msme.contactPerson}</TableCell>
                      <TableCell>
                        {msme.contactNumber
                          ? `+63 ${msme.contactNumber}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>{msme.email}</TableCell>
                      <TableCell>{msme.cityMunicipalityAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

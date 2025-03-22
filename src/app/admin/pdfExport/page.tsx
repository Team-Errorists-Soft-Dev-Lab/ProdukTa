"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface MSME {
  id: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  cityMunicipalityAddress: string;
  companyName: string;
  products: string[];
}

export default function ExportData() {
  const searchParams = useSearchParams();
  const selectedId: string[] = JSON.parse(
    searchParams.get("selectedId") ?? "[]",
  ) as string[];

  const [msmeData, setMsmeData] = useState<MSME[]>([]);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMsmeData = async () => {
      try {
        const response = await fetch(`/api/pdf?ids=${selectedId.join(",")}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = ((await response.json()) as { msmes: MSME[] }).msmes;
        setMsmeData(data);
      } catch (error) {
        console.error("Error fetching MSME data:", error);
        setError("Failed to fetch MSME data");
      }
    };

    if (selectedId.length > 0) {
      void fetchMsmeData();
    }
  }, []);

  const generatePDFContent = (
    msme: MSME,
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
      // pageContent.style.background =
      //   "linear-gradient(135deg, #e6f3ff 0%, #ffffff 50%, #ffebeb 100%)";

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

    for (let i = 0; i < selectedId.length; i++) {
      const id = selectedId[i];
      if (id !== undefined) {
        await recordExport(id);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-300 p-4">
      <h1 className="mb-4 text-2xl font-bold">Selected MSMEs</h1>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={exportToPDF}
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      >
        Export to PDF
      </button>
      <div
        ref={contentRef}
        className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3"
      >
        {msmeData.length > 0 ? (
          msmeData.map((msme, index) => (
            <div key={index} className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-xl font-bold">{msme.companyName}</h2>
              <p>Contact Person: {msme.contactPerson}</p>
              <p>Contact Number: {msme.contactNumber}</p>
              <p>Email: {msme.email}</p>
              <p>Address: {msme.cityMunicipalityAddress}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                {Array.isArray(msme.products) &&
                  msme.products.slice(0, 8).map((product, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border bg-gray-50 p-4 text-center shadow-md"
                    >
                      {product}
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p>Loading MSMEs data...</p>
        )}
      </div>
    </div>
  );
}

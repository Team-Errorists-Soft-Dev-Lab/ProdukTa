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

  const exportToPDF = async () => {
    if (!contentRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 10;
    const contentWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
    const contentHeight = pdf.internal.pageSize.getHeight() - 2 * margin;
    const msmePerPage = 8;

    const msmeWidth = contentWidth / 2 - 5; // 2 columns with 5mm gap
    const msmeHeight = contentHeight / 4 - 5; // 4 rows with 5mm gap

    for (let i = 0; i < msmeData.length; i += msmePerPage) {
      if (i > 0) pdf.addPage();

      const pageContent = document.createElement("div");
      pageContent.style.width = `${contentWidth}mm`;
      pageContent.style.height = `${contentHeight}mm`;
      pageContent.style.display = "grid";
      pageContent.style.gap = "5mm";

      const msmesOnThisPage = Math.min(msmePerPage, msmeData.length - i);
      const columns = msmesOnThisPage > 4 ? 2 : 1;
      const rows = Math.ceil(msmesOnThisPage / columns);

      pageContent.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      pageContent.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

      const actualMsmeWidth = columns === 1 ? contentWidth : msmeWidth;
      const actualMsmeHeight = contentHeight / rows - 5;

      for (let j = 0; j < msmesOnThisPage; j++) {
        const msme = msmeData[i + j];
        if (!msme) continue;

        const msmeElement = document.createElement("div");
        msmeElement.style.padding = "15px";
        // msmeElement.style.border = "1px solid #ccc";
        msmeElement.style.borderRadius = "5px";
        //msmeElement.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
        msmeElement.style.width = `${actualMsmeWidth}mm`;
        msmeElement.style.height = `${actualMsmeHeight}mm`;
        msmeElement.style.overflow = "hidden";
        msmeElement.innerHTML = `
          <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">${msme.companyName}</h2>
          <p style="font-size: 14px; margin: 6px 0;"><strong>Contact:</strong> ${msme.contactPerson}</p>
          <p style="font-size: 14px; margin: 6px 0;"><strong>Phone:</strong> ${msme.contactNumber}</p>
          <p style="font-size: 14px; margin: 6px 0;"><strong>Email:</strong> ${msme.email}</p>
          <p style="font-size: 14px; margin: 6px 0;"><strong>Address:</strong> ${msme.cityMunicipalityAddress}</p>
        `;
        pageContent.appendChild(msmeElement);
      }

      document.body.appendChild(pageContent);
      const canvas = await html2canvas(pageContent);
      document.body.removeChild(pageContent);

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight);
    }

    pdf.save("msme_data.pdf");
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

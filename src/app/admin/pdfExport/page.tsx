"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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

  return (
    <div className="grid min-h-screen place-items-center bg-gray-100 p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">Selected MSMEs</h1>
      {error && <p className="text-center text-red-500">{error}</p>}
      {Array.isArray(msmeData) && msmeData.length > 0 ? (
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {msmeData.map((msme, index) => (
            <div key={index} className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-2 text-xl font-bold">{msme.companyName}</h2>
              <p>Contact Person: {msme.contactPerson}</p>
              <p>Contact Number: {msme.contactNumber}</p>
              <p>City/Municipality Address: {msme.cityMunicipalityAddress}</p>
              <p>Email: {msme.email}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                {msme.products?.slice(0, 8).map((product, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border bg-gray-50 p-4 text-center shadow-md"
                  >
                    {product}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No MSME data available</p>
      )}
    </div>
  );
}

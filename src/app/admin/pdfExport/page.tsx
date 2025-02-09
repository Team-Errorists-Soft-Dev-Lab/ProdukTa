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
        console.log(selectedId.join(","));
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = ((await response.json()) as { msmes: MSME[] }).msmes;
        setMsmeData(data);
        console.log("MSME data:", data);
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
    <div>
      <h1>Selected MSMEs</h1>
      {error && <p>{error}</p>}
      {Array.isArray(msmeData) && msmeData.length > 0 ? (
        msmeData.map((msme, index) => (
          <div key={index}>
            <p>Company Name: {msme.companyName}</p>
            <p>Contact Person: {msme.contactPerson}</p>
            <p>Contact Number: {msme.contactNumber}</p>
            <p>Email: {msme.email}</p>
            <p>City/Municipality Address: {msme.cityMunicipalityAddress}</p>
          </div>
        ))
      ) : (
        <p>No MSME data available</p>
      )}
    </div>
  );
}

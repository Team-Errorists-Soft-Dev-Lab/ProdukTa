"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";

interface MSME {
  id: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  cityMunicipalityAddress: string;
  companyName: string;
  products: string[];
}

export default function ExportToCSV() {
  const searchParams = useSearchParams();
  const selectedId: string[] = JSON.parse(
    searchParams.get("selectedId") ?? "[]",
  ) as string[];

  const [msmeData, setMsmeData] = useState<MSME[]>([]);
  const [error, setError] = useState<string | null>(null);

  console.log("selectedId: ", selectedId);

  const headers = [
    { label: "ID", key: "id" },
    { label: "Contact Person", key: "contactPerson" },
    { label: "Contact Number", key: "contactNumber" },
    { label: "Email", key: "email" },
    { label: "City/Municipality Address", key: "cityMunicipalityAddress" },
    { label: "Company Name", key: "companyName" },
    { label: "Products", key: "products" },
  ];

  useEffect(() => {
    const fetchMsmeData = async () => {
      try {
        const response = await fetch(`/api/pdf?ids=${selectedId.join(",")}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = ((await response.json()) as { msmes: MSME[] }).msmes;
        console.log("data: ", data);
        setMsmeData(data);
      } catch (error) {
        console.error("Error fetching MSME data:", error);
        setError("Failed to fetch MSME data");
      }
    };

    if (selectedId.length > 0) {
      void fetchMsmeData();
    } else {
      setError("No data to export");
    }
  }, []);

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <div>
          <Button className="float-right mt-4">
            <CSVLink data={msmeData} headers={headers} filename="msme-data.csv">
              Export to CSV
            </CSVLink>
          </Button>
          <br />
          <table className="mt-4 w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header.key} className="border border-gray-400 p-2">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {msmeData.map((msme) => (
                <tr key={msme.id}>
                  {headers.map((header) => {
                    const value = msme[header.key as keyof MSME];
                    return (
                      <td
                        key={header.key}
                        className="border border-gray-400 p-2"
                      >
                        {Array.isArray(value) ? value.join(", ") : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

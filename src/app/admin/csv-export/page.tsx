"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CSVLink } from "react-csv";
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

interface MSME {
  id: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  cityMunicipalityAddress: string;
  companyName: string;
  products: string[];
  sectorId?: number;
  dti_number?: string;
}

const csvHeaders = [
  { label: "Company Name", key: "companyName" },
  { label: "Contact Person", key: "contactPerson" },
  { label: "Contact Number", key: "contactNumber" },
  { label: "Email", key: "email" },
  { label: "City/Municipality", key: "cityMunicipalityAddress" },
  { label: "DTI Number", key: "dti_number" },
];

export default function CSVExportPage() {
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [msmeData, setMsmeData] = useState<MSME[]>([]);
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
        const data = ((await response.json()) as { msmes: MSME[] }).msmes;
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

  return (
    <div className="container mx-auto p-4">
      <Card className="border-[#996439]/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">
              Export CSV Data
            </CardTitle>
            <CardDescription className="mt-1">
              Selected MSMEs: {msmeData.length}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {!isLoading && msmeData.length > 0 ? (
              <CSVLink
                data={msmeData}
                headers={csvHeaders}
                filename="msme_data.csv"
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#996439] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </CSVLink>
            ) : (
              <Button disabled className="bg-amber-800 opacity-50">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export to CSV
              </Button>
            )}
          </div>
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
                    <TableHead>DTI Number</TableHead>
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
                      <TableCell>{msme.contactNumber}</TableCell>
                      <TableCell>{msme.email}</TableCell>
                      <TableCell>{msme.cityMunicipalityAddress}</TableCell>
                      <TableCell>{msme.dti_number}</TableCell>
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

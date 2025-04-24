"use client";

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { MSME } from "@/types/MSME";

interface ExportDetails {
  msmeDetails: MSME;
  exportCount: number;
  totalExports: number;
  monthlyExportCounts: Record<string, number>;
  message?: string;
}

interface ExportDetailsContextType {
  exportDetails: ExportDetails | null;
  isLoadingExportData: boolean;
  error: Error | null;
  fetchExportDetails: (sectorName: string) => Promise<void>;
}

const ExportDetailsContext = createContext<
  ExportDetailsContextType | undefined
>(undefined);

export const ExportDetailsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [exportDetails, setExportDetails] = useState<ExportDetails | null>(
    null,
  );
  const [isLoadingExportData, setIsLoadingExportData] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchExportDetails = async (sectorName: string) => {
    setIsLoadingExportData(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/export/${sectorName}`);
      if (!response.ok) {
        const errorMessage = `Failed to fetch export details: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as ExportDetails;
      console.log("Export details data:", data);

      if (data.message === "No MSME found") {
        setExportDetails(null);
        toast.error("No MSME found for this sector.");
      } else {
        setExportDetails(data);
        toast.success("Export details fetched successfully.");
      }
    } catch (err) {
      console.error("Error fetching export details:", err);
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred"),
      );
      toast.error("Failed to fetch export details.");
    } finally {
      setIsLoadingExportData(false);
    }
  };

  return (
    <ExportDetailsContext.Provider
      value={{
        exportDetails,
        isLoadingExportData,
        error,
        fetchExportDetails,
      }}
    >
      {children}
    </ExportDetailsContext.Provider>
  );
};

export const useExportDetailsContext = () => {
  const context = useContext(ExportDetailsContext);
  if (!context) {
    throw new Error(
      "useExportDetailsContext must be used within ExportDetailsProvider",
    );
  }
  return context;
};

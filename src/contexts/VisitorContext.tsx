"use client";

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { MSME } from "@/types/MSME";

interface Visitor {
  msmeId: number;
  visitCount: number;
  msmeData: MSME;
}

interface VisitorContextType {
  visitors: Visitor[] | null;
  isLoadingVisitors: boolean;
  error: Error | null;
  fetchVisitors: (sectorName: string) => Promise<void>;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const VisitorProvider = ({ children }: { children: ReactNode }) => {
  const [visitors, setVisitors] = useState<Visitor[] | null>(null);
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVisitors = async (sectorName: string) => {
    setIsLoadingVisitors(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/visitors/${sectorName}`);
      if (!response.ok) {
        const errorMessage = `Failed to fetch visitors: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.error) {
        setVisitors(null);
        toast.error(data.error);
      } else {
        setVisitors(data.results);
        toast.success("Visitor data fetched successfully.");
      }
    } catch (err) {
      console.error("Error fetching visitors:", err);
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred"),
      );
      toast.error("Failed to fetch visitor data.");
    } finally {
      setIsLoadingVisitors(false);
    }
  };

  return (
    <VisitorContext.Provider
      value={{
        visitors,
        isLoadingVisitors,
        error,
        fetchVisitors,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitorContext = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error("useVisitorContext must be used within VisitorProvider");
  }
  return context;
};

// contexts/AdminContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

// Define the shape of the AdminContext
interface AdminContextType {
  msmes: MSME[];
  addMSME: (msme: MSME) => void;
  updateMSME: (msme: MSME) => void;
  deleteMSME: (id: number) => void;
}

interface MSME {
  id: number;
  companyName: string;
  companyDescription: string;
  companyLogo: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  provinceAddress: string;
  cityMunicipalityAddress: string;
  barangayAddress: string;
  yearEstablished: number;
  dti_number: number;
  sectorId: number;
}

interface MSMEResponse {
  msmes: MSME[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [msmes, setMSMEs] = useState<MSME[]>([]);

  const fetchMSMEs = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (!response.ok) throw new Error("Failed to fetch MSMEs");

      const data = (await response.json()) as MSMEResponse;
      setMSMEs(data.msmes);
    } catch (error) {
      console.error("MSME fetch failed:", error);
      toast.error("Failed to fetch MSMEs");
    }
  };

  useEffect(() => {
    void fetchMSMEs();
  }, []);

  const addMSME = (msme: MSME) => {
    setMSMEs((prev) => [...prev, msme]);
  };

  const updateMSME = (updatedMSME: MSME) => {
    setMSMEs((prev) =>
      prev.map((msme) => (msme.id === updatedMSME.id ? updatedMSME : msme)),
    );
  };

  const deleteMSME = (id: number) => {
    setMSMEs((prev) => prev.filter((msme) => msme.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        msmes: msmes || [],
        addMSME,
        updateMSME,
        deleteMSME,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

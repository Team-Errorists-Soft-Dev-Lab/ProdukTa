"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface MSME {
  id: number;
  companyName: string;
  companyDescription: string;
  companyLogo: string;
  productGallery: string[];
  majorProductLines: string[];
  contactPerson: string;
  contactNumber: string;
  email: string;
  facebookPage: string | null;
  instagramPage: string | null;
  provinceAddress: string;
  cityMunicipalityAddress: string;
  barangayAddress: string;
  longitude: number;
  latitude: number;
  yearEstablished: number;
  dti_number: number;
  sectorId: number;
  createdAt: Date;
}

type CreateMSME = Omit<MSME, "id">;

interface MSMEResponse {
  msmes: MSME[];
}

interface Sector {
  id: number;
  name: string;
  adminCount: number;
  msmeCount: number;
}

interface SectorsResponse {
  sectors: Sector[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface MSMEContextType {
  sectors: Sector[];
  msmes: MSME[];
  isLoading: boolean;
  error: Error | null;
  handleAddMSME: (msme: CreateMSME) => Promise<MSME>;
  handleUpdateMSME: (msme: MSME) => Promise<void>;
  handleDeleteMSME: (msmeId: number) => Promise<void>;
}

const MSMEContext = createContext<MSMEContextType | undefined>(undefined);

export const MSMEProvider = ({ children }: { children: ReactNode }) => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [msmes, setMSMEs] = useState<MSME[]>([]);

  const fetchMSMEs = async () => {
    try {
      const response = await fetch("/api/msme");
      if (!response.ok) throw new Error("Failed to fetch MSMEs");

      const data = (await response.json()) as MSMEResponse;
      setMSMEs(data.msmes);
    } catch (error) {
      console.error("Error fetching MSMEs:", error);
      toast.error("Failed to fetch MSMEs");
    }
  };

  const fetchSectors = async () => {
    try {
      const response = await fetch("/api/sectors");
      if (!response.ok) throw new Error("Failed to fetch sectors");

      const data = (await response.json()) as SectorsResponse;
      setSectors(data.sectors);
    } catch (error) {
      console.error("Error fetching sectors:", error);
      toast.error("Failed to fetch sectors");
    }
  };

  useEffect(() => {
    void fetchMSMEs();
    void fetchSectors();
  }, []);

  const handleAddMSME = async (msme: CreateMSME) => {
    try {
      const response = await fetch("/api/msme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msme), // No need to include id
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiResponse<null>;
        throw new Error(error.message ?? "Failed to add MSME");
      }

      const newMSME = (await response.json()) as MSME;
      setMSMEs((prev) => [...prev, newMSME]);

      toast.success("MSME added successfully");
      return newMSME;
    } catch (error) {
      console.error("Error adding MSME:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add MSME",
      );
      throw error;
    }
  };

  const handleUpdateMSME = async (msme: MSME) => {
    try {
      const response = await fetch(`/api/msme/${msme.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msme),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiResponse<null>;
        throw new Error(error.message ?? "Failed to update MSME");
      }

      setMSMEs((prev) => prev.map((m) => (m.id === msme.id ? msme : m)));

      toast.success("MSME updated successfully");
    } catch (error) {
      console.error("Error updating MSME:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update MSME",
      );
    }
  };

  const handleDeleteMSME = async (msmeId: number) => {
    try {
      const response = await fetch(`/api/msme/${msmeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiResponse<null>;
        throw new Error(error.message ?? "Failed to delete MSME");
      }

      setMSMEs((prev) => prev.filter((msme) => msme.id !== msmeId));

      toast.success("MSME deleted successfully");
    } catch (error) {
      console.error("Error deleting MSME:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete MSME",
      );
    }
  };

  return (
    <MSMEContext.Provider
      value={{
        sectors,
        msmes: msmes || [],
        isLoading: !sectors.length,
        error: null,
        handleAddMSME,
        handleUpdateMSME,
        handleDeleteMSME,
      }}
    >
      {children}
    </MSMEContext.Provider>
  );
};

export const useMSMEContext = () => {
  const context = useContext(MSMEContext);
  if (!context) {
    throw new Error("useMSMEContext must be used within MSMEProvider");
  }
  return context;
};

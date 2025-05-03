"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { MSME } from "@/types/MSME";
import { deleteImage } from "@/utils/supabase/storage";

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
  pagedMSMEs: MSME[];
  totalPages: number;
  isLoading: boolean;
  isChangingPage: boolean;
  isChangingSector: boolean;
  isSearching: boolean;
  error: Error | null;
  fetchPagedMSMEs: (page: number) => Promise<void>;
  searchMSMEs: (searchQuery: string) => Promise<void>;
  fetchMSMEsBySector: (sectorName: string, page: number) => Promise<void>;
  handleAddMSME: (msme: CreateMSME) => Promise<MSME>;
  handleUpdateMSME: (msme: MSME) => Promise<void>;
  handleDeleteMSME: (msmeId: number) => Promise<void>;
}

interface PagedMSMEsResponse {
  msmes: MSME[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const MSMEContext = createContext<MSMEContextType | undefined>(undefined);

export const MSMEProvider = ({ children }: { children: ReactNode }) => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [msmes, setMSMEs] = useState<MSME[]>([]);
  const [pagedMSMEs, setPagedMSMEs] = useState<MSME[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isChangingPage, setIsChangingPage] = useState<boolean>(false);
  const [isSwitchingSector, setIsSwitchingSector] = useState<boolean>(false);

  const fetchPagedMSMEs = useMemo(() => {
    return async (page: number) => {
      try {
        setIsChangingPage(true);
        const response = await fetch(`/api/msme/paginated-msme/${page}`);
        if (!response.ok) throw new Error("Failed to fetch paged MSMEs");

        const data = (await response.json()) as PagedMSMEsResponse;
        setPagedMSMEs(data.msmes);
        setTotalPages(data.meta.totalPages);
        setIsChangingPage(false);
      } catch (error) {
        setIsChangingPage(false);
        console.error("Error fetching paged MSMEs:", error);
        toast.error("Failed to fetch paged MSMEs");
      }
    };
  }, []);

  const searchMSMEs = async (searchQuery: string) => {
    try {
      setIsSearching(true);
      const response = await fetch(`/api/msme/search/${searchQuery}`);
      if (!response.ok) {
        toast.error("Failed to search MSMEs");
        throw new Error("Failed to search MSMEs");
      }

      const data = (await response.json()) as MSME[];
      setPagedMSMEs(data);
      setIsSearching(false);
      setTotalPages(1);
    } catch (error) {
      setIsSearching(false);
      console.error("Error searching MSMEs:", error);
      toast.error("Failed to search MSMEs");
    }
  };

  const fetchMSMEsBySector = async (sectorName: string, page: number) => {
    try {
      setIsSwitchingSector(true);
      setIsChangingPage(true);
      const response = await fetch(
        `/api/msme/sector-filter/${sectorName}/${page}`,
      );
      if (!response.ok) throw new Error("Failed to fetch MSMEs by sector");
      const data = (await response.json()) as PagedMSMEsResponse;
      setPagedMSMEs(data.msmes);
      setTotalPages(data.meta.totalPages);
      setIsChangingPage(false);
      setIsSwitchingSector(false);
    } catch (error) {
      setIsSwitchingSector(false);
      console.error("Error fetching MSMEs by sector:", error);
      toast.error("Failed to fetch MSMEs by sector");
    }
  };

  const fetchMSMEs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/msme");
      if (!response.ok) throw new Error("Failed to fetch MSMEs");

      const data = (await response.json()) as MSMEResponse;
      setMSMEs(data.msmes);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
    void fetchPagedMSMEs(1);
    void fetchSectors();
  }, []);

  const handleAddMSME = async (msme: CreateMSME) => {
    try {
      const response = await fetch("/api/msme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msme),
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
      throw error;
    }
  };

  const handleDeleteMSME = async (msmeId: number) => {
    try {
      // Get the MSME to delete
      const msmeToDelete = msmes.find((msme) => msme.id === msmeId);
      if (!msmeToDelete) throw new Error("MSME not found");

      // Delete associated images
      const imagesToDelete = [];
      if (msmeToDelete.companyLogo) {
        imagesToDelete.push(msmeToDelete.companyLogo);
      }
      if (
        msmeToDelete.productGallery &&
        msmeToDelete.productGallery.length > 0
      ) {
        imagesToDelete.push(...msmeToDelete.productGallery);
      }

      // Delete images from storage if they exist
      if (imagesToDelete.length > 0) {
        await Promise.all(imagesToDelete.map((path) => deleteImage(path)));
      }

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
        pagedMSMEs,
        totalPages,
        isLoading: isLoading || false,
        isChangingPage,
        isChangingSector: isSwitchingSector,
        isSearching,
        error: null,
        fetchPagedMSMEs,
        fetchMSMEsBySector,
        searchMSMEs,
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

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
import { useDebouncedCallback } from "use-debounce";
// import { set } from "zod";

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
  singleMSME: MSME | null;
  pagedMSMEs: MSME[];
  totalPages: number;
  isLoading: boolean;
  isChangingPage: boolean;
  isChangingSector: boolean;
  isSearching: boolean;
  error: Error | null;
  fetchPagedMSMEs: (
    page: number,
    isDesc?: boolean,
    municipalities?: string[],
  ) => Promise<void>;
  searchMSMEs: (searchQuery: string) => Promise<void>;
  searchMSMEsDebounced: (
    searchQuery: string,
    isDesc?: boolean,
    selectedMunicipalities?: string[],
  ) => void;
  fetchMSMEsBySector: (
    sectorName: string,
    page: number,
    isDesc?: boolean,
    municipalities?: string[],
  ) => Promise<void>;
  fetchSingleMSME: (msmeId: number) => Promise<void>;
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
  const [singleMSME, setSingleMSME] = useState<MSME | null>(null);
  const [pagedMSMEs, setPagedMSMEs] = useState<MSME[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isChangingPage, setIsChangingPage] = useState<boolean>(false);
  const [isSwitchingSector, setIsSwitchingSector] = useState<boolean>(false);

  const fetchPagedMSMEs = useMemo(() => {
    return async (
      page: number,
      descOrder?: boolean,
      municipalities?: string[],
    ) => {
      try {
        setIsChangingPage(true);

        const params = new URLSearchParams();
        if (descOrder) params.append("desc", "true");
        if (municipalities && municipalities.length > 0) {
          params.append("municipalities", municipalities.join(","));
        }

        const url =
          params.toString().length > 0
            ? `/api/msme/paginated-msme/${page}?${params.toString()}`
            : `/api/msme/paginated-msme/${page}`;

        console.log("URL: ", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch paged MSMEs");

        const data = (await response.json()) as PagedMSMEsResponse;
        setPagedMSMEs(data.msmes);
        setTotalPages(data.meta.totalPages);
      } catch (error) {
        console.error("Error fetching paged MSMEs:", error);
        toast.error("Failed to fetch paged MSMEs");
      } finally {
        setIsChangingPage(false);
      }
    };
  }, []);

  const searchMSMEs = async (searchQuery: string): Promise<void> => {
    try {
      if (!searchQuery || searchQuery.trim().length < 2) {
        await fetchPagedMSMEs(1);
        return;
      }

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

  const searchMSMEsDebounced = useDebouncedCallback(
    (
      searchQuery: string,
      isDesc?: boolean,
      selectedMunicipalities?: string[],
    ) => {
      if (!searchQuery || searchQuery.trim() === "") {
        setIsSearching(false);
        void fetchPagedMSMEs(1, isDesc, selectedMunicipalities);
        return;
      }

      if (searchQuery.trim().length < 2) {
        return;
      }

      setIsSearching(true);

      void searchMSMEs(searchQuery);
    },

    300,

    {
      leading: false,
      trailing: true,
      maxWait: 1000,
    },
  );

  const fetchMSMEsBySector = useMemo(() => {
    return async (
      sectorName: string,
      page: number,
      isDesc?: boolean,
      municipalities?: string[],
    ) => {
      try {
        setIsSwitchingSector(true);
        setIsChangingPage(true);

        const params = new URLSearchParams();
        if (isDesc) params.append("desc", "true");
        if (municipalities && municipalities.length > 0) {
          params.append("municipalities", municipalities.join(","));
        }

        const url =
          params.toString().length > 0
            ? `/api/msme/sector-filter/${sectorName}/${page}?${params.toString()}`
            : `/api/msme/sector-filter/${sectorName}/${page}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch MSMEs by sector");
        const data = (await response.json()) as PagedMSMEsResponse;
        setPagedMSMEs(data.msmes);
        setTotalPages(data.meta.totalPages);
      } catch (error) {
        console.error("Error fetching MSMEs by sector:", error);
        toast.error("Failed to fetch MSMEs by sector");
      } finally {
        setIsChangingPage(false);
        setIsSwitchingSector(false);
      }
    };
  }, []);

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

  const fetchSingleMSME = async (msmeId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/msme/${msmeId}`);
      if (!response.ok) {
        const error = (await response.json()) as ApiResponse<null>;
        throw new Error(error.message ?? "Failed to fetch MSME");
      }
      const data = (await response.json()) as MSME;
      setSingleMSME(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching single MSME:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch MSME",
      );
      throw error;
    }
  };

  const fetchSectors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/sectors");
      if (!response.ok) throw new Error("Failed to fetch sectors");

      const data = (await response.json()) as SectorsResponse;
      setSectors(data.sectors);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sectors:", error);
      toast.error("Failed to fetch sectors");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMSMEs();
    void fetchPagedMSMEs(1);
    void fetchSectors();
  }, [fetchPagedMSMEs]);

  const handleAddMSME = async (msme: CreateMSME) => {
    try {
      const response = await fetch("/api/msme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msme),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiResponse<null>;
        throw new Error(
          error.message ?? "Failed to add MSME: Please try again",
        );
      }

      const newMSME = (await response.json()) as MSME;
      setMSMEs((prev) => [...prev, newMSME]);

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
        singleMSME,
        pagedMSMEs,
        totalPages,
        isLoading: isLoading || false,
        isChangingPage,
        isChangingSector: isSwitchingSector,
        isSearching,
        error: null,
        fetchPagedMSMEs,
        fetchMSMEsBySector,
        fetchSingleMSME,
        searchMSMEs,
        searchMSMEsDebounced,
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

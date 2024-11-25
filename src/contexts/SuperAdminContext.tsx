"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { PendingAdmin, Admin } from "@/types/superadmin";
import { toast } from "sonner";

interface Sector {
  id: number;
  name: string;
  adminCount: number;
  msmeCount: number;
}

interface SuperAdminContextType {
  activeAdmins: Admin[];
  pendingAdmins: PendingAdmin[];
  sectors: Sector[];
  handleAcceptAdmin: (adminId: number) => Promise<void>;
  handleRejectAdmin: (adminId: number) => Promise<void>;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(
  undefined,
);

export const SuperAdminProvider = ({ children }: { children: ReactNode }) => {
  const [activeAdmins, setActiveAdmins] = useState<Admin[]>([]);
  const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);

  const fetchAdmins = async () => {
    try {
      const [activeResponse, pendingResponse] = await Promise.all([
        fetch("/api/admin/active"),
        fetch("/api/admin/pending"),
      ]);

      if (!activeResponse.ok) throw new Error("Failed to fetch active admins");
      if (!pendingResponse.ok)
        throw new Error("Failed to fetch pending admins");

      const [activeData, pendingData] = await Promise.all([
        activeResponse.json(),
        pendingResponse.json(),
      ]);

      setActiveAdmins(activeData.admins);
      setPendingAdmins(pendingData.pendingAdmins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to fetch admins");
    }
  };

  const fetchSectors = async () => {
    try {
      const response = await fetch("/api/sectors");
      if (!response.ok) throw new Error("Failed to fetch sectors");
      const data = await response.json();
      setSectors(data.sectors);
    } catch (error) {
      console.error("Error fetching sectors:", error);
      toast.error("Failed to fetch sectors");
    }
  };

  useEffect(() => {
    void fetchAdmins();
    void fetchSectors();
  }, []);

  const handleAcceptAdmin = async (adminId: number) => {
    try {
      // Optimistically update UI
      setPendingAdmins((prev) => prev.filter((admin) => admin.id !== adminId));

      const response = await fetch(`/api/admin/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve admin");
      }

      // Refresh active admins list
      const activeResponse = await fetch("/api/admin/active");
      if (!activeResponse.ok) throw new Error("Failed to fetch active admins");
      const activeData = await activeResponse.json();
      setActiveAdmins(activeData.admins);

      toast.success("Admin approved successfully");
    } catch (error) {
      console.error("Error approving admin:", error);
      // Revert optimistic update on error
      void fetchAdmins();
      toast.error(
        error instanceof Error ? error.message : "Failed to approve admin",
      );
    }
  };

  const handleRejectAdmin = async (adminId: number) => {
    try {
      // Optimistically update UI
      setPendingAdmins((prev) => prev.filter((admin) => admin.id !== adminId));

      const response = await fetch(`/api/admin/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reject admin");
      }

      toast.success("Admin rejected successfully");
    } catch (error) {
      console.error("Error rejecting admin:", error);
      // Revert optimistic update on error
      void fetchAdmins();
      toast.error(
        error instanceof Error ? error.message : "Failed to reject admin",
      );
    }
  };

  return (
    <SuperAdminContext.Provider
      value={{
        activeAdmins,
        pendingAdmins,
        sectors,
        handleAcceptAdmin,
        handleRejectAdmin,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdminContext = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error(
      "useSuperAdminContext must be used within SuperAdminProvider",
    );
  }
  return context;
};

"use client";

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { superAdminMockData } from "../../mock_data/dummyData";
import type { MSME, Admin, Sector } from "@/types/superadmin";

interface AdminSignup {
  id: number;
  name: string;
  email: string;
  sector: string;
  dateApplied: string;
  status: "pending" | "approved" | "rejected";
}

interface SuperAdminContextType {
  sectors: Sector[];
  admins: Admin[];
  msmes: MSME[];
  adminSignups: AdminSignup[];
  handleDeleteMSME: (id: number) => void;
  handleDeleteAdmin: (id: number) => void;
  handleDeleteSector: (id: number) => void;
  handleAddMSME: (msme: Omit<MSME, "id">) => void;
  handleAddAdmin: (admin: Omit<Admin, "id">) => void;
  handleAddSector: (sector: Omit<Sector, "id">) => void;
  handleUpdateMSME: (msme: MSME) => void;
  handleUpdateAdmin: (admin: Admin) => void;
  handleUpdateSector: (sector: Sector) => void;
  handleAcceptAdmin: (signupId: number) => void;
  handleRejectAdmin: (signupId: number) => void;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(
  undefined,
);

export const SuperAdminProvider = ({ children }: { children: ReactNode }) => {
  const [sectors, setSectors] = useState<Sector[]>(
    () => superAdminMockData.sectors,
  );
  const [admins, setAdmins] = useState<Admin[]>(
    () => superAdminMockData.admins,
  );
  const [msmes, setMsmes] = useState<MSME[]>(() => superAdminMockData.msmes);
  const [adminSignups, setAdminSignups] = useState<AdminSignup[]>(
    () => superAdminMockData.adminSignups,
  );

  const handleDeleteMSME = (id: number) => {
    setMsmes((prev) => prev.filter((msme) => msme.id !== id));
  };

  const handleDeleteAdmin = (id: number) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
  };

  const handleDeleteSector = (id: number) => {
    setSectors((prev) => prev.filter((sector) => sector.id !== id));
  };

  const handleAddMSME = (newMSME: Omit<MSME, "id">) => {
    const id = Math.max(...msmes.map((m) => m.id), 0) + 1;
    setMsmes((prev) => [...prev, { ...newMSME, id }]);
  };

  const handleAddAdmin = (newAdmin: Omit<Admin, "id">) => {
    const id = Math.max(...admins.map((a) => a.id), 0) + 1;
    setAdmins((prev) => [...prev, { ...newAdmin, id }]);
  };

  const handleAddSector = (newSector: Omit<Sector, "id">) => {
    const id = Math.max(...sectors.map((s) => s.id), 0) + 1;
    setSectors((prev) => [...prev, { ...newSector, id }]);
  };

  const handleUpdateMSME = (updatedMSME: MSME) => {
    setMsmes((prev) =>
      prev.map((msme) => (msme.id === updatedMSME.id ? updatedMSME : msme)),
    );
  };

  const handleUpdateAdmin = (updatedAdmin: Admin) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === updatedAdmin.id ? updatedAdmin : admin,
      ),
    );
  };

  const handleUpdateSector = (updatedSector: Sector) => {
    setSectors((prev) =>
      prev.map((sector) =>
        sector.id === updatedSector.id ? updatedSector : sector,
      ),
    );
  };

  const handleAcceptAdmin = (signupId: number) => {
    const signup = adminSignups.find((s) => s.id === signupId);
    if (!signup) return;

    // Add to admins
    const newAdmin: Admin = {
      id: Math.max(...admins.map((a) => a.id), 0) + 1,
      name: signup.name,
      email: signup.email,
      sector: signup.sector,
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setAdmins((prev) => [...prev, newAdmin]);

    // Update signup status
    setAdminSignups((prev) =>
      prev.map((s) => (s.id === signupId ? { ...s, status: "approved" } : s)),
    );
  };

  const handleRejectAdmin = (signupId: number) => {
    setAdminSignups((prev) =>
      prev.map((s) => (s.id === signupId ? { ...s, status: "rejected" } : s)),
    );
  };

  return (
    <SuperAdminContext.Provider
      value={{
        sectors,
        admins,
        msmes,
        adminSignups,
        handleDeleteMSME,
        handleDeleteAdmin,
        handleDeleteSector,
        handleAddMSME,
        handleAddAdmin,
        handleAddSector,
        handleUpdateMSME,
        handleUpdateAdmin,
        handleUpdateSector,
        handleAcceptAdmin,
        handleRejectAdmin,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdminContext = (): SuperAdminContextType => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error(
      "useSuperAdminContext must be used within a SuperAdminProvider",
    );
  }
  return context;
};

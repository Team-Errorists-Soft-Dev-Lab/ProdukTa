"use client";

import React, { createContext, useContext, useState } from "react";
import { superAdminMockData } from "../../mock_data/dummyData";
import type { MSME, Sector } from "@/types/superadmin";

// TODO: Remove this context once MSME CRUD operations are implemented with the database

interface MSMEMockContextType {
  sectors: Sector[];
  msmes: MSME[];
  handleDeleteMSME: (id: number) => void;
  handleAddMSME: (msme: Omit<MSME, "id">) => void;
  handleUpdateMSME: (msme: MSME) => void;
}

const MSMEMockContext = createContext<MSMEMockContextType | undefined>(
  undefined,
);

export function MSMEMockProvider({ children }: { children: React.ReactNode }) {
  const [sectors] = useState<Sector[]>(() => superAdminMockData.sectors);
  const [msmes, setMsmes] = useState<MSME[]>(() => superAdminMockData.msmes);

  const handleDeleteMSME = (id: number) => {
    setMsmes((prev) => prev.filter((msme) => msme.id !== id));
  };

  const handleAddMSME = (newMSME: Omit<MSME, "id">) => {
    const id = Math.max(...msmes.map((m) => m.id), 0) + 1;
    setMsmes((prev) => [...prev, { ...newMSME, id }]);
  };

  const handleUpdateMSME = (updatedMSME: MSME) => {
    setMsmes((prev) =>
      prev.map((msme) => (msme.id === updatedMSME.id ? updatedMSME : msme)),
    );
  };

  return (
    <MSMEMockContext.Provider
      value={{
        sectors,
        msmes,
        handleDeleteMSME,
        handleAddMSME,
        handleUpdateMSME,
      }}
    >
      {children}
    </MSMEMockContext.Provider>
  );
}

export const useMSMEMock = () => {
  const context = useContext(MSMEMockContext);
  if (!context) {
    throw new Error("useMSMEMock must be used within MSMEMockProvider");
  }
  return context;
};

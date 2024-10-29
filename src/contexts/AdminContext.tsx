// contexts/AdminContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import type { MSME } from "@/types/admin";

// Define the shape of the AdminContext
interface AdminContextType {
  msmes: MSME[];
  addMSME: (msme: MSME) => void;
  updateMSME: (msme: MSME) => void;
  deleteMSME: (id: number) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [msmes, setMSMEs] = useState<MSME[]>([]);

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
        msmes,
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

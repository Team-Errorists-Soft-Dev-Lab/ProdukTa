"use client";
import React, { createContext, useContext, useState } from "react";
import type { MSME, Admin, Sector } from "@/types/superadmin";

interface SuperAdminContextType {
  msmes: MSME[];
  sectors: Sector[];
  admins: Admin[];
  handleAddMSME: (newMSME: Omit<MSME, "id">) => void;
  handleEditMSME: (editedMSME: MSME) => void;
  handleDeleteMSME: (id: number) => void;
  handleAddSector: (newSector: Omit<Sector, "id">) => void;
  handleAddAdmin: (newAdmin: Omit<Admin, "id">) => void;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(
  undefined,
);

export function SuperAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock Data
  const [msmes, setMSMEs] = useState<MSME[]>([
    {
      id: 1,
      name: "Tita's Bamboo Handicrafts Manufacturing",
      email: "tita@example.com",
      contactNumber: 9123456789,
      address: "San Rafael, Tigbauan, Iloilo",
      businessType: "Handicrafts",
      registrationDate: "2023-01-15",
      logo: "/placeholder.svg?height=100&width=100",
      sector: "Bamboo",
    },
    {
      id: 2,
      name: "Tropani Bamboo Products Manufacturing",
      email: "tropani@example.com",
      contactNumber: 9234567890,
      address: "Camangahan, Tigbauan, Iloilo",
      businessType: "Manufacturing",
      registrationDate: "2023-02-20",
      logo: "/placeholder.svg?height=100&width=100",
      sector: "Bamboo",
    },
    {
      id: 3,
      name: "Candelaria Canata Bamboo Products Mftg.",
      email: "candelaria@example.com",
      contactNumber: 9345678901,
      address: "Barangay Bita, Leon, Iloilo",
      businessType: "Manufacturing",
      registrationDate: "2023-03-10",
      logo: "/placeholder.svg?height=100&width=100",
      sector: "Bamboo",
    },
  ]);
  const [sectors, setSectors] = useState<Sector[]>([
    { id: 1, name: "Bamboo", adminCount: 2, msmeCount: 3 },
    { id: 2, name: "Handicrafts", adminCount: 1, msmeCount: 5 },
    { id: 3, name: "Food Processing", adminCount: 3, msmeCount: 8 },
  ]);
  const [admins, setAdmins] = useState<Admin[]>([
    { id: 1, name: "John Doe", email: "john@example.com", sector: "Bamboo" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      sector: "Handicrafts",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      sector: "Food Processing",
    },
  ]);

  const handleAddMSME = (newMSME: Omit<MSME, "id">) => {
    const newId = Math.max(...msmes.map((m) => m.id), 0) + 1;
    setMSMEs([...msmes, { ...newMSME, id: newId }]);
  };

  const handleEditMSME = (editedMSME: MSME) => {
    setMSMEs(
      msmes.map((msme) => (msme.id === editedMSME.id ? editedMSME : msme)),
    );
  };

  const handleDeleteMSME = (id: number) => {
    setMSMEs(msmes.filter((msme) => msme.id !== id));
  };

  const handleAddSector = (newSector: Omit<Sector, "id">) => {
    const newId = Math.max(...sectors.map((s) => s.id), 0) + 1;
    setSectors([...sectors, { ...newSector, id: newId }]);
  };

  const handleAddAdmin = (newAdmin: Omit<Admin, "id">) => {
    const newId = Math.max(...admins.map((a) => a.id), 0) + 1;
    setAdmins([...admins, { ...newAdmin, id: newId }]);
  };

  return (
    <SuperAdminContext.Provider
      value={{
        msmes,
        sectors,
        admins,
        handleAddMSME,
        handleEditMSME,
        handleDeleteMSME,
        handleAddSector,
        handleAddAdmin,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
}

export function useSuperAdminContext() {
  const context = useContext(SuperAdminContext);
  if (context === undefined) {
    throw new Error(
      "useSuperAdminContext must be used within a SuperAdminProvider",
    );
  }
  return context;
}

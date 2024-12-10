"use client";
import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { SuperAdminProvider } from "@/contexts/SuperAdminContext";
import { MSMEProvider } from "@/contexts/MSMEContext";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    redirect("/login");
  }
  return (
    <SuperAdminProvider>
      <MSMEProvider>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </MSMEProvider>
    </SuperAdminProvider>
  );
}

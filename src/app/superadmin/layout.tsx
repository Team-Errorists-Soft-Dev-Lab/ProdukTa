"use client";
import type React from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { SuperAdminProvider } from "@/contexts/SuperAdminContext";
import { MSMEProvider } from "@/contexts/MSMEContext";
import { SuperadminGuard } from "@/components/SuperadminGuard";

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
        <div className="flex h-screen overflow-hidden bg-gray-100">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-auto">
            <main className="relative flex-1 overflow-auto bg-gray-100">
              <SuperadminGuard>{children}</SuperadminGuard>
            </main>
          </div>
        </div>
      </MSMEProvider>
    </SuperAdminProvider>
  );
}

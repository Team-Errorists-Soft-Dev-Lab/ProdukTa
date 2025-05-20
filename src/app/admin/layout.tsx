"use client";
import type React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { AdminProvider } from "@/contexts/AdminContext";
import Sidebar from "@/components/AdminSidebar";
import Navbar from "@/components/AdminNavbar";
import { MSMEProvider } from "@/contexts/MSMEContext";
import { ExportDetailsProvider } from "@/contexts/ExportDetailsContext";
import { VisitorProvider } from "@/contexts/VisitorContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  // Temporary fix: <MSMEProvider> provides mock data for MSMEs
  return (
    <AdminProvider>
      <MSMEProvider>
        <ExportDetailsProvider>
          <VisitorProvider>
            <div className="flex h-screen bg-gray-100">
              <div className="overflow-hidden">
                <Sidebar />
              </div>
              <div className="flex flex-1 flex-col overflow-auto">
                <div className="sticky bottom-0 top-0 z-30">
                  <Navbar />
                </div>
                <main className="overflow-auto bg-gray-100 p-2">
                  {children}
                </main>
              </div>
            </div>
          </VisitorProvider>
        </ExportDetailsProvider>
      </MSMEProvider>
    </AdminProvider>
  );
}

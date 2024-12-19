"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { AdminProvider } from "@/contexts/AdminContext";
import Sidebar from "@/components/AdminSidebar";
import Navbar from "@/components/AdminNavbar";
import { MSMEProvider } from "@/contexts/MSMEContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <AdminProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}

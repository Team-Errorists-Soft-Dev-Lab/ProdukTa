"use client";
import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { SuperAdminProvider } from "@/contexts/SuperAdminContext";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    redirect("/auth");
  }
  return (
    <SuperAdminProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between bg-white p-4 shadow-sm">
            <h1 className="font-header text-3xl font-semibold text-gray-800">
              Super Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Super Admin" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <span className="font-medium">Super Admin</span>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    </SuperAdminProvider>
  );
}

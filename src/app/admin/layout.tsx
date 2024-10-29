"use client";
import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { AdminProvider } from "@/contexts/AdminContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirect("/auth");
  }

  return (
    <AdminProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between bg-white p-4 shadow-sm">
            <h1 className="font-header text-3xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                <AvatarFallback>Admin</AvatarFallback>
              </Avatar>
              <span className="font-medium">Admin</span>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}

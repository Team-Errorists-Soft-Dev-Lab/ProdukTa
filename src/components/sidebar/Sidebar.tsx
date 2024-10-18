"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Users, Briefcase } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out...");
    // Implement actual logout logic here
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-[#A2A14A] font-body text-white">
      <div className="flex-grow p-4">
        <img
          src="/produkta-logo.png"
          alt="ProdukTa Logo"
          className="mb-6 w-full"
        />
        <nav className="space-y-2 font-header">
          <Link href="/superadmin">
            <Button
              variant={pathname === "/superadmin" ? "secondary" : "ghost"}
              className={`w-full justify-start text-white hover:bg-white hover:text-[#A2A14A] ${
                pathname === "/superadmin" ? "bg-white text-[#A2A14A]" : ""
              }`}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/superadmin/sectors">
            <Button
              variant={
                pathname === "/superadmin/sectors" ? "secondary" : "ghost"
              }
              className={`w-full justify-start text-white hover:bg-white hover:text-[#A2A14A] ${
                pathname === "/superadmin/sectors"
                  ? "bg-white text-[#A2A14A]"
                  : ""
              }`}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Manage Sectors
            </Button>
          </Link>
          <Link href="/superadmin/admins">
            <Button
              variant={
                pathname === "/superadmin/admins" ? "secondary" : "ghost"
              }
              className={`w-full justify-start text-white hover:bg-white hover:text-[#A2A14A] ${
                pathname === "/superadmin/admins"
                  ? "bg-white text-[#A2A14A]"
                  : ""
              }`}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Admins
            </Button>
          </Link>
          <Link href="/superadmin/msme">
            <Button
              variant={pathname === "/superadmin/msme" ? "secondary" : "ghost"}
              className={`w-full justify-start text-white hover:bg-white hover:text-[#A2A14A] ${
                pathname === "/superadmin/msme" ? "bg-white text-[#A2A14A]" : ""
              }`}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage MSMEs
            </Button>
          </Link>
        </nav>
      </div>
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full border-white text-[#A2A14A]"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Users,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sectorPath, setSectorPath] = useState("");

  useEffect(() => {
    const fetchSector = async () => {
      if (user && !user.isSuperadmin) {
        try {
          const response = await fetch(`/api/admin/${user.id}/sector`);
          const { sector }: { sector: { name: string } } =
            (await response.json()) as { sector: { name: string } };
          if (sector) {
            setSectorPath(sector.name.toLowerCase());
          }
        } catch (error) {
          console.error("Failed to fetch sector:", error);
        }
      }
    };

    void fetchSector();
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-[#f9f8f4] shadow-md transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <Image
            src="/ProdukTa1.png"
            alt="ProdukTa Logo"
            width={150}
            height={40}
            className="mx-auto"
          />
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-200"
        >
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </button>
      </div>
      <nav className="mt-8 flex-grow">
        <Link
          href={`/admin/dashboard/${sectorPath}`}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#996439] hover:text-[#FCFBFA]"
        >
          <Home className="mr-3" size={18} />
          <span
            className={cn(
              "transition-opacity",
              isCollapsed ? "hidden opacity-0" : "opacity-100",
            )}
          >
            Home
          </span>
        </Link>
        <Link
          href={`/admin/msme/${sectorPath}`}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#996439] hover:text-[#FCFBFA]"
        >
          <Users className="mr-3" size={18} />
          <span
            className={cn(
              "transition-opacity",
              isCollapsed ? "hidden opacity-0" : "opacity-100",
            )}
          >
            Manage MSMEs
          </span>
        </Link>
        <Link
          href={`/admin/export-data/${sectorPath}`}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#996439] hover:text-[#FCFBFA]"
        >
          <FileText className="mr-3" size={18} />
          <span
            className={cn(
              "transition-opacity",
              isCollapsed ? "hidden opacity-0" : "opacity-100",
            )}
          >
            Export Data
          </span>
        </Link>
        <Link
          href="/guest"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#996439] hover:text-[#FCFBFA]"
        >
          <User className="mr-3" size={18} />
          <span
            className={cn(
              "transition-opacity",
              isCollapsed ? "hidden opacity-0" : "opacity-100",
            )}
          >
            Guest Mode
          </span>
        </Link>
      </nav>
      <div className="p-4">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={cn(
            "flex w-full items-center justify-center rounded bg-[#996439] px-4 py-2 text-[#FCFBFA] transition duration-150 ease-in-out hover:bg-[#bb987a]",
            isLoading && "cursor-not-allowed opacity-50", // Adds a disabled state visual indicator
          )}
        >
          <LogOut
            className={cn("mr-2 transition-opacity", isCollapsed && "hidden")}
            size={18}
          />
          <span
            className={cn(
              "transition-opacity",
              isCollapsed ? "hidden opacity-0" : "opacity-100",
            )}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}

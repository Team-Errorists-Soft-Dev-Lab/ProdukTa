"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          href="/admin/dashboard"
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
          href="/admin/msme"
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
          href="/admin/export-data"
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
        <button className="flex w-full items-center justify-center rounded bg-[#996439] px-4 py-2 text-[#FCFBFA] transition duration-150 ease-in-out hover:bg-[#bb987a]">
          <LogOut className="mr-2" size={18} />
          <span
            className={cn(
              "transition-opacity",
              isCollapsed ? "hidden opacity-0" : "opacity-100",
            )}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

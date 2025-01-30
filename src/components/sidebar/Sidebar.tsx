"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  LogOut,
  Users,
  Factory,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserCircle2,
  Store,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/superadmin",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    title: "Sectors",
    href: "/superadmin/sectors",
    icon: Factory,
    description: "Manage business sectors",
  },
  {
    title: "Admins",
    href: "/superadmin/admins",
    icon: Users,
    description: "Manage administrators",
  },
  {
    title: "MSMEs",
    href: "/superadmin/msme",
    icon: Store,
    description: "Manage registered MSMEs",
  },
  {
    title: "Guest",
    href: "/guest",
    icon: UserCircle2,
    description: "Guest portal access",
  },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "group/sidebar relative flex h-full flex-col border-r bg-[#fffcf4] font-body text-slate-600 shadow-sm transition-all duration-500",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      {/* Logo and Toggle Section */}
      <div className="relative flex h-20 items-center justify-between border-b px-4">
        <div className="relative flex items-center">
          {isCollapsed ? (
            <Image
              src="/ProdukTa1.png"
              alt="ProdukTa Logo"
              className="h-18 w-auto"
              width={500}
              height={500}
              priority
            />
          ) : (
            <Image
              src="/Produkta2.png"
              alt="ProdukTa Logo"
              className="h-50 w-auto"
              width={500}
              height={500}
              priority
            />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-4 top-7 z-50 h-8 w-8 rounded-full border bg-[#fffcf4] text-slate-600 shadow-md transition-all hover:bg-slate-100 hover:text-slate-900 hover:shadow-lg",
            "focus-visible:ring-slate-200",
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 transition-transform duration-300" />
          ) : (
            <ChevronLeft className="h-4 w-4 transition-transform duration-300" />
          )}
        </Button>
      </div>

      {/* Navigation Section */}
      <ScrollArea className="flex-1 px-3 py-8">
        <nav className="flex flex-col space-y-2 font-header">
          {sidebarNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <TooltipProvider key={item.href}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} className="relative">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 w-1 rounded-full bg-emerald-600 transition-all",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <Button
                        variant="ghost"
                        className={cn(
                          "group relative w-full justify-start overflow-hidden rounded-lg text-slate-600 transition-all hover:bg-emerald-50/80 hover:text-emerald-900",
                          isActive &&
                            "bg-emerald-100 font-medium text-emerald-800 shadow-sm hover:bg-emerald-200",
                          isCollapsed ? "justify-center" : "justify-start",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-all duration-300",
                            !isCollapsed && "mr-3",
                            isActive && "text-emerald-700",
                            "group-hover:text-emerald-700",
                          )}
                        />
                        <span
                          className={cn(
                            "inline-flex flex-col text-sm transition-all duration-300",
                            isCollapsed && "hidden",
                          )}
                        >
                          {item.title}
                          {isActive && (
                            <span className="text-xs font-normal text-emerald-700/70">
                              {item.description}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-100 to-transparent" />
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent
                      side="right"
                      className="flex flex-col space-y-1 border-none bg-[#fffcf4] text-slate-900 shadow-xl"
                    >
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-slate-500">
                        {item.description}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Logout Section */}
      <div className="border-t p-4">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "group w-full justify-start rounded-lg text-slate-600 transition-all hover:bg-red-100 hover:text-red-700",
                  isCollapsed ? "justify-center" : "justify-start",
                )}
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut
                  className={cn(
                    "h-5 w-5 transition-all duration-300 group-hover:rotate-12",
                    !isCollapsed && "mr-3",
                  )}
                />
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isCollapsed && "hidden",
                  )}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </span>
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent
                side="right"
                className="border-none bg-[#fffcf4] text-slate-900 shadow-xl"
              >
                <p className="font-medium">Logout</p>
                <p className="text-xs text-slate-500">
                  Sign out of your account
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

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
        "group/sidebar relative flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-emerald-700 to-emerald-900 font-body text-white shadow-xl transition-all duration-500",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo and Toggle Section */}
      <div className="relative flex h-20 items-center justify-between border-b border-white/10 px-4 shadow-sm">
        <div
          className={cn(
            "relative flex items-center transition-opacity duration-300",
            isCollapsed ? "opacity-0" : "opacity-100",
          )}
        >
          <Image
            src="/ProdukTa_Logo.png"
            alt="ProdukTa Logo"
            className="h-12 w-auto drop-shadow-md transition-transform duration-300 hover:scale-105"
            width={500}
            height={500}
            priority
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-4 top-7 z-50 h-8 w-8 rounded-full border border-white/10 bg-emerald-700 text-white shadow-md transition-all hover:bg-emerald-800 hover:shadow-lg",
            "focus-visible:ring-emerald-500",
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
                          "absolute inset-y-0 left-0 w-1 rounded-full bg-white transition-all",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <Button
                        variant="ghost"
                        className={cn(
                          "group relative w-full justify-start overflow-hidden rounded-lg text-white/80 transition-all hover:bg-white/10 hover:text-white",
                          isActive &&
                            "bg-white/10 font-medium text-white shadow-sm hover:bg-white/20",
                          isCollapsed ? "justify-center" : "justify-start",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-all duration-300",
                            !isCollapsed && "mr-3",
                            isActive && "text-white",
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
                            <span className="text-xs font-normal text-white/60">
                              {item.description}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/10 to-transparent" />
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent
                      side="right"
                      className="flex flex-col space-y-1 border-none bg-emerald-700 text-white shadow-xl"
                    >
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-white/60">
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
      <div className="border-t border-white/10 p-4 shadow-inner">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "group w-full justify-start rounded-lg text-white/80 transition-all hover:bg-white/10 hover:text-white",
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
                className="border-none bg-emerald-700 text-white shadow-xl"
              >
                <p className="font-medium">Logout</p>
                <p className="text-xs text-white/60">
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

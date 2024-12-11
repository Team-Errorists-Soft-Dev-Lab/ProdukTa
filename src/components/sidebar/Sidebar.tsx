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
  },
  {
    title: "Sectors",
    href: "/superadmin/sectors",
    icon: Factory,
  },
  {
    title: "Admins",
    href: "/superadmin/admins",
    icon: Building2,
  },
  {
    title: "MSMEs",
    href: "/superadmin/msme",
    icon: Store,
  },
  {
    title: "Guest",
    href: "/guest",
    icon: UserCircle2,
  },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  // const router = useRouter();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

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

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-[#A2A14A] font-body text-white shadow-lg transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex h-20 items-center justify-between border-b border-white/20 px-4">
        {!isCollapsed && (
          <Image
            src="/ProdukTa_Logo.png"
            alt="ProdukTa Logo"
            className="h-16 w-auto"
            width={500}
            height={500}
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6 transition-transform" />
          ) : (
            <ChevronLeft className="h-6 w-6 transition-transform" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col space-y-2 font-header">
          {sidebarNavItems.map((item) => (
            <TooltipProvider key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-white transition-colors hover:bg-white/10",
                        pathname === item.href && "bg-white text-[#A2A14A]",
                        isCollapsed && "justify-center",
                      )}
                    >
                      <item.icon
                        className={cn("h-5 w-5", !isCollapsed && "mr-3")}
                      />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent
                    side="right"
                    className="bg-white text-[#A2A14A]"
                  >
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start border-white text-[#A2A14A]",
                  isCollapsed && "justify-center",
                )}
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <span>{isLoading ? "Logging out..." : "Logout"}</span>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-white text-[#A2A14A]">
                {isLoading ? "Logging out..." : "Logout"}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

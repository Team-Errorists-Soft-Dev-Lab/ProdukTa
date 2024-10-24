"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, LogOut, Users, Briefcase, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/superadmin",
    icon: Home,
  },
  {
    title: "Sectors",
    href: "/superadmin/sectors",
    icon: Briefcase,
  },
  {
    title: "Admins",
    href: "/superadmin/admins",
    icon: Users,
  },
  {
    title: "MSMEs",
    href: "/superadmin/msme",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    // Implement actual logout logic here
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
          <img
            src="/produkta-logo.png"
            alt="ProdukTa Logo"
            className="h-12 w-auto"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight
            className={cn(
              "h-6 w-6 transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
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
              >
                <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-white text-[#A2A14A]">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface SectorResponse {
  sector: {
    id: string;
    name: string;
  };
}

interface SectorGuardProps {
  children: React.ReactNode;
}

export function SectorGuard({ children }: SectorGuardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const checkInProgress = useRef(false);

  useEffect(() => {
    const checkSectorAccess = async () => {
      if (checkInProgress.current) return;
      checkInProgress.current = true;

      if (!user) {
        router.push("/login");
        checkInProgress.current = false;
        return;
      }

      if (user.isSuperadmin) {
        setAuthorized(true);
        setLoading(false);
        checkInProgress.current = false;
        return;
      }

      const msmeEditPattern = /^\/admin\/msme\/edit\/\d+$/;
      if (msmeEditPattern.test(pathname)) {
        setAuthorized(true);
        setLoading(false);
        checkInProgress.current = false;
        return;
      }

      try {
        const urlParts = pathname.split("/");
        const currentSector = urlParts[urlParts.length - 1];

        const response = await fetch(`/api/admin/${user.id}/sector`);
        const { sector } = (await response.json()) as SectorResponse;

        if (sector?.name) {
          const userSector = sector.name.toLowerCase().replace(/\s+/g, "");

          const isDashboardSectorPage =
            pathname.startsWith("/admin/dashboard/");

          const msmeSectorRegex = /^\/admin\/msme\/[^\/]+$/;
          const isMsmeSectorPage = msmeSectorRegex.exec(pathname) !== null;

          if (isDashboardSectorPage || isMsmeSectorPage) {
            if (userSector === currentSector) {
              setAuthorized(true);
            } else {
              router.push(`/admin/dashboard/${userSector}`);
              checkInProgress.current = false;
              return;
            }
          } else {
            setAuthorized(true);
          }
        }
      } catch (error) {
        console.error("Error checking sector access:", error);
      }

      setLoading(false);
      checkInProgress.current = false;
    };

    void checkSectorAccess();
  }, [user, router, pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return authorized ? <>{children}</> : null;
}

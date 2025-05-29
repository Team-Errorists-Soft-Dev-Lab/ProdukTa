"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface SectorResponse {
  sector: {
    id: string;
    name: string;
  };
}

interface SuperadminGuardProps {
  children: ReactNode;
}

export function SuperadminGuard({ children }: SuperadminGuardProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      if (!user.isSuperadmin) {
        try {
          // Fetch user's sector
          const response = await fetch(`/api/admin/${user.id}/sector`);
          const { sector } = (await response.json()) as SectorResponse;

          if (sector?.name) {
            const formattedSectorName = sector.name
              .toLowerCase()
              .replace(/\s+/g, "");
            router.push(`/admin/dashboard/${formattedSectorName}`);
          } else {
            router.push("/isakangalien");
          }
        } catch (error) {
          console.error("Error fetching sector:", error);
          router.push("/unauthorized");
        }
      }
    };

    void checkAccess();
  }, [user, router]);

  if (!user?.isSuperadmin) {
    return null;
  }

  return <>{children}</>;
}

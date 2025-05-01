"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface SectorResponse {
  sector: {
    id: string;
    name: string;
  };
}

export function SectorRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const redirectToSector = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      // If user is superadmin, redirect to superadmin dashboard
      if (user.isSuperadmin) {
        router.push("/superadmin");
        return;
      }

      try {
        // Fetch user's sector
        const response = await fetch(`/api/admin/${user.id}/sector`);
        const { sector } = (await response.json()) as SectorResponse;

        if (sector?.name) {
          const formattedSectorName = sector.name
            .toLowerCase()
            .replace(/\s+/g, "");
          router.push(`/admin/dashboard/${formattedSectorName}`);
        }
      } catch (error) {
        console.error("Error fetching sector:", error);
      }
    };

    void redirectToSector();
  }, [user, router]);

  return null;
}

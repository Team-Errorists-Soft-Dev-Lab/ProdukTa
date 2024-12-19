"use client";
import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
import { useMSMEContext } from "@/contexts/MSMEContext";
import {
  Coffee,
  Candy,
  Palmtree,
  Factory,
  Monitor,
  Shirt,
  Utensils,
  Sprout,
  Store,
  type LucideIcon,
} from "lucide-react";
import { SECTOR_COLORS } from "@/lib/sector-colors";

// Map sector names to icons
const sectorIcons: Record<string, LucideIcon> = {
  Coffee: Coffee,
  Cacao: Candy,
  Coconut: Palmtree,
  Bamboo: Sprout,
  "IT - BPM": Monitor,
  "Processed Foods": Utensils,
  "Wearables and Homestyles": Shirt,
};

// Get icon for a sector, with fallback
function getSectorIcon(sectorName: string): LucideIcon {
  // Split the sector name in case it contains multiple sectors
  const parts = sectorName.split(/[&,]/);

  // Try to find a matching icon for any part
  for (const part of parts) {
    const trimmedPart = part.trim();
    // Check for exact match first
    const icon = sectorIcons[trimmedPart];
    if (icon) {
      return icon;
    }
    // Then check for partial match
    const matchingSector = Object.keys(sectorIcons).find((key) =>
      trimmedPart.toLowerCase().includes(key.toLowerCase()),
    );
    if (matchingSector && sectorIcons[matchingSector]) {
      return sectorIcons[matchingSector];
    }
  }

  // Return default icon if no match found
  return Store;
}

export default function ManageSectors() {
  const { sectors } = useSuperAdminContext();
  const { msmes } = useMSMEContext();

  // Calculate MSME counts for each sector
  const sectorMSMECounts = useMemo(() => {
    const counts: Record<number, number> = {};
    msmes.forEach((msme) => {
      if (msme?.sectorId) {
        counts[msme.sectorId] = (counts[msme.sectorId] ?? 0) + 1;
      }
    });
    return counts;
  }, [msmes]);

  // Sort sectors by ID in ascending order and include real-time MSME counts
  const sortedSectors = useMemo(() => {
    return [...sectors]
      .sort((a, b) => a.id - b.id)
      .map((sector) => ({
        ...sector,
        msmeCount: sectorMSMECounts[sector.id] ?? 0,
      }));
  }, [sectors, sectorMSMECounts]);

  return (
    <div className="p-4 md:p-6">
      <CardHeader className="mb-6 px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-50 p-2">
                <Factory className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Sectors
              </CardTitle>
            </div>
            <CardDescription className="text-base text-gray-600">
              Total: {sortedSectors.length} Sectors
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedSectors.map((sector) => {
            const Icon = getSectorIcon(sector.name);
            const sectorColor =
              SECTOR_COLORS[sector.name as keyof typeof SECTOR_COLORS] ??
              "#4B5563";
            return (
              <Card
                key={sector.id}
                className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ borderColor: sectorColor }}
              >
                <div
                  className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 transform opacity-5 transition-opacity duration-300 group-hover:opacity-10"
                  style={{ color: sectorColor }}
                >
                  <Icon size={96} />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-full p-2 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${sectorColor}20`,
                        color: sectorColor,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {sector.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Sector ID: {sector.id}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div
                      className="rounded-lg p-3 transition-colors duration-300"
                      style={{
                        backgroundColor: `${sectorColor}10`,
                        color: sectorColor,
                      }}
                    >
                      <p className="text-sm opacity-90">Admins</p>
                      <p className="text-2xl font-semibold">
                        {sector.adminCount}
                      </p>
                    </div>
                    <div
                      className="rounded-lg p-3 transition-colors duration-300"
                      style={{
                        backgroundColor: `${sectorColor}10`,
                        color: sectorColor,
                      }}
                    >
                      <p className="text-sm opacity-90">MSMEs</p>
                      <p className="text-2xl font-semibold">
                        {sector.msmeCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </div>
  );
}

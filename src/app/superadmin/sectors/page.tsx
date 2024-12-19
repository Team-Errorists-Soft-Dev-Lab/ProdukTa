"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
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

interface Sector {
  id: number;
  name: string;
  adminCount: number;
  msmeCount: number;
}

// Map sector names to icons
const sectorIcons: Record<string, LucideIcon> = {
  Coffee: Coffee,
  Cacao: Candy,
  Coconut: Palmtree,
  Bamboo: Sprout,
  "IT - BPM": Monitor,
  "Processed Foods": Utensils,
  Manufacturing: Factory,
  Wearables: Shirt,
  Homestyles: Shirt,
  Retail: Store,
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

  // Sort sectors by ID in ascending order
  const sortedSectors = [...sectors].sort((a, b) => a.id - b.id);

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
          {sortedSectors.map((sector: Sector) => {
            const Icon = getSectorIcon(sector.name);
            return (
              <Card
                key={sector.id}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-emerald-600 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 transform opacity-5 transition-opacity duration-300 group-hover:opacity-10">
                  <Icon size={96} />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
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
                    <div className="rounded-lg bg-emerald-50 p-3 transition-colors duration-300 group-hover:bg-emerald-100">
                      <p className="text-sm text-emerald-600">Admins</p>
                      <p className="text-2xl font-semibold text-emerald-700">
                        {sector.adminCount}
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-3 transition-colors duration-300 group-hover:bg-emerald-100">
                      <p className="text-sm text-emerald-600">MSMEs</p>
                      <p className="text-2xl font-semibold text-emerald-700">
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

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Coffee,
  Candy,
  Palmtree,
  Factory,
  Monitor,
  Utensils,
  Shirt,
  Sprout,
  Store,
  Building2,
  type LucideIcon,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
export function getSectorIcon(sectorName: string): LucideIcon {
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
  return Building2;
}

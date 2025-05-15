"use client";

import type React from "react";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  UsersRound,
  Candy,
  Coffee,
  Sprout,
  Shirt,
  Monitor,
  Utensils,
  Palmtree,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Map sector names to their respective icons
const SECTOR_ICONS: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  Bamboo: Sprout,
  Coffee: Coffee,
  Cacao: Candy,
  Coconut: Palmtree,
  "Wearables and Homestyles": Shirt,
  "Processed Foods": Utensils,
  "IT - BPM": Monitor,
};

// Hard-coded sector colors
const SECTOR_COLORS = {
  "Processed Foods": "#FF8C00", // Dark orange
  Bamboo: "#4CAF50",
  Coffee: "#000000",
  Cacao: "#8B4513",
  Coconut: "#FF0000",
  "Wearables and Homestyles": "#9C27B0", // Purple
  "IT - BPM": "#2196F3", // Blue
};

function RollingNumber({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      setCount(0);
      const interval = setInterval(() => {
        setCount((prev) => {
          const increment = Math.max(1, Math.floor(value / 30));
          return prev + increment <= value ? prev + increment : value;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-3xl font-bold md:text-4xl">
      {count}
    </span>
  );
}

// Type for the API response
interface MSMEData {
  sectorId: string;
  count: number;
  sectorName: string;
  topMSMEs: {
    id: string;
    name: string;
    address: string;
    createdAt: string;
  }[];
}

export default function DataSection() {
  const [msmeData, setMsmeData] = useState<MSMEData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalMSMEs, setTotalMSMEs] = useState(0);

  useEffect(() => {
    const fetchMSMEData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/msme/count");

        if (!response.ok) {
          throw new Error("Failed to fetch MSME data");
        }

        const data = (await response.json()) as { formattedMSMEs: MSMEData[] };
        setMsmeData(data.formattedMSMEs);

        // Calculate total MSMEs
        const total = data.formattedMSMEs.reduce(
          (sum: number, sector: MSMEData) => sum + sector.count,
          0,
        );
        setTotalMSMEs(total);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching MSME data:", err);
        setError("Failed to load MSME data. Please try again later.");
        setIsLoading(false);
      }
    };

    void fetchMSMEData();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <section className="flex justify-center bg-[#f9f8f4] py-10">
        <div className="flex w-full max-w-6xl flex-col items-center justify-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-[#8B4513]" />
          <p className="mt-4 text-[#120f0c]/80">Loading MSME data...</p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="flex justify-center bg-[#f9f8f4] py-10">
        <div className="flex w-full max-w-6xl flex-col items-center justify-center py-10">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="mt-2 text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-[#8B4513] px-4 py-2 text-white hover:bg-[#6d3610]"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="data-section"
      className="flex justify-center bg-[#f9f8f4] py-4 md:py-8"
    >
      <div className="w-full max-w-6xl px-4 md:px-6">
        <motion.h2
          className="mb-6 text-center text-2xl font-bold text-[#8B4513] md:text-3xl"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
        >
          MSME Overview
        </motion.h2>

        <motion.div
          className="mb-6 rounded-lg bg-white p-4 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {msmeData.map((sector) => {
              // Get the icon for this sector or use a default
              const SectorIcon = SECTOR_ICONS[sector.sectorName] || UsersRound;
              // Get the color for this sector or use a default
              const sectorColor =
                SECTOR_COLORS[
                  sector.sectorName as keyof typeof SECTOR_COLORS
                ] || "#8B4513";

              return (
                <motion.div
                  key={sector.sectorId}
                  className="flex flex-col items-center justify-center rounded-lg bg-white/50 p-4 transition-colors hover:bg-white/80"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <SectorIcon
                    style={{ color: sectorColor }}
                    className="mb-3 h-10 w-10"
                  />
                  <RollingNumber value={sector.count} />
                  <p
                    className={`sectorName mt-2 text-center text-sm font-medium`}
                  >
                    {sector.sectorName}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="rounded-lg bg-white p-4 shadow-md md:p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <motion.div whileHover={{ scale: 1.1 }} className="flex-shrink-0">
              <UsersRound className="h-12 w-12 text-[#8B4513] md:h-16 md:w-16" />
            </motion.div>
            <div className="flex flex-col text-center md:text-left">
              <motion.div
                className="flex items-baseline justify-center gap-2 md:justify-start"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-4xl font-bold text-[#120f0c] md:text-5xl">
                  <RollingNumber value={totalMSMEs} />
                </span>
              </motion.div>
              <p className="text-base text-[#120f0c]/80 md:text-lg">
                Total registered MSMEs across all sectors
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

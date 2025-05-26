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

// Enhanced sector colors with gradients
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f9f8f4] via-[#faf9f6] to-[#f5f4f0] py-16">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #8B4513 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-16">
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 text-[#8B4513]" />
          </motion.div>
          <motion.p
            className="mt-6 text-lg text-[#120f0c]/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading MSME data...
          </motion.p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f9f8f4] via-[#faf9f6] to-[#f5f4f0] py-16">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #8B4513 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-16">
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <AlertCircle className="h-8 w-8 text-red-500" />
          </motion.div>
          <p className="mt-4 text-lg text-red-600">{error}</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-gradient-to-r from-[#8B4513] to-[#6d3610] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#8B4513]/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
          </motion.button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="data-section"
      className="relative overflow-hidden bg-gradient-to-br from-[#f9f8f4] via-[#faf9f6] to-[#f5f4f0] py-12 md:py-16 lg:py-20"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20 md:opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #8B4513 1px, transparent 0)",
          backgroundSize: "15px 15px",
        }}
      />

      {/* Floating decorative elements - adjusted for mobile */}
      <motion.div
        className="absolute left-4 top-16 hidden md:left-8 md:top-20 lg:block"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 shadow-lg backdrop-blur-sm md:h-14 md:w-14">
          <Shirt className="h-6 w-6 text-[#9C27B0] md:h-7 md:w-7" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-4 top-24 hidden md:right-12 md:top-32 lg:block"
        animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 shadow-md backdrop-blur-sm md:h-12 md:w-12">
          <Coffee className="h-5 w-5 text-[#000000] md:h-6 md:w-6" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-8 hidden lg:block"
        animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/55 shadow-md backdrop-blur-sm">
          <Palmtree className="h-5 w-5 text-[#FF0000]" />
        </div>
      </motion.div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Enhanced Header */}
        <motion.div
          className="mb-8 text-center md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="mb-3 bg-gradient-to-r from-[#8B4513] via-[#8B4513] to-[#6d3610] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:mb-4 md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            MSME Overview
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-base text-neutral-600 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Explore the diverse landscape of Micro, Small, and Medium
            Enterprises driving Iloilo&apos;s economic growth across various
            sectors
          </motion.p>
        </motion.div>

        {/* Enhanced Sector Cards - Mobile-first grid */}
        <motion.div
          className="mb-8 rounded-2xl border border-white/20 bg-white/60 p-4 shadow-xl backdrop-blur-sm sm:rounded-3xl sm:p-6 md:mb-12 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-7">
            {msmeData.map((sector, index) => {
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
                  className="group relative overflow-hidden rounded-xl bg-white/70 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl sm:rounded-2xl sm:p-4 md:p-6 md:hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: index * 0.05,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-10 sm:rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${sectorColor}20, ${sectorColor}05)`,
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-full shadow-md sm:mb-3 sm:h-12 sm:w-12 md:mb-4 md:h-16 md:w-16 md:shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${sectorColor}15, ${sectorColor}05)`,
                        border: `2px solid ${sectorColor}20`,
                      }}
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.4 }}
                    >
                      <SectorIcon
                        style={{ color: sectorColor }}
                        className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8"
                      />
                    </motion.div>

                    <motion.div
                      className="mb-1 sm:mb-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-lg font-bold sm:text-xl md:text-3xl lg:text-4xl">
                        <RollingNumber value={sector.count} />
                      </span>
                    </motion.div>

                    <p className="text-xs font-semibold leading-tight text-neutral-700 sm:text-sm">
                      {sector.sectorName}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Total Summary - Mobile optimized */}
        <motion.div
          className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 p-6 shadow-xl backdrop-blur-sm sm:rounded-3xl sm:p-8 md:p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:gap-8">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/10 shadow-lg sm:h-20 sm:w-20 md:h-24 md:w-24">
                <UsersRound className="h-8 w-8 text-[#8B4513] sm:h-10 sm:w-10 md:h-12 md:w-12" />
              </div>
            </motion.div>

            <div className="flex flex-col text-center md:text-left">
              <motion.div
                className="flex items-baseline justify-center gap-2 md:justify-start md:gap-3"
                whileHover={{ scale: 1.05 }}
              >
                <span className="bg-gradient-to-r from-[#8B4513] to-[#6d3610] bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl">
                  <RollingNumber value={totalMSMEs} />
                </span>
                <span className="text-xl font-semibold text-[#8B4513] sm:text-2xl">
                  +
                </span>
              </motion.div>

              <p className="text-base font-medium text-neutral-700 sm:text-lg md:text-xl">
                Total registered MSMEs across all sectors
              </p>

              <motion.p
                className="mt-1 text-xs text-neutral-500 sm:mt-2 sm:text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                Driving economic growth and innovation in Iloilo
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

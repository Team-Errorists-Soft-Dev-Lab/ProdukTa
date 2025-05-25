"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/landing-page/hero";
import DataSection from "@/components/landing-page/data-section";
import CallToAction from "@/components/landing-page/Call-to-Action";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reference from "@/components/landing-page/Reference";
import { SECTOR_COLORS } from "@/lib/sector-colors";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const DynamicBarChart2 = dynamic(
  () => import("@/components/landing-page/BarChart"),
  {
    ssr: false,
  },
);

// Type definitions for our data
interface MSME {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

interface SectorData {
  sectorId: string;
  count: number;
  sectorName: string;
  topMSMEs: MSME[];
}

interface ApiResponse {
  formattedMSMEs: SectorData[];
}

interface ChartData {
  label: string;
  color: string;
  data: { name: string; uv: number }[];
}

function validateApiResponse(jsonData: {
  formattedMSMEs: {
    sectorId: string;
    count: number;
    sectorName: string;
    topMSMEs: {
      id: string;
      name: string;
      address: string;
      createdAt: string;
    }[];
  }[];
}): {
  formattedMSMEs: {
    sectorId: string;
    count: number;
    sectorName: string;
    topMSMEs: {
      id: string;
      name: string;
      address: string;
      createdAt: string;
    }[];
  }[];
} {
  if (
    Array.isArray(jsonData?.formattedMSMEs) &&
    jsonData.formattedMSMEs.every(
      (sector: {
        sectorId: string;
        count: number;
        sectorName: string;
        topMSMEs: {
          id: string;
          name: string;
          address: string;
          createdAt: string;
        }[];
      }) =>
        !isNaN(Number(sector.sectorId)) &&
        typeof sector.count === "number" &&
        typeof sector.sectorName === "string" &&
        Array.isArray(sector.topMSMEs) &&
        sector.topMSMEs.every(
          (msme: MSME) =>
            typeof msme.id === "number" &&
            typeof msme.name === "string" &&
            typeof msme.address === "string" &&
            typeof msme.createdAt === "string",
        ),
    )
  ) {
    return {
      formattedMSMEs: jsonData.formattedMSMEs.map((sector) => ({
        ...sector,
        sectorId: String(sector.sectorId),
      })),
    };
  }
  throw new Error("Invalid API response format");
}

export default function LandingPage() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMSMEData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/msme/count");

        if (!response.ok) {
          throw new Error("Failed to fetch MSME data");
        }

        const jsonData = (await response.json()) as ApiResponse;
        const data: ApiResponse = validateApiResponse(jsonData);

        // Transform API data to match the chart data structure
        const transformedData = data.formattedMSMEs.map((sector) => {
          // Create a map of addresses and their counts
          const addressCounts = new Map<string, number>();

          // Count MSMEs by address
          sector.topMSMEs.forEach((msme) => {
            const address = msme.address;
            addressCounts.set(address, (addressCounts.get(address) || 0) + 1);
          });

          // Convert to the format expected by the chart
          const chartDataPoints = Array.from(addressCounts.entries())
            .map(([name, count]) => ({ name, uv: count }))
            .sort((a, b) => b.uv - a.uv) // Sort by count descending
            .slice(0, 5); // Take top 5

          // Get the color for this sector
          const sectorKey = sector.sectorName.replace(
            /\s+/g,
            " ",
          ) as keyof typeof SECTOR_COLORS;
          const color = SECTOR_COLORS[sectorKey] || "#888888"; // Fallback color

          return {
            label: sector.sectorName,
            color: color,
            data: chartDataPoints,
          };
        });

        setChartData(transformedData);
      } catch (err) {
        console.error("Error fetching MSME data:", err);
        setError("Failed to load MSME data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMSMEData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f9f8f4] to-[#f5f4f0]">
      <Header />
      <main className="relative">
        <Hero />
        <div id="data-section" className="scroll-smooth">
          <DataSection />
        </div>

        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:py-20">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-20 h-64 w-64 rounded-full bg-gradient-to-r from-[#8B4513]/5 to-transparent blur-3xl" />
            <div className="absolute bottom-20 right-0 h-64 w-64 rounded-full bg-gradient-to-l from-[#8B4513]/5 to-transparent blur-3xl" />

            {/* Mobile-specific decorative elements */}
            <div className="from-[#8B4513]/8 absolute left-4 top-16 h-20 w-20 rounded-full bg-gradient-to-br to-transparent blur-2xl md:hidden" />
            <div className="from-[#8B4513]/6 absolute bottom-16 right-6 h-16 w-16 rounded-full bg-gradient-to-tl to-transparent blur-xl md:hidden" />
          </div>

          <div className="relative mb-8 text-center md:mb-12">
            <motion.div
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm sm:mb-6 sm:px-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#8B4513]" />
              <span className="text-xs font-semibold text-[#8B4513] sm:text-sm">
                Data Insights
              </span>
            </motion.div>

            <motion.h2
              className="mb-3 bg-gradient-to-r from-[#8B4513] via-[#8B4513] to-[#6d3610] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:mb-4 md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Sector Distribution Analysis
            </motion.h2>

            <motion.p
              className="mx-auto max-w-3xl text-base text-neutral-600 sm:text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Visualizing MSME distribution across different sectors and
              locations to understand the economic landscape of Iloilo
            </motion.p>
          </div>

          {error && (
            <motion.div
              className="mb-6 rounded-xl border border-red-100 bg-red-50/80 p-4 text-center backdrop-blur-sm sm:mb-8 sm:rounded-2xl sm:p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-medium text-red-600 sm:text-base">
                {error}
              </p>
            </motion.div>
          )}

          {isLoading ? (
            <motion.div
              className="flex justify-center py-12 md:py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/20 bg-white/60 p-8 backdrop-blur-sm sm:rounded-2xl sm:p-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-10 w-10 text-[#8B4513] sm:h-12 sm:w-12" />
                </motion.div>
                <p className="mt-3 text-base text-[#120f0c]/80 sm:mt-4 sm:text-lg">
                  Loading chart data...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 justify-items-center gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {chartData.slice(0, 6).map((chart, index) => (
                <motion.div
                  key={index}
                  className="group w-full rounded-xl border border-white/20 bg-white/60 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-xl sm:rounded-2xl sm:p-6 md:hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DynamicBarChart2
                    data={chart.data}
                    label={chart.label}
                    color={chart.color}
                  />
                </motion.div>
              ))}

              {chartData.length === 7 && (
                <motion.div
                  className="col-span-1 mx-auto flex w-full max-w-md justify-center md:col-span-2 lg:col-span-3"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="w-full rounded-xl border border-white/20 bg-white/60 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl sm:rounded-2xl sm:p-6">
                    {chartData[6] && (
                      <DynamicBarChart2
                        data={chartData[6].data}
                        label={chartData[6].label}
                        color={chartData[6].color}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </section>

        <CallToAction />
        <Reference />
      </main>
      <Footer />
    </div>
  );
}

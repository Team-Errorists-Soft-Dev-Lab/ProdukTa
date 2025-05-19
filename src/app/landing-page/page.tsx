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
        console.log("API Response:", jsonData);
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

  useEffect(() => {
    if (chartData) {
      console.log("Chart Data:", chartData);
    }
  }, [chartData]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div id="data-section" className="scroll-smooth">
          <DataSection />
        </div>

        <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="mb-8">
            <h2 className="mb-2 text-center text-3xl font-bold text-[#8B4513]">
              Sector Distribution Analysis
            </h2>
            <p className="mx-auto max-w-2xl text-center text-[#8B4513] text-muted-foreground">
              Visualizing MSME distribution across different sectors and
              locations
            </p>
          </div>

          {error && (
            <div className="mb-8 rounded-lg bg-red-50 p-6 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {isLoading ? (
            <section className="flex justify-center bg-[#f9f8f4] py-10">
              <div className="flex w-full max-w-6xl flex-col items-center justify-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-[#8B4513]" />
                <p className="mt-4 text-[#120f0c]/80">Loading MSME data...</p>
              </div>
            </section>
          ) : (
            <div className="grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
              {chartData.slice(0, 6).map((chart, index) => (
                <div key={index} className="w-full rounded-lg bg-card p-4">
                  <DynamicBarChart2
                    data={chart.data}
                    label={chart.label}
                    color={chart.color}
                  />
                </div>
              ))}

              {chartData.length === 7 && (
                <div className="col-span-1 mx-auto flex w-full max-w-md justify-center md:col-span-2 lg:col-span-3">
                  <div className="w-full rounded-lg bg-card p-4">
                    {chartData[6] && (
                      <DynamicBarChart2
                        data={chartData[6].data}
                        label={chartData[6].label}
                        color={chartData[6].color}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <CallToAction />
        <Reference />
      </main>
      <Footer />
    </div>
  );
}

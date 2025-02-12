"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LandingPagePieChart } from "./PieChart";
import { SECTOR_COLORS } from "@/lib/sector-colors";
import dynamic from "next/dynamic";

const DynamicHorizontalBarChart = dynamic(
  () => import("./HorizontalBarChart"),
  { ssr: false },
);

export default function DataSection() {
  const MSMEPerSector = [
    {
      name: "Bamboo",
      value: 295,
      color: SECTOR_COLORS.Bamboo,
    },
    {
      name: "Cacao",
      value: 215,
      color: SECTOR_COLORS.Cacao,
    },
    {
      name: "Coffee",
      value: 245,
      color: SECTOR_COLORS.Coffee,
    },
    {
      name: "High Value Coco Products",
      value: 205,
      color: SECTOR_COLORS.Coconut,
    },
    {
      name: "Homestyles and Wearables",
      value: 195,
      color: SECTOR_COLORS["Wearables and Homestyles"],
    },
    {
      name: "IT-BPM",
      value: 85,
      color: SECTOR_COLORS["IT - BPM"],
    },
    {
      name: "Processed Foods",
      value: 130,
      color: SECTOR_COLORS["Processed Foods"],
    },
  ];

  const totalMSMEs = MSMEPerSector.reduce(
    (sum, sector) => sum + sector.value,
    0,
  );

  return (
    <section className="space-y-8 py-20">
      <div className="container max-w-full bg-[#8B4513]">
        <div className="w-full text-center">
          <Card>
            <CardHeader className="bg-[#996439]">
              <CardTitle className="text-3xl font-bold text-white">
                Open Data
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <Card className="border-[#DEB887] shadow-lg">
              <CardHeader className="rounded-t-lg bg-[#996439]">
                <CardTitle className="text-2xl font-semibold text-white">
                  Total Registered MSMEs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <span className="text-4xl font-bold text-[#8B4513]">
                    {totalMSMEs}
                  </span>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Total registered MSMEs across all sectors
                  </p>
                </div>
              </CardContent>
            </Card>
            <DynamicHorizontalBarChart data={MSMEPerSector} />
          </div>
          <div className="space-y-4">
            <Card className="border-[#DEB887] shadow-lg">
              <CardHeader className="rounded-t-lg bg-[#996439]">
                <CardTitle className="text-2xl font-semibold text-white">
                  Sector Distribution
                </CardTitle>
                <CardDescription className="text-white/80">
                  Current MSME Distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <LandingPagePieChart
                  sectors={MSMEPerSector}
                  colors={MSMEPerSector.map((sector) => sector.color)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

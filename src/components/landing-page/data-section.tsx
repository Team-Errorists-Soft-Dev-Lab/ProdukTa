"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingPagePieChart } from "./PieChart";

export default function DataSection() {
  const COLORS = [
    "#10B981", // Emerald
    "#6366F1", // Indigo
    "#F59E0B", // Ambers
    "#EC4899", // Pink
    "#8B5CF6", // Purple
    "#0EA5E9", // Sky
    "#F97316", // Orange
    "#A855F7", // Fuchsia
    "#EA580C", // Orange (darker)
    "#3B82F6", // Blue
  ];

  const MSMEPerSector = [
    {
      name: "Bamboo",
      value: 295,
    },
    {
      name: "Cacao",
      value: 215,
    },
    {
      name: "Coffee",
      value: 245,
    },
    {
      name: "High Value Coco Products",
      value: 205,
    },
    {
      name: "Homestyles and Wearables",
      value: 195,
    },
    {
      name: "IT-BPM",
      value: 85,
    },
    {
      name: "Processed foods",
      value: 130,
    },
  ];

  return (
    <section className="py-20">
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
      <div className="grid grid-cols-1 gap-6 p-12 md:grid-cols-2 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1">
          <Card className="cursor-pointer border-[#DEB887] transition-shadow hover:shadow-lg">
            <CardHeader className="rounded-md bg-[#996439]">
              <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight text-white">
                Total Registered MSMEs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mt-2 text-xl font-semibold text-[#8B4513]">
                652
              </CardTitle>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border-[#DEB887] transition-shadow hover:shadow-lg">
            <CardHeader className="rounded-md bg-[#996439]">
              <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight text-white">
                Total Sectors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mt-2 text-xl font-semibold text-[#8B4513]">
                7
              </CardTitle>
            </CardContent>
          </Card>
        </div>
        <div>
          <LandingPagePieChart sectors={MSMEPerSector} colors={COLORS} />
        </div>
      </div>
    </section>
  );
}

"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/landing-page/hero";
import DataSection from "@/components/landing-page/data-section";
import CallToAction from "@/components/landing-page/Call-to-Action";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reference from "@/components/landing-page/Reference";
import { SECTOR_COLORS } from "@/lib/sector-colors";

const DynamicBarChart2 = dynamic(
  () => import("@/components/landing-page/BarChart"),
  {
    ssr: false,
  },
);

const barChartData = [
  {
    label: "Bamboo",
    color: SECTOR_COLORS.Bamboo,
    data: [
      { name: "Leganes", uv: 65 },
      { name: "Pavia", uv: 59 },
      { name: "Pototan", uv: 80 },
      { name: "Oton", uv: 81 },
      { name: "Calinog", uv: 56 },
    ],
  },
  {
    label: "Cacao",
    color: SECTOR_COLORS.Cacao,
    data: [
      { name: "Leganes", uv: 65 },
      { name: "Pavia", uv: 59 },
      { name: "Pototan", uv: 80 },
      { name: "Oton", uv: 81 },
      { name: "Calinog", uv: 56 },
    ],
  },
  {
    label: "Coffee",
    color: SECTOR_COLORS.Coffee,
    data: [
      { name: "Leganes", uv: 65 },
      { name: "Pavia", uv: 59 },
      { name: "Pototan", uv: 80 },
      { name: "Oton", uv: 81 },
      { name: "Calinog", uv: 56 },
    ],
  },
  {
    label: "High Value Coco Products",
    color: SECTOR_COLORS.Coconut,
    data: [
      { name: "Leganes", uv: 65 },
      { name: "Pavia", uv: 59 },
      { name: "Pototan", uv: 80 },
      { name: "Oton", uv: 81 },
      { name: "Calinog", uv: 56 },
    ],
  },
  {
    label: "Homestyles and Wearables",
    color: SECTOR_COLORS["Wearables and Homestyles"],
    data: [
      { name: "Leganes", uv: 65 },
      { name: "Pavia", uv: 59 },
      { name: "Pototan", uv: 80 },
      { name: "Oton", uv: 81 },
      { name: "Calinog", uv: 56 },
    ],
  },
  {
    label: "IT-BPM",
    color: SECTOR_COLORS["IT - BPM"],
    data: [
      { name: "Leganes", uv: 65 },
      { name: "Pavia", uv: 59 },
      { name: "Pototan", uv: 80 },
      { name: "Oton", uv: 81 },
      { name: "Calinog", uv: 56 },
    ],
  },
  {
    label: "Processed Foods",
    color: SECTOR_COLORS["Processed Foods"],
    data: [
      { name: "Leganes", uv: 65 },
      { name: "Pavia", uv: 59 },
      { name: "Pototan", uv: 80 },
      { name: "Oton", uv: 81 },
      { name: "Calinog", uv: 56 },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <DataSection />
        <div className="grid grid-cols-1 gap-6 p-12 md:grid-cols-1 lg:grid-cols-2">
          {barChartData.map((chartData, index) => (
            <div key={index}>
              <DynamicBarChart2
                data={chartData.data}
                label={chartData.label}
                color={chartData.color}
              />
            </div>
          ))}
        </div>
        <CallToAction />
        <Reference />
      </main>
      <Footer />
    </div>
  );
}

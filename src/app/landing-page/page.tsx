"use client";

import Hero from "@/components/hero";
import Features from "@/components/Features";
import DataSection from "@/components/data-section";
import CallToAction from "@/components/Call-to-Action";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import BarChart from "@/components/BarChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const barChartData = [
  {
    cardTitle: "Top 5 municipalities for Bamboo",
    labels: ["leganes", "Pavia", "Pototan", "Oton", "Calinog"],
    label: "Bamboo",
    data: [65, 59, 80, 81, 56, 55],
  },

  {
    cardTitle: "Top 5 municipalities for Cacao",
    labels: ["leganes", "Pavia", "Pototan", "Oton", "Calinog"],
    label: "Cacao",
    data: [65, 59, 80, 81, 56, 55],
  },

  {
    cardTitle: "Top 5 municipalities for Coffee",
    labels: ["leganes", "Pavia", "Pototan", "Oton", "Calinog"],
    label: "Coffee",
    data: [65, 59, 80, 81, 56, 55],
  },

  {
    cardTitle: "Top 5 municipalities for High Value Coco Products",
    labels: ["leganes", "Pavia", "Pototan", "Oton", "Calinog"],
    label: "High Value Coco Products",
    data: [65, 59, 80, 81, 56, 55],
  },

  {
    cardTitle: "Top 5 municipalities for Homestyles and Wearables",
    labels: ["leganes", "Pavia", "Pototan", "Oton", "Calinog"],
    label: "Homestyles and Wearables",
    data: [65, 59, 80, 81, 56, 55],
  },

  {
    cardTitle: "Top 5 municipalities for IT-BPM",
    labels: ["leganes", "Pavia", "Pototan", "Oton", "Calinog"],
    label: "IT_BPM",
    data: [65, 59, 80, 81, 56, 55],
  },

  {
    cardTitle: "Top 5 municipalities for Processed Foods",
    labels: ["leganes", "Pavia", "Pototan", "Oton", "Calinog"],
    label: "Processed Foods",
    data: [65, 59, 80, 81, 56, 55],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <DataSection />
        <div className="grid grid-cols-1 gap-6 p-12 md:grid-cols-2 lg:grid-cols-2">
          {barChartData.map((data, index) => (
            <BarChart
              key={index}
              cardTitle={data.cardTitle}
              labels={data.labels}
              label={data.label}
              data={data.data}
            />
          ))}
        </div>
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

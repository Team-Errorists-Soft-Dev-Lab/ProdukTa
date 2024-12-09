import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CardTitle } from "@/components/ui/card";
import { Card, CardHeader, CardContent } from "@mui/material";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export interface BarChartProps {
  cardTitle: string;
  labels: string[];
  label: string;
  data: number[];
}

const BarChart: React.FC<BarChartProps> = ({
  cardTitle,
  labels,
  label,
  data,
}) => {
  const exportAnalytics = {
    labels: labels,
    datasets: [
      {
        label,
        data: data,
        backgroundColor: "rgba(16, 185, 129, 0.6)", // Slightly less opaque for better layering
        borderColor: "rgb(16, 185, 129)", // emerald-500
        borderWidth: 3, // Thicker border for better definition
        hoverBackgroundColor: "rgba(16, 185, 129, 0.8)", // More opaque on hover
        hoverBorderColor: "rgb(16, 185, 129)", // Solid border on hover
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow height adjustment
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 20,
          padding: 15,
          color: "#4B5563", // Darker color for better readability
        },
      },
      title: {
        display: true,
        text: `Top 5 Municipalities for ${label}`,
        font: {
          size: 24, // Increased font size for better visibility
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          color: "#4B5563", // Darker color for better readability
        },
        grid: {
          color: "#E5E7EB", // Light gray grid lines
          lineWidth: 1, // Thinner grid lines for a cleaner look
        },
      },
      x: {
        grid: {
          color: "#E5E7EB", // Light gray grid lines
          lineWidth: 1, // Thinner grid lines for a cleaner look
        },
      },
    },
  };

  return (
    <div className="bg-background">
      <div className="mt-6">
        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle>{cardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Bar options={chartOptions} data={exportAnalytics} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarChart;

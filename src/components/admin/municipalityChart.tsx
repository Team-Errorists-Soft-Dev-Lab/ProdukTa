"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// const COLORS = [
//   "hsl(215, 100%, 60%)", // Vibrant light blue
//   "hsl(25, 100%, 60%)", // Vibrant light yellow
//   "hsl(150, 100%, 60%)", // Vibrant light green
//   "hsl(280, 100%, 60%)", // Vibrant light purple
//   "hsl(350, 100%, 60%)", // Vibrant light red
// ];

const COLORS = [
  "hsl(215, 90%, 70%)", // Light blue
  "hsl(25, 95%, 70%)", // Light yellow
  "hsl(150, 80%, 70%)", // Light green
  "hsl(280, 80%, 70%)", // Light purple
  "hsl(350, 80%, 70%)", // Light red
];

export function TopMunicipalitiesChart({ sectorName }: { sectorName: string }) {
  const { msmes, sectors } = useMSMEContext();
  const [chartData, setChartData] = useState<
    Array<{
      municipality: string;
      count: number;
    }>
  >([]);

  useEffect(() => {
    const sector = sectors.find(
      (s) => s.name.toLowerCase() === sectorName.toLowerCase(),
    );

    if (sector) {
      const municipalityCounts = msmes
        .filter((msme) => msme.sectorId === sector.id)
        .reduce((acc, msme) => {
          const municipality = msme.cityMunicipalityAddress;
          acc.set(municipality, (acc.get(municipality) ?? 0) + 1);
          return acc;
        }, new Map<string, number>());

      const sortedMunicipalities = Array.from(municipalityCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([municipality, count]) => ({
          municipality,
          count,
        }));

      setChartData(sortedMunicipalities);
    }
  }, [msmes, sectors, sectorName]);

  const chartConfig = chartData.reduce((config, { municipality }, index) => {
    config[municipality] = {
      label: municipality,
      color: COLORS[index],
    };
    return config;
  }, {} as ChartConfig);

  const totalMSMEs = chartData.reduce((sum, { count }) => sum + count, 0);

  return (
    <Card className="flex w-[350px] flex-col border-[#996439]">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg text-[#996439]">
          Top 5 Municipalities
        </CardTitle>
        <CardDescription className="text-sm text-[#996439]">
          {sectorName} Sector Distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[300px] w-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="municipality"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                wrapperStyle={{
                  fontSize: "12px",
                  paddingLeft: "10px",
                }}
              />
              <text
                x="33%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[#996439] text-2xl font-bold"
              >
                TOP
              </text>
              <text
                x="32%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[#996439] text-3xl font-bold"
              >
                5
              </text>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 pt-2 text-xs">
        <div className="flex items-center gap-1 font-medium leading-none text-[#996439]">
          Total MSMEs: {totalMSMEs}
          <TrendingUp className="h-3 w-3" />
        </div>
        <div className="leading-tight text-[#996439] text-muted-foreground">
          <span className="text-[#996439]">
            Distribution of MSMEs across top municipalities
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

"use client";

import { Pie, PieChart, Cell, Label } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { SectorPieChartProps } from "@/types/sector";

export function SectorPieChart({ sectors, colors }: SectorPieChartProps) {
  // Calculate total MSMEs
  const totalMSMEs = sectors.reduce((acc, curr) => acc + curr.value, 0);

  // Chart configuration for sectors
  const sectorChartConfig = {
    ...Object.fromEntries(
      sectors.map((sector) => [
        sector.name,
        {
          label: sector.name,
          color: colors[sectors.indexOf(sector) % colors.length],
        },
      ]),
    ),
  } satisfies ChartConfig;

  return (
    <Card className="border-emerald-600">
      <CardHeader>
        <CardTitle>Sector Distribution</CardTitle>
        <CardDescription>Current MSME Distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={sectorChartConfig} className="h-[400px] w-full">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden">
            {/* Centered Chart Section */}
            <div className="flex flex-shrink-0 justify-center">
              <div className="block sm:hidden">
                <PieChart width={220} height={220}>
                  <Pie
                    data={sectors}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={5}
                  >
                    {sectors.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 8}
                                dy="-0.5em"
                                className="fill-emerald-600 text-lg font-bold"
                              >
                                {totalMSMEs}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 12}
                                dy="0.5em"
                                className="fill-emerald-600/70 text-xs"
                              >
                                MSMEs
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent className="min-w-[180px] p-2 text-xs" />
                    }
                  />
                </PieChart>
              </div>
              <div className="hidden sm:block md:hidden">
                <PieChart width={280} height={240}>
                  <Pie
                    data={sectors}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={5}
                  >
                    {sectors.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 8}
                                dy="-0.5em"
                                className="fill-emerald-600 text-xl font-bold"
                              >
                                {totalMSMEs}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 12}
                                dy="0.5em"
                                className="fill-emerald-600/70 text-xs"
                              >
                                MSMEs
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent className="min-w-[200px] p-3 text-sm" />
                    }
                  />
                </PieChart>
              </div>
              <div className="hidden md:block lg:hidden">
                <PieChart width={320} height={260}>
                  <Pie
                    data={sectors}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={5}
                  >
                    {sectors.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 8}
                                dy="-0.5em"
                                className="fill-emerald-600 text-2xl font-bold"
                              >
                                {totalMSMEs}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 12}
                                dy="0.5em"
                                className="fill-emerald-600/70 text-sm"
                              >
                                MSMEs
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent className="min-w-[250px] p-3 text-sm" />
                    }
                  />
                </PieChart>
              </div>
              <div className="hidden lg:block">
                <PieChart width={380} height={280}>
                  <Pie
                    data={sectors}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={115}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={5}
                  >
                    {sectors.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 8}
                                dy="-0.5em"
                                className="fill-emerald-600 text-3xl font-bold"
                              >
                                {totalMSMEs}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 12}
                                dy="0.5em"
                                className="fill-emerald-600/70 text-sm"
                              >
                                MSMEs
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent className="min-w-[300px] p-4 text-base" />
                    }
                  />
                </PieChart>
              </div>
            </div>

            {/* Horizontal Legend Section */}
            <div className="w-full flex-shrink-0 overflow-hidden">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
                {sectors.map((sector, index) => (
                  <div
                    key={sector.name}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <div
                      className="h-3 w-3 flex-shrink-0 rounded-sm"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {sector.name} ({sector.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

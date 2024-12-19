"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell, Label } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Sector {
  name: string;
  value: number;
}

interface SectorPieChartProps {
  sectors: Sector[];
  colors: string[];
}

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
        <ChartContainer config={sectorChartConfig} className="h-[300px] w-full">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <PieChart width={400} height={300}>
                <Pie
                  data={sectors}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
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
            <div className="min-w-[150px] space-y-3">
              {sectors.map((sector, index) => (
                <div key={sector.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm font-medium">
                    {sector.name} ({sector.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Growth of 12% from last quarter <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Distribution of MSMEs across sectors
        </div>
      </CardFooter>
    </Card>
  );
}

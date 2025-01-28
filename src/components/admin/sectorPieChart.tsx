"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
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
    <Card className="h-[445px] w-[350px] items-center border-[#996439]">
      <CardHeader className="items-center p-4 pb-0">
        <CardTitle className="text-lg text-[#996439]">
          Sector Distribution
        </CardTitle>
        <CardDescription className="text-sm text-[#996439]">
          Current MSME Distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={sectorChartConfig} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectors}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                strokeWidth={2}
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
                            y={(viewBox.cy ?? 0) + 4}
                            dy="-0.5em"
                            className="fill-amber-900 text-2xl font-bold"
                          >
                            {totalMSMEs}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 6}
                            dy="1em"
                            className="fill-amber-600/70 text-xs"
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
                  <ChartTooltipContent className="min-w-[120px] p-2 text-sm" />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 p-4 text-xs">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-3 w-3" />
        </div>
        <div className="leading-none text-[#996439] text-muted-foreground">
          <span className="text-[#996439]">
            Distribution of MSMEs across sectors
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

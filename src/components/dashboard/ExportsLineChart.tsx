"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { ExportsLineChartProps } from "@/types/export";
import { useMemo } from "react";

export function ExportsLineChart({ data, option }: ExportsLineChartProps) {
  // Chart configuration for exports
  const exportChartConfig = {
    exports: {
      label: "Exports",
      color: "#10B981", // Emerald green
    },
    month: {
      label: "Month",
    },
  } satisfies ChartConfig;

  const trendPercentage = useMemo(() => {
    const currentMonthExports = data[data.length - 1]?.exports || 0;
    const previousMonthExports = data[data.length - 2]?.exports || 0;

    if (previousMonthExports === 0) return 0; // Avoid division by zero

    return (
      ((currentMonthExports - previousMonthExports) / previousMonthExports) *
      100
    );
  }, [data]);

  return (
    <Card className="border-emerald-600">
      <CardHeader>
        <CardTitle>Export Analytics</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={exportChartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  className="min-w-[250px] p-4 text-base"
                />
              }
            />
            <Line
              dataKey="exports"
              type="natural"
              stroke="#10B981"
              strokeWidth={2}
              dot={{
                fill: "#10B981",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {trendPercentage > 0 ? (
          <div>
            <div className="leading-none text-muted-foreground">
              Showing export trends for {option}
            </div>
          </div>
        ) : (
          <div className="flex gap-2 font-medium leading-none">
            <p>Not enough data to derive trend percentage</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

"use client";

import { TrendingUp } from "lucide-react";
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
interface ExportsLineChartProps {
  data: { month: string; exports: number }[];
  totalExports: number;
}

export function ExportsLineChart({
  data,
  // totalExports,
}: ExportsLineChartProps) {
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
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing export trends for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

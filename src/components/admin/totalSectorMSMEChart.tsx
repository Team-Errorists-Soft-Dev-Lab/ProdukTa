"use client";

import { PieChart, Pie, Cell } from "recharts";
import { CardContent } from "@/components/ui/card";
import type { SmallSectorPieChartProps } from "@/types/sector";

export function TotalSectorMSMEChart({
  totalMSMEs,
  sectorName,
}: SmallSectorPieChartProps) {
  // Create data for the donut chart
  const data = [{ name: sectorName, value: 1 }];

  return (
    <CardContent className="relative p-0">
      <PieChart width={140} height={140}>
        <Pie
          data={data}
          cx={70}
          cy={70}
          innerRadius={40}
          outerRadius={65}
          startAngle={0}
          endAngle={360}
          paddingAngle={0}
          dataKey="value"
        >
          <Cell fill="#996439" />
        </Pie>
        <text
          x={75}
          y={60}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[#996439] text-3xl font-bold"
        >
          {totalMSMEs}
        </text>
        <text
          x={75}
          y={85}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-M fill-[#996439] font-bold"
        >
          MSMEs
        </text>
      </PieChart>
    </CardContent>
  );
}

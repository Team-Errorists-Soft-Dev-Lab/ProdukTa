"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

interface SectorData {
  name: string;
  value: number;
  color: string;
}

interface HorizontalBarChartProps {
  data: SectorData[];
}

export default function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card className="border-[#DEB887] shadow-lg">
      <CardHeader className="rounded-t-lg bg-[#996439]">
        <CardTitle className="text-2xl font-semibold text-white">
          MSMEs per Sector
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={sortedData}
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #DEB887",
                }}
                formatter={(value: number) => [`${value} MSMEs`]}
              />
              <Bar dataKey="value" name="Number of MSMEs" fill="#8B4513">
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

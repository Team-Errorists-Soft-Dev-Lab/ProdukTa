import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import type { BarChart2Props } from "@/types/charts";

// Replace the MSMEPerSector array with the hardcoded SECTOR_COLORS object
export const SECTOR_COLORS = {
  Coffee: "#000000",
  Cacao: "#8B4513", // Saddle brown for chocolate
  Coconut: "#FF0000", // Tropical green for coconut
  "Processed Foods": "#FFA500", // Burnt orange for food processing
  "Wearables and Homestyles": "#8A2BE2", // Dark blue for fashion/home
  Bamboo: "#6B8E23", // Fresh bamboo green
  "IT-BPM": "#2196F3", // Strong blue for technology
} as const;

export type SectorColorKey = keyof typeof SECTOR_COLORS;

// Update the getSectorInfo function to use the SECTOR_COLORS object
const getSectorInfo = (sectorName: string) => {
  // Check for exact match first
  if (sectorName in SECTOR_COLORS) {
    return { color: SECTOR_COLORS[sectorName as SectorColorKey] };
  }

  // Handle special cases with name variations
  if (sectorName === "High Value Coco Product") {
    return { color: SECTOR_COLORS.Coconut };
  }

  // Default fallback color
  return { color: "#93191d" };
};

const BarChart2: React.FC<BarChart2Props> = ({ data, label }) => {
  const { color } = getSectorInfo(label);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-6 pb-2">
      <Card className="w-full max-w-md border border-gray-300 shadow-lg">
        <CardHeader
          className="rounded-t-lg py-4 text-center"
          style={{ backgroundColor: color }}
        >
          <CardTitle className="text-lg font-semibold text-white">
            Top {data.length > 5 ? 5 : data.length}{" "}
            {data.length === 1 ? "Municipality" : "Municipalities"} for {label}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex h-[300px] w-full justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={400}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 20,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: number) =>
                    Math.round(value).toString()
                  }
                  allowDecimals={false}
                />
                <Tooltip cursor={{ fill: "#f5f5f5" }} />
                <Legend />
                <Bar
                  dataKey="uv"
                  name={label}
                  fill={color}
                  radius={[5, 5, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarChart2;

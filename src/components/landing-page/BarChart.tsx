"use client";

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
import { SECTOR_COLORS } from "@/lib/sector-colors";

const MSMEPerSector = [
  { name: "Bamboo", color: SECTOR_COLORS.Bamboo },
  { name: "Coffee", color: SECTOR_COLORS.Coffee },
  { name: "Cacao", color: SECTOR_COLORS.Cacao },
  { name: "High Value Coco Product", color: SECTOR_COLORS.Coconut },
  {
    name: "Homestyles and Wearables",
    color: SECTOR_COLORS["Wearables and Homestyles"],
  },
  { name: "Processed Foods", color: SECTOR_COLORS["Processed Foods"] },
  { name: "IT-BPM", color: SECTOR_COLORS["IT - BPM"] },
];

const getSectorInfo = (sectorName: string) => {
  return (
    MSMEPerSector.find((sector) => sector.name === sectorName) ?? {
      color: "#93191d",
    }
  );
};

interface BarChart2Props {
  data: Array<{ name: string; uv: number }>;
  label: string;
  color?: string;
}

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
            Top 5 Municipalities for {label}
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
                <YAxis tick={{ fontSize: 12 }} />
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

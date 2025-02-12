"use client";

// import { Card, CardHeader, CardContent } from "@mui/material";
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
} from "recharts";

interface BarChart2Props {
  data: Array<{
    name: string;
    uv: number;
  }>;
  label: string;
  color?: string;
}

const BarChart2: React.FC<BarChart2Props> = ({
  data,
  label,
  color = "#8B4513",
}) => {
  return (
    <Card className="border-emerald-600">
      <CardHeader className="rounded-md bg-[#996439]">
        <CardTitle className="text-white">
          Top 5 Municipalities for {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="uv" name={label} fill={color} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart2;

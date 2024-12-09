"use client";

// import { Card, CardHeader, CardContent } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

interface BarChart2Props {
  data: {
    name: string;
    uv: number;
  }[];
  label: string;
}

const BarChart2: React.FC<BarChart2Props> = ({ data, label }) => {
  return (
    <Card className="border-emerald-600">
      <CardHeader className="rounded-md bg-[#996439]">
        <CardTitle className="text-white">
          Top 5 Municipalities for {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="uv" fill="#BB987AFF" />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default BarChart2;

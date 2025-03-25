"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VisitorData {
  msmeId: number;
  visitCount: number;
  companyName: string;
}

//note: wat if multiple most visited MSME?

export function VisitorCountView({ sectorId }: { sectorId: number }) {
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [mostVisitedMSME, setMostVisitedMSME] = useState("");

  useEffect(() => {
    const fetchVisitorData = async () => {
      const response = await fetch(`/api/admin/visitors/${sectorId}`);
      const data = (await response.json()) as { results: VisitorData[] };
      if (data.results) {
        setVisitorData(data.results);
      }
    };

    fetchVisitorData().catch((error) =>
      console.error("Error fetching visitor data:", error),
    );
  }, [sectorId]);

  useEffect(() => {
    if (visitorData.length > 0) {
      const totalVisitors = visitorData.reduce(
        (acc, data) => acc + data.visitCount,
        0,
      );
      setVisitorCount(totalVisitors);
      const mostVisited = visitorData.reduce((prev, current) =>
        current.visitCount > prev.visitCount ? current : prev,
      );
      setMostVisitedMSME(mostVisited.companyName);
    }
  }, [visitorData]);

  return (
    <div className="flex bg-gray-50">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard title="Total Visits" value={visitorCount} />
          <StatCard
            title="Most Visited MSME"
            value={mostVisitedMSME || "////////"}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div>
      <Card className="border-2">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <span className="text-4xl font-bold text-[#a67c52]">{value}</span>
          <p className="mt-2 text-sm text-gray-600">{title}</p>
        </CardContent>
      </Card>
    </div>
  );
}

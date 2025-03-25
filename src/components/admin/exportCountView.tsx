"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MSMEDetails {
  companyName: string;
}

interface ExportData {
  exportCount: number;
  totalExports: number;
  msmeDetails: MSMEDetails;
}

export function ExportCountView({ sectorId }: { sectorId: number }) {
  const [exportData, setExportData] = useState<ExportData>();

  useEffect(() => {
    const fetchVisitorData = async () => {
      const response = await fetch(`/api/admin/export/${sectorId}`);
      const data = await response.json();
      console.log("data: ", data);
      if (data.results) {
        setExportData(data.results);
      }
    };
    fetchVisitorData();
  }, []);

  return (
    <div className="flex bg-gray-50">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {exportData && (
            <div>
              <StatCard title="Total Exports" value={exportData.totalExports} />
              <StatCard
                title="Most Exported MSME"
                value={exportData.msmeDetails.companyName}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <Card className="border-2">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl font-bold text-[#a67c52]">{value}</span>
        <p className="mt-2 text-sm text-gray-600">{title}</p>
      </CardContent>
    </Card>
  );
}

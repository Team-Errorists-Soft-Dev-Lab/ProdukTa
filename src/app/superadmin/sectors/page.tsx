"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";

interface Sector {
  id: number;
  name: string;
  adminCount: number;
  msmeCount: number;
}

export default function ManageSectors() {
  const { sectors } = useSuperAdminContext();

  return (
    <div className="p-4 md:p-6">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-800">
          Manage Sectors
        </CardTitle>
        <CardDescription className="text-gray-600">
          Total: {sectors.length} Sectors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector: Sector) => (
            <Card
              key={sector.id}
              className="rounded-lg border border-emerald-600 bg-white shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {sector.name}
                </CardTitle>
                <CardDescription>
                  Admin Count: {sector.adminCount} | MSME Count:{" "}
                  {sector.msmeCount}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </CardContent>
    </div>
  );
}

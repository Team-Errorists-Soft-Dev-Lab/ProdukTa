"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Edit, Trash, Plus } from "lucide-react";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
import AddSectorModal from "@/components/modals/AddSectorModal";

export default function ManageSectors() {
  const { sectors } = useSuperAdminContext();
  const [isAddSectorModalOpen, setIsAddSectorModalOpen] = useState(false);

  return (
    <div className="p-4 md:p-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Manage Sectors
          </CardTitle>
          <CardDescription className="text-gray-600">
            Total: {sectors.length} Sectors
          </CardDescription>
        </div>
        <Button
          onClick={() => setIsAddSectorModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Sector
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector) => (
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
              <CardContent className="flex justify-end">
                <Button variant="ghost" size="sm" className="mr-2">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <AddSectorModal
          isOpen={isAddSectorModalOpen}
          onClose={() => setIsAddSectorModalOpen(false)}
        />
      </CardContent>
    </div>
  );
}

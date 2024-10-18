"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
import AddSectorModal from "@/components/modals/AddSectorModal";

export default function ManageSectors() {
  const { sectors } = useSuperAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSectorModalOpen, setIsAddSectorModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Sectors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between">
          <Input
            type="text"
            placeholder="Search sectors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => setIsAddSectorModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sector
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sector Name</TableHead>
              <TableHead>Admin Count</TableHead>
              <TableHead>MSME Count</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectors.map((sector) => (
              <TableRow key={sector.id}>
                <TableCell>{sector.name}</TableCell>
                <TableCell>{sector.adminCount}</TableCell>
                <TableCell>{sector.msmeCount}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <AddSectorModal
        isOpen={isAddSectorModalOpen}
        onClose={() => setIsAddSectorModalOpen(false)}
      />
    </Card>
  );
}

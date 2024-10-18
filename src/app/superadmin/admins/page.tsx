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
import AddAdminModal from "@/components/modals/AddAdminModal";

export default function ManageAdmins() {
  const { admins } = useSuperAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Admins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between">
          <Input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => setIsAddAdminModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.sector}</TableCell>
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
      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
      />
    </Card>
  );
}

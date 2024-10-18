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
import { Edit, Trash, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";
import AddMSMEModal from "@/components/modals/AddMSMEModal";
import EditMSMEModal from "@/components/modals/EditMSMEModal";
import type { MSME } from "@/types/superadmin";

export default function ManageMSME() {
  const { msmes, handleDeleteMSME } = useSuperAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddMSMEModalOpen, setIsAddMSMEModalOpen] = useState(false);
  const [isEditMSMEModalOpen, setIsEditMSMEModalOpen] = useState(false);
  const [currentMSME, setCurrentMSME] = useState<MSME | null>(null);

  const filteredMSMEs = msmes.filter(
    (msme) =>
      msme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msme.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msme.businessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msme.sector.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedMSMEs = filteredMSMEs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredMSMEs.length / itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage MSMEs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between">
          <Input
            type="text"
            placeholder="Search MSMEs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => setIsAddMSMEModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add MSME
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMSMEs.map((msme) => (
              <TableRow key={msme.id}>
                <TableCell>{msme.name}</TableCell>
                <TableCell>{msme.sector}</TableCell>
                <TableCell>{msme.businessType}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      setCurrentMSME(msme);
                      setIsEditMSMEModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMSME(msme.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <AddMSMEModal
        isOpen={isAddMSMEModalOpen}
        onClose={() => setIsAddMSMEModalOpen(false)}
      />
      <EditMSMEModal
        isOpen={isEditMSMEModalOpen}
        onClose={() => setIsEditMSMEModalOpen(false)}
        msme={currentMSME}
      />
    </Card>
  );
}

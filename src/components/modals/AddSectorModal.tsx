import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";

interface AddSectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSectorModal({
  isOpen,
  onClose,
}: AddSectorModalProps) {
  const { handleAddSector } = useSuperAdminContext();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddSector({
      name,
      adminCount: 0,
      msmeCount: 0,
    });
    onClose();
    // Reset form
    setName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Sector</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Sector Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Add Sector</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

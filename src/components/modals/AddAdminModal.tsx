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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuperAdminContext } from "@/contexts/SuperAdminContext";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAdminModal({ isOpen, onClose }: AddAdminModalProps) {
  const { sectors, handleAddAdmin } = useSuperAdminContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddAdmin({
      name,
      email,
      sector,
    });
    onClose();
    // Reset form
    setName("");
    setEmail("");
    setSector("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="sector">Sector</Label>
            <Select onValueChange={setSector} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Add Admin</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

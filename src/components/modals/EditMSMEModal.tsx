import React, { useState, useEffect } from "react";
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
import type { MSME } from "@/types/superadmin";

interface EditMSMEModalProps {
  isOpen: boolean;
  onClose: () => void;
  msme: MSME | null;
}

export default function EditMSMEModal({
  isOpen,
  onClose,
  msme,
}: EditMSMEModalProps) {
  const { sectors, handleEditMSME } = useSuperAdminContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [sector, setSector] = useState("");

  useEffect(() => {
    if (msme) {
      setName(msme.name);
      setEmail(msme.email);
      setBusinessType(msme.businessType);
      setSector(msme.sector);
    }
  }, [msme]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (msme) {
      handleEditMSME({
        ...msme,
        name,
        email,
        businessType,
        sector,
      });
    }
    onClose();
  };

  if (!msme) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit MSME</DialogTitle>
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
            <Label htmlFor="businessType">Business Type</Label>
            <Input
              id="businessType"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="sector">Sector</Label>
            <Select onValueChange={setSector} defaultValue={sector} required>
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
          <Button type="submit">Update MSME</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

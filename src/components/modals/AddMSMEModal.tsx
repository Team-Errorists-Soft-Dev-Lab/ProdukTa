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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddMSMEModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMSMEModal({ isOpen, onClose }: AddMSMEModalProps) {
  const { sectors, handleAddMSME } = useSuperAdminContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [sector, setSector] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [registrationDate, setRegistrationDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddMSME({
      name,
      email,
      businessType,
      sector,
      address,
      contactNumber: parseInt(contactNumber, 11),
      logo: null, // Or provide a default logo URL if available
      registrationDate:
        registrationDate?.toISOString() ?? new Date().toISOString(),
    });
    onClose();
    // Reset form
    setName("");
    setEmail("");
    setBusinessType("");
    setSector("");
    setAddress("");
    setContactNumber("");
    setRegistrationDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New MSME</DialogTitle>
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
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              type="tel"
              value={contactNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d-]/g, "");
                setContactNumber(value.slice(0, 13));
              }}
              maxLength={13}
              pattern="[0-9-]{11,13}"
              required
            />
          </div>
          <div>
            <Label htmlFor="registrationDate">Registration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !registrationDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {registrationDate ? (
                    format(registrationDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={registrationDate}
                  onSelect={setRegistrationDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit">Add MSME</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

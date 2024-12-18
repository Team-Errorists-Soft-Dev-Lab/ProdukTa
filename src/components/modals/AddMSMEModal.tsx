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
import { useMSMEContext } from "@/contexts/MSMEContext";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";

interface AddMSMEModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMSMEModal({ isOpen, onClose }: AddMSMEModalProps) {
  const { sectors, handleAddMSME } = useMSMEContext();
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setDescription] = useState("");
  const [companyLogo, setLogo] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [provinceAddress, setProvinceAddress] = useState("");
  const [cityMunicipalityAddress, setCityMunicipalityAddress] = useState("");
  const [barangayAddress, setBarangayAddress] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");
  const [dtiNumber, setDTINumber] = useState("");
  const [sectorId, setSectorId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleAddMSME({
        companyName,
        companyDescription,
        companyLogo,
        contactPerson,
        contactNumber,
        email,
        provinceAddress,
        cityMunicipalityAddress,
        barangayAddress,
        yearEstablished: parseInt(yearEstablished),
        dti_number: parseInt(dtiNumber),
        sectorId: sectorId!,
      });

      onClose();
      // Reset form
      setCompanyName("");
      setDescription("");
      setLogo("");
      setContactPerson("");
      setContactNumber("");
      setEmail("");
      setProvinceAddress("");
      setCityMunicipalityAddress("");
      setBarangayAddress("");
      setYearEstablished("");
      setDTINumber("");
      setSectorId(null);
    } catch (error) {
      console.error("Error adding MSME:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New MSME</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-full">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              {/* Try to make the description text box bigger */}
              <div className="">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={companyDescription}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="logo">Logo</Label>
                <Input
                  id="logo"
                  value={companyLogo}
                  onChange={(e) => setLogo(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
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
            </div>
            <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg">
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
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  value={provinceAddress}
                  onChange={(e) => setProvinceAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City/Municipality</Label>
                <Input
                  id="city"
                  value={cityMunicipalityAddress}
                  onChange={(e) => setCityMunicipalityAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="barangay">Barangay</Label>
                <Input
                  id="barangay"
                  value={barangayAddress}
                  onChange={(e) => setBarangayAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year Established</Label>
                <Input
                  id="year"
                  type="number"
                  value={yearEstablished}
                  onChange={(e) => setYearEstablished(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dtiNumber">DTI Number</Label>
                <Input
                  id="dtiNumber"
                  type="number"
                  value={dtiNumber}
                  onChange={(e) => setDTINumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sector">Sector</Label>
                <Select
                  onValueChange={(value) => setSectorId(Number(value))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button type="submit">Add MSME</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

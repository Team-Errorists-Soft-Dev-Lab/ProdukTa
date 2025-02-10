"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { cn } from "@/lib/utils";
import { LocationSelect } from "@/components/forms/LocationSelect";
import { Map } from "@vis.gl/react-google-maps";

interface AddMSMEModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMSMEModal({ isOpen, onClose }: AddMSMEModalProps) {
  const { sectors, handleAddMSME } = useMSMEContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [provinceAddress, setProvinceAddress] = useState("");
  const [cityMunicipalityAddress, setCityMunicipalityAddress] = useState("");
  const [barangayAddress, setBarangayAddress] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");
  const [dtiNumber, setDTINumber] = useState("");
  const [sectorId, setSectorId] = useState<number | null>(null);

  // const [clickedPosition, setClickedPosition] = useState(null);
  // const [markerKey, setMarkerKey] = useState(0);
  // const [selectedPlace, setSelectedPlace] = useState(null);
  // const [address, setAddress] = useState(null);

  // Generate years for select (from 1900 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i,
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) newErrors.companyName = "Company name is required";
    if (!companyDescription.trim())
      newErrors.companyDescription = "Description is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!email.includes("@")) newErrors.email = "Invalid email format";
    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (contactNumber.length !== 10) {
      newErrors.contactNumber = "Contact number must be 10 digits after +63";
    }
    if (!contactPerson.trim())
      newErrors.contactPerson = "Contact person is required";
    if (!yearEstablished) newErrors.yearEstablished = "Year is required";
    if (!dtiNumber.trim()) newErrors.dtiNumber = "DTI number is required";
    if (!sectorId) newErrors.sectorId = "Sector is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!sectorId) return;

    setIsSubmitting(true);
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
        sectorId,
        createdAt: new Date(),
      });

      onClose();
      // Reset form
      setCompanyName("");
      setCompanyDescription("");
      setCompanyLogo("");
      setContactPerson("");
      setContactNumber("");
      setEmail("");
      setProvinceAddress("");
      setCityMunicipalityAddress("");
      setBarangayAddress("");
      setYearEstablished("");
      setDTINumber("");
      setSectorId(null);
      setErrors({});
    } catch (error) {
      console.error("Error adding MSME:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSectorChange = (value: string) => {
    setSectorId(Number(value));
  };

  const position = { lat: 10.7202, lng: 122.5621 };

  // const mapId = "mapbox/streets-v11";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-[90vw] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Add New MSME
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Fill in the MSME details below. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (errors.companyName) {
                      setErrors({ ...errors, companyName: "" });
                    }
                  }}
                  className={cn(
                    "mt-1.5",
                    errors.companyName &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                  placeholder="Enter company name"
                  disabled={isSubmitting}
                  required
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.companyName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="mt-1.5 min-h-[100px]"
                  placeholder="Describe the company's business and services"
                  required
                />
              </div>
              <div>
                <Label htmlFor="companyLogo">Company Logo URL</Label>
                <Input
                  id="companyLogo"
                  value={companyLogo}
                  onChange={(e) => setCompanyLogo(e.target.value)}
                  className="mt-1.5"
                  placeholder="Enter logo URL"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide a URL to the company logo image
                </p>
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="mt-1.5"
                  placeholder="Full name of contact person"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-sm text-gray-500">+63</span>
                  </div>
                  <Input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      // Remove leading zero if present
                      const normalizedValue = value.startsWith("0")
                        ? value.slice(1)
                        : value;
                      setContactNumber(normalizedValue.slice(0, 10)); // Limit to 10 digits after +63
                      if (errors.contactNumber) {
                        setErrors({ ...errors, contactNumber: "" });
                      }
                    }}
                    className={cn(
                      "pl-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                      errors.contactNumber &&
                        "border-red-500 focus-visible:ring-red-500",
                    )}
                    placeholder="917 123 4567"
                    required
                  />
                </div>
                {errors.contactNumber ? (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contactNumber}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    Format: +63 followed by 10 digits (e.g., +63 917 123 4567)
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                  placeholder="company@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="provinceAddress">Province</Label>
                <Input
                  id="provinceAddress"
                  value={provinceAddress}
                  onChange={(e) => setProvinceAddress(e.target.value)}
                  className="mt-1.5"
                  placeholder="Enter province"
                  required
                />
              </div>
              <LocationSelect
                value={cityMunicipalityAddress}
                onValueChange={setCityMunicipalityAddress}
                required
                disabled={isSubmitting}
              />
              <div>
                <Label htmlFor="barangayAddress">Barangay</Label>
                <Input
                  id="barangayAddress"
                  value={barangayAddress}
                  onChange={(e) => setBarangayAddress(e.target.value)}
                  className="mt-1.5"
                  placeholder="Enter barangay"
                  required
                />
              </div>
              <div>
                <Label htmlFor="yearEstablished">Year Established</Label>
                <Select
                  value={yearEstablished}
                  onValueChange={setYearEstablished}
                  required
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dtiNumber">DTI Number</Label>
                <Input
                  id="dtiNumber"
                  type="text"
                  inputMode="numeric"
                  value={dtiNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setDTINumber(value);
                  }}
                  className="mt-1.5 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Enter DTI registration number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sector">Sector</Label>
                <Select
                  onValueChange={handleSectorChange}
                  value={sectorId?.toString()}
                  required
                >
                  <SelectTrigger className="mt-1.5">
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
          <div className="mt-6 space-y-6">
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium">
                Pin Location <span className="text-red-500">*</span>
              </Label>

              <Map
                defaultCenter={position}
                defaultZoom={10}
                className="h-[450px]"
              ></Map>
              {/* <Map
                mapId={mapId}
                reuseMaps={true}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "1px solid black",
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
                defaultCenter={{
                  lat: 10.730833,
                  lng: 122.548056,
                }}
                defaultZoom={15}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                onClick={(event) => {
                  setClickedPosition(event.detail.latLng);
                  setMarkerKey((prevKey) => prevKey + 1);
                  setAddress(event.detail.latLng);
                }}
              >
                <CustomMapControl
                  controlPosition={ControlPosition.TOP_CENTER}
                  onPlaceSelect={setSelectedPlace}
                />
                <MapHandler place={selectedPlace} />
              </Map> */}
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="min-w-[120px] bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add MSME"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

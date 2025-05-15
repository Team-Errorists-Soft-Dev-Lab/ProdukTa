"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
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
import { Loader2, X } from "lucide-react";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { cn } from "@/lib/utils";
import { LocationSelect } from "@/components/forms/LocationSelect";
import { uploadImage } from "@/utils/supabase/storage";
import { toast } from "sonner";
import ImageCropModal from "@/components/modals/ImageCropModal";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import type { AddMSMEModalProps } from "@/types/MSME";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";

const libraries: ("places" | "maps")[] = ["places", "maps"];

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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [isLogoUploading, setIsLogoUploading] = useState(false);

  // Generate years for select (from 1900 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i,
  );

  // Replace selectedFiles and previewUrls with useSupabaseUpload
  const productImagesUpload = useSupabaseUpload({
    bucketName: "msme-images",
    path: "products",
    maxFileSize: 10 * 1000 * 1000, // 10MB
    maxFiles: 5,
    allowedMimeTypes: ["image/*"],
    upsert: true,
  });

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

  const handleLogoUpload = async (croppedFile: File) => {
    setIsLogoUploading(true);
    try {
      const fileName = `logo-${Date.now()}`;
      const url = await uploadImage(croppedFile, fileName);
      setCompanyLogo(url);
      setLogoUrl(url);
      setLogoFile(croppedFile);
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setIsLogoUploading(false);
    }
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !sectorId || latitude === null || longitude === null)
      return;

    setIsSubmitting(true);
    try {
      // Upload logo if selected
      let logoUrl = companyLogo;
      if (logoFile) {
        const fileName = `logo-${Date.now()}`;
        logoUrl = await uploadImage(logoFile, fileName);
      }

      // Get the uploaded product image URLs
      const imageUrls = productImagesUpload.successes.map((fileName) => {
        // Ensure the URL is properly formatted
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (fileName.includes("storage/v1/object/public")) {
          return fileName;
        }
        return `${supabaseUrl}/storage/v1/object/public/msme-images/products/${fileName}`;
      });

      await handleAddMSME({
        companyName,
        companyDescription,
        companyLogo: logoUrl,
        productGallery: imageUrls,
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
        majorProductLines: [],
        longitude,
        latitude,
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
      setLogoFile(null);
      setLatitude(null);
      setLongitude(null);
    } catch (error) {
      console.error("Error adding MSME:", error);
      toast.error("Failed to add MSME");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSectorChange = (value: string) => {
    setSectorId(Number(value));
  };

  const defaultMapCenter = useMemo(
    () => ({
      // Default latitude and longitude for Iloilo City, Philippines
      lat: 10.7202,
      lng: 122.5621,
    }),
    [],
  );

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarker(newMarker);
      setLatitude(newMarker.lat);
      setLongitude(newMarker.lng);
    }
  };

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
                <Label htmlFor="companyLogo">Company Logo</Label>
                <div className="mt-1.5 flex flex-col gap-4">
                  {logoUrl && (
                    <div className="relative inline-block">
                      <Image
                        src={logoUrl}
                        alt="Company logo"
                        className="h-16 w-16 rounded-md object-cover"
                        width={64}
                        height={64}
                      />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (logoUrl) {
                        setCompanyLogo("");
                        setLogoUrl("");
                        setLogoFile(null);
                        setIsCropModalOpen(true);
                      } else {
                        setIsCropModalOpen(true);
                      }
                    }}
                    disabled={isLogoUploading}
                  >
                    {isLogoUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : logoUrl ? (
                      "Change Logo"
                    ) : (
                      "Upload Logo"
                    )}
                  </Button>
                </div>
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
              <div className="space-y-2">
                <Label>Product Images</Label>
                <Dropzone {...productImagesUpload}>
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
                <p className="text-sm text-muted-foreground">
                  Upload up to 5 images of your products (max 10MB each)
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-6">
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium">
                Pin Location <span className="text-red-500">*</span>
              </Label>

              {!isLoaded ? (
                <div>Loading...</div>
              ) : (
                <div className="container mx-auto p-4">
                  <GoogleMap
                    mapContainerStyle={{
                      width: "100%",
                      height: "400px",
                    }}
                    center={defaultMapCenter}
                    zoom={12}
                    onClick={handleMapClick}
                  >
                    {marker && <Marker position={marker} />}
                  </GoogleMap>
                </div>
              )}
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

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onCropComplete={handleLogoUpload}
        // aspect={1} // Square aspect ratio
      />
    </Dialog>
  );
}

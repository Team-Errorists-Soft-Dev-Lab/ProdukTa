"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import {
  Loader2,
  X,
  UploadCloud,
  Building,
  Info,
  User,
  Phone,
  Mail,
  Calendar,
  Tag,
  Facebook,
  Instagram as InstagramIcon,
  ArrowLeft,
} from "lucide-react";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { cn } from "@/lib/utils";
import { LocationSelect } from "@/components/forms/LocationSelect";
import { uploadImage } from "@/utils/supabase/storage";
import { toast } from "sonner";
import ImageCropModal from "@/components/modals/ImageCropModal";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";

// Define the libraries for Google Maps API
const libraries: ("places" | "maps")[] = ["places", "maps"];

interface DuplicateCheckResponse {
  isDuplicateCompanyName: boolean;
}

export default function AddMSMEPage({
  params,
}: {
  params: { sectorName: string };
}) {
  const router = useRouter();
  const { sectors, handleAddMSME } = useMSMEContext();
  const { sectorName } = params;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    const matchingSector = sectors.find(
      (sector) =>
        sector.name.toLowerCase().replace(/\s+/g, "") ===
        sectorName.toLowerCase(),
    );

    if (matchingSector) {
      setSectorId(matchingSector.id);
    }
  }, [sectors, sectorName]);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState(""); // URL of the uploaded logo
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [provinceAddress, setProvinceAddress] = useState("");
  const [cityMunicipalityAddress, setCityMunicipalityAddress] = useState("");
  const [barangayAddress, setBarangayAddress] = useState("");
  const [yearEstablished, setYearEstablished] = useState<string>("");
  const [sectorId, setSectorId] = useState<number | null>(null);
  const [majorProductLines, setMajorProductLines] = useState<string[]>([]);
  const [facebookPage, setFacebookPage] = useState("");
  const [instagramPage, setInstagramPage] = useState("");

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(""); // Preview URL for logo before/during crop

  // Product gallery upload state (using useSupabaseUpload hook)
  const productImagesUpload = useSupabaseUpload({
    bucketName: "msme-images", // Make sure this matches your Supabase bucket
    // path: `product-gallery/${companyName.replace(/\s+/g, '-').toLowerCase() || 'unknown-msme'}`, // Dynamic path
    path: "./",
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    upsert: true,
    generateFileName: (file, index) => {
      const extension = file.name.split(".").pop();
      return `product-${companyName.replace(/\s+/g, "-")}-${Date.now()}-${index}.${extension}`;
    },
  });

  // Map state
  const [latitude, setLatitude] = useState<number | null>(10.7202); // Default to Iloilo City approx.
  const [longitude, setLongitude] = useState<number | null>(122.5621);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [mapZoom, setMapZoom] = useState(10);
  const [isLogoUploading, setIsLogoUploading] = useState(false);

  // Google Maps Places Autocomplete
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(
    null,
  );

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Generate years for select
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () =>
      Array.from({ length: currentYear - 1899 }, (_, i) =>
        (currentYear - i).toString(),
      ),
    [currentYear],
  );

  const resetForm = () => {
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
    setSectorId(null);
    setMajorProductLines([]);
    setFacebookPage("");
    setInstagramPage("");
    setLogoFile(null);
    setLogoUrl("");
    setLatitude(10.7202);
    setLongitude(122.5621);
    setMarker(null);
    setMapZoom(10);
    setErrors({});
  };

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
    if (!sectorId) newErrors.sectorId = "Sector is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkDuplicates = async () => {
    try {
      const response = await fetch("/api/msme/check-duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: companyName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check for duplicates");
      }

      const data = (await response.json()) as DuplicateCheckResponse;
      const newErrors: Record<string, string> = { ...errors };

      if (data.isDuplicateCompanyName) {
        newErrors.companyName = "This company name already exists";
        toast.error("A company with this name already exists");
      }

      setErrors(newErrors);
      return !data.isDuplicateCompanyName;
    } catch (error) {
      console.error("Error checking duplicates:", error);
      toast.error("Failed to check for duplicates");
      return false;
    }
  };

  // const fileInputRef = React.useRef<HTMLInputElement>(null);

  // const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files?.[0]) {
  //     const file = e.target.files[0];
  //     setLogoFile(file);
  //     setLogoUrl(URL.createObjectURL(file)); // For preview in crop modal
  //     setIsCropModalOpen(true);
  //     e.target.value = ""; // Reset file input
  //   }
  // };

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

  const handleRemoveLogo = async () => {
    if (companyLogo) {
      try {
        // Optional: Delete from Supabase storage
        // const path = companyLogo.substring(companyLogo.indexOf('/logos/') + 1);
        // await deleteImage(path, "msme-images");
      } catch (error) {
        console.warn("Could not delete old logo from storage:", error);
      }
    }
    setCompanyLogo("");
    setLogoUrl("");
    setLogoFile(null);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setLatitude(lat);
      setLongitude(lng);
      setMarker({ lat, lng });
      setErrors((prev) => ({ ...prev, location: "" })); // Clear location error
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    // Check for duplicates before proceeding
    const isDuplicatesFree = await checkDuplicates();
    if (!isDuplicatesFree) {
      return;
    }

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
        return `${supabaseUrl}/storage/v1/object/public/msme-images/${fileName}`;
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
        sectorId: sectorId!,
        createdAt: new Date(),
        majorProductLines: majorProductLines,
        facebookPage: facebookPage,
        instagramPage: instagramPage,
        longitude: longitude === null ? 0 : longitude,
        latitude: latitude === null ? 0 : latitude,
      });

      toast.success("MSME added successfully!");
      resetForm();
      router.push(`/admin/msme/${sectorName}`);
    } catch (error) {
      console.error("Error adding MSME:", error);
      toast.error("Failed to add MSME");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (marker) {
      setLatitude(marker.lat);
      setLongitude(marker.lng);
    }
  }, [marker]);

  // Google Maps Places Autocomplete setup
  useEffect(() => {
    if (
      isLoaded &&
      searchInputRef.current &&
      !autocompleteRef.current &&
      window.google
    ) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          fields: ["geometry", "formatted_address"],
          types: ["geocode", "establishment"],
        },
      );
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current!.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setLatitude(lat);
          setLongitude(lng);
          setMarker({ lat, lng });
          setMapZoom(15);
        }
      });
    }
  }, [isLoaded]);

  // Google Maps Places Autocomplete logic
  useEffect(() => {
    if (!isLoaded) return;
    const input = document.getElementById(
      "places-autocomplete",
    ) as HTMLInputElement | null;
    if (!input || !window.google) return;
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      fields: ["geometry", "name", "formatted_address"],
      componentRestrictions: { country: "ph" },
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLatitude(lat);
        setLongitude(lng);
        setMarker({ lat, lng });
        setMapZoom(15);
      }
    });
    // Clean up
    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded]);

  return (
    <div className="container mx-auto max-w-4xl p-4 py-6 md:py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Add New MSME
          </h1>
          <p className="mt-1 text-muted-foreground">
            Complete the form below to register a new Micro, Small, or Medium
            Enterprise.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/msme/${sectorName}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to MSMEs
        </Button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Basic Info & Contact (2 columns) */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">
            Company & Contact Information
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="companyName" className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1.5"
                  placeholder="e.g., Juan's Bakeshop"
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.companyName}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="companyDescription"
                  className="flex items-center"
                >
                  <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                  Company Description
                </Label>
                <Textarea
                  id="companyDescription"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="mt-1.5"
                  placeholder="Briefly describe the company and its products/services"
                  rows={3}
                />
                {errors.companyDescription && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.companyDescription}
                  </p>
                )}
              </div>
              <div>
                <Label className="flex items-center">
                  <UploadCloud className="mr-2 h-4 w-4 text-muted-foreground" />
                  Company Logo
                </Label>
                <div className="mt-1.5 flex flex-col items-start gap-3">
                  {logoUrl && (
                    <div className="relative">
                      <Image
                        src={logoUrl}
                        alt="Company Logo Preview"
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-md border object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                        onClick={handleRemoveLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="default"
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
                {errors.companyLogo && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.companyLogo}
                  </p>
                )}
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="contactPerson" className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  Contact Person
                </Label>
                <Input
                  id="contactPerson"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="mt-1.5"
                  placeholder="Full Name"
                />
                {errors.contactPerson && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.contactPerson}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="contactNumber" className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  Contact Number
                </Label>
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
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                  placeholder="e.g., contact@juansbakeshop.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Operational Details (2 columns) */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">
            Operational & Business Details
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
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
                <Label htmlFor="yearEstablished" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  Year Established
                </Label>
                <Select
                  value={yearEstablished}
                  onValueChange={setYearEstablished}
                >
                  <SelectTrigger id="yearEstablished" className="mt-1.5">
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
                {errors.yearEstablished && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.yearEstablished}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="sectorId" className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                  Sector
                </Label>
                <Select
                  value={sectorId?.toString()}
                  disabled={true} // Make it read-only
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sector is pre-selected based on your navigation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Products & Online Presence (2 columns) */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">
            Products & Online Presence
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="majorProductLines"
                  className="flex items-center"
                >
                  <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                  Major Product Lines
                </Label>
                <Textarea
                  id="majorProductLines"
                  value={majorProductLines.join("\n")}
                  onChange={(e) =>
                    setMajorProductLines(e.target.value.split("\n"))
                  }
                  className="mt-1.5"
                  placeholder="List major products, one per line (e.g., Cakes, Pastries, Breads)"
                  rows={3}
                />
                {errors.majorProductLines && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.majorProductLines}
                  </p>
                )}
              </div>
              <div>
                <Label className="flex items-center">
                  <UploadCloud className="mr-2 h-4 w-4 text-muted-foreground" />
                  Product Images (up to 5 images, max 10MB each)
                </Label>
                <Dropzone className="mt-2" {...productImagesUpload}>
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="facebookPage" className="flex items-center">
                  <Facebook className="mr-2 h-4 w-4 text-muted-foreground" />
                  Facebook Page (Optional)
                </Label>
                <Input
                  id="facebookPage"
                  value={facebookPage}
                  onChange={(e) => setFacebookPage(e.target.value)}
                  className="mt-1.5"
                  placeholder="e.g., https://facebook.com/juansbakeshop"
                />
              </div>
              <div>
                <Label htmlFor="instagramPage" className="flex items-center">
                  <InstagramIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  Instagram Profile (Optional)
                </Label>
                <Input
                  id="instagramPage"
                  value={instagramPage}
                  onChange={(e) => setInstagramPage(e.target.value)}
                  className="mt-1.5"
                  placeholder="e.g., https://instagram.com/juansbakeshop"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Location on Map */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold text-card-foreground">
            Location on Map
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Click on the map to set the exact location of the MSME.
          </p>

          {/* Google Maps Places Autocomplete Search */}
          <div className="mb-4">
            <Input
              id="places-autocomplete"
              type="text"
              placeholder="Search for a location..."
              className="w-full"
              autoComplete="off"
            />
          </div>

          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              Or enter the coordinates of the MSME location manually:
            </p>
          </div>

          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude ?? ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    setLatitude(val);
                  } else {
                    setLatitude(null);
                  }
                }}
                placeholder="e.g. 10.7202"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude ?? ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    setLongitude(val);
                  } else {
                    setLongitude(null);
                  }
                }}
                placeholder="e.g. 122.5621"
              />
            </div>
            <div className="flex items-end pt-5">
              <Button
                onClick={() => {
                  setMarker({
                    lat: latitude ?? 10.7202,
                    lng: longitude ?? 122.5621,
                  });
                }}
                disabled={!latitude || !longitude}
                className="h-10 rounded-md bg-blue-600 px-4 font-semibold text-white shadow transition-colors duration-150 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
                type="button"
              >
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6l4 2"
                    />
                  </svg>
                  Set Values
                </span>
              </Button>
            </div>
          </div>

          {isLoaded ? (
            <div className="h-[400px] w-full overflow-hidden rounded-md">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={
                  marker || {
                    lat: latitude || 10.7202,
                    lng: longitude || 122.5621,
                  }
                }
                zoom={marker ? 15 : mapZoom}
                onClick={handleMapClick}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                {marker && <Marker position={marker} />}
              </GoogleMap>
            </div>
          ) : loadError ? (
            <p>Error loading map.</p>
          ) : (
            <div className="flex h-[400px] w-full items-center justify-center rounded-md border bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-2">Loading map...</p>
            </div>
          )}
          {errors.location && (
            <p className="mt-2 text-xs text-destructive">{errors.location}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/msme/${sectorName}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add MSME
          </Button>
        </div>
      </form>

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => {
          setIsCropModalOpen(false);
          // If user closes without cropping, clear the selection
          if (!companyLogo) {
            setLogoFile(null);
            setLogoUrl("");
          }
        }}
        onCropComplete={handleLogoUpload}
      />
    </div>
  );
}

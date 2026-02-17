"use client";

import React, { useMemo, useState, useEffect, use } from "react";
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
  UploadCloud,
  Building,
  Info,
  User,
  Phone,
  Mail,
  Tag,
  Facebook,
  Instagram as InstagramIcon,
  ArrowLeft,
  X,
} from "lucide-react";
import { useMSMEContext } from "@/contexts/MSMEContext";
import { cn } from "@/lib/utils";
import { LocationSelect } from "@/components/forms/LocationSelect";
import { uploadImage, deleteImage } from "@/utils/supabase/storage";
import { toast } from "sonner";
import ImageCropModal from "@/components/modals/ImageCropModal";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapComponent } from "@/components/map/MapComponent";
// import type { MSME } from "@/types/MSME";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";
import { fetchMsmeInitialData } from "@/lib/msmeYearCity";

const libraries: ("places" | "maps")[] = ["places", "maps"];

export default function EditMSMEPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { sectors, singleMSME, handleUpdateMSME, fetchSingleMSME } =
    useMSMEContext();

  const [isLoadingMSME, setIsLoadingMSME] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [currentCompanyLogo, setCurrentCompanyLogo] = useState(""); // Stores the existing or newly uploaded logo URL for submission
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
  const [isLoadingInitialFields, setIsLoadingInitialFields] = useState(true);
  // Logo upload state
  // const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(""); // For preview in crop modal and display
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isAddingImages, setIsAddingImages] = useState(false);

  // Product gallery state
  const [currentProductGallery, setCurrentProductGallery] = useState<string[]>(
    [],
  );
  const [isReplacingImages, setIsReplacingImages] = useState(false);
  const productImagesUpload = useSupabaseUpload({
    bucketName: "msme-images",
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
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [mapZoom, setMapZoom] = useState(10);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () =>
      Array.from({ length: currentYear - 1899 }, (_, i) =>
        (currentYear - i).toString(),
      ),
    [currentYear],
  );

  useEffect(() => {
    async function loadInitialFields() {
      if (id) {
        try {
          const initialData = await fetchMsmeInitialData(id);
          if (initialData) {
            if (initialData.cityMunicipalityAddress) {
              setCityMunicipalityAddress(initialData.cityMunicipalityAddress);
            }
            if (initialData.yearEstablished) {
              setYearEstablished(initialData.yearEstablished.toString());
            }
          }
        } catch (error) {
          console.error("Failed to load initial MSME data:", error);
        } finally {
          setIsLoadingInitialFields(false);
        }
      }
    }

    void loadInitialFields();
  }, [id]);
  useEffect(() => {
    if (id) {
      setIsLoadingMSME(true);
      const fetchData = async () => {
        try {
          await fetchSingleMSME(parseInt(id));
        } catch (err) {
          console.error("Failed to fetch MSME", err);
        } finally {
          setIsLoadingMSME(false);
        }
      };
      void fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (singleMSME) {
      try {
        setCompanyName(singleMSME.companyName);
        setCompanyDescription(singleMSME.companyDescription);
        setCurrentCompanyLogo(singleMSME.companyLogo || "");
        setLogoPreviewUrl(singleMSME.companyLogo || "");
        setContactPerson(singleMSME.contactPerson);
        setContactNumber(singleMSME.contactNumber);
        setEmail(singleMSME.email);
        setProvinceAddress(singleMSME.provinceAddress);
        setCityMunicipalityAddress(singleMSME.cityMunicipalityAddress);
        setBarangayAddress(singleMSME.barangayAddress);
        setYearEstablished(singleMSME.yearEstablished?.toString() || "");
        setSectorId(singleMSME.sectorId);
        setMajorProductLines(singleMSME.majorProductLines || []);
        setFacebookPage(singleMSME.facebookPage || "");
        setInstagramPage(singleMSME.instagramPage || "");

        setCurrentProductGallery(singleMSME.productGallery || []);
        setIsReplacingImages(
          !(singleMSME.productGallery && singleMSME.productGallery.length > 0),
        );

        setLatitude(singleMSME.latitude || null);
        setLongitude(singleMSME.longitude || null);
        if (singleMSME.latitude && singleMSME.longitude) {
          setMarker({ lat: singleMSME.latitude, lng: singleMSME.longitude });
          setMapZoom(15);
        } else {
          setMapZoom(10); // Default zoom if no location
        }
      } catch (error) {
        console.error("Error setting MSME data:", error);
        toast.error("Failed to load MSME data");
      }
    }
  }, [singleMSME]);

  const input = document.getElementById(
    "places-autocomplete",
  ) as HTMLInputElement;

  useEffect(() => {
    if (!isLoaded || !window.google) {
      return;
    }

    if (!input) {
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      fields: ["geometry", "name", "formatted_address"],
      componentRestrictions: { country: "ph" },
    });

    autocomplete.addListener("place_changed", () => {
      try {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }
        if (place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setLatitude(lat);
          setLongitude(lng);
          setMarker({ lat, lng });
          setMapZoom(15);
        }
      } catch (error) {
        console.error("Error getting place details:", error);
        toast.error("Failed to get place details. Please try again.");
      }
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded, input]);

  const defaultMapCenter = useMemo(
    () => ({
      lat: latitude ?? 10.7202, // Default if latitude is null
      lng: longitude ?? 122.5621, // Default if longitude is null
    }),
    [latitude, longitude],
  );

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setLatitude(lat);
      setLongitude(lng);
      setMarker({ lat, lng });
      setErrors((prev) => ({ ...prev, location: "" }));
    }
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
    if (!latitude || !longitude)
      newErrors.location = "Location on map is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogoUploadAfterCrop = async (croppedFile: File) => {
    setIsLogoUploading(true);
    try {
      if (
        singleMSME?.companyLogo &&
        currentCompanyLogo === singleMSME.companyLogo
      ) {
        // only delete if it's the original logo
        await deleteImage(singleMSME.companyLogo);
      }
      const fileName = `logo-${Date.now()}`;
      const url = await uploadImage(croppedFile, fileName);
      setCurrentCompanyLogo(url); // This will be used for submission
      setLogoPreviewUrl(url); // This is for display
      // setLogoFile(croppedFile);  // Store the file reference
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setIsLogoUploading(false);
    }
  };

  const handleDeleteExistingImage = async (imageUrl: string, index: number) => {
    if (!singleMSME) return;
    try {
      await deleteImage(imageUrl); // From Supabase storage
      const updatedGallery = currentProductGallery.filter(
        (_, i) => i !== index,
      );
      setCurrentProductGallery(updatedGallery); // Update local state for UI

      // The actual backend update will happen on form submit.
      // If you want immediate backend update, you'd call handleUpdateMSME here.
      // For now, we update local state and submit all at once.

      if (updatedGallery.length === 0) {
        setIsReplacingImages(true);
      }
      toast.success("Image marked for deletion. Save changes to confirm.");
    } catch {
      toast.error("Failed to delete image from storage.");
    }
  };

  const handleReplaceAllImages = () => {
    setIsReplacingImages(true);
    setIsAddingImages(false);
    // Optionally clear existing displayed images if desired, or let Dropzone handle it
  };

  const handleAddImages = () => {
    setIsReplacingImages(true); // We still use the dropzone UI
    setIsAddingImages(true); // But we mark that we're in "add" mode
    // No need to clear existing files since we want to keep them
  };

  const handleCancelReplacement = () => {
    setIsReplacingImages(false);
    setIsAddingImages(false);
    productImagesUpload.setFiles([]); // Clear any newly staged files
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !validateForm() ||
      !singleMSME ||
      !sectorId ||
      latitude === null ||
      longitude === null
    ) {
      toast.error(
        "Please fill in all required fields correctly and set a location.",
      );
      return;
    }
    setIsSubmitting(true);

    try {
      const finalLogoUrl = currentCompanyLogo;
      // If a new logoFile is present (meaning a new logo was selected and cropped),
      // currentCompanyLogo should already be updated by handleLogoUploadAfterCrop.
      // No need to re-upload here if handleLogoUploadAfterCrop did its job.

      const uploadedImageUrls = productImagesUpload.successes.map(
        (fileName) => {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

          // If it's already a full URL, just return it
          if (fileName.includes("storage/v1/object/public")) {
            return fileName;
          }

          // Otherwise, construct the URL properly
          return `${supabaseUrl}/storage/v1/object/public/msme-images/${fileName}`;
        },
      );

      let finalProductGallery: string[];
      if (isReplacingImages) {
        if (isAddingImages) {
          // If adding images, combine existing and new uploads
          finalProductGallery = [
            ...currentProductGallery,
            ...uploadedImageUrls,
          ];
        } else {
          // If replacing images, only use the new uploads
          finalProductGallery = uploadedImageUrls;
        }
        // Remove duplicates
        finalProductGallery = Array.from(new Set(finalProductGallery));
      } else {
        // Not replacing - use current gallery (which may have been modified by deletions)
        finalProductGallery = currentProductGallery;
      }

      await handleUpdateMSME({
        ...singleMSME, // Spread existing data to preserve other fields
        id: Number(id),
        companyName,
        companyDescription,
        companyLogo: finalLogoUrl,
        contactPerson,
        contactNumber,
        email,
        provinceAddress,
        cityMunicipalityAddress,
        barangayAddress,
        yearEstablished: parseInt(yearEstablished),
        sectorId,
        majorProductLines,
        facebookPage,
        instagramPage,
        productGallery: finalProductGallery,
        latitude,
        longitude,
      });
      router.push(
        `/admin/msme/${sectors
          .find((s) => s.id === sectorId)
          ?.name.toLocaleLowerCase()
          .replace(/\s+/g, "")}`,
      );
    } catch (error) {
      console.error("Error updating MSME:", error);
      toast.error(
        "Failed to update MSME. " +
          (error instanceof Error ? error.message : ""),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingMSME) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4">Loading MSME data...</p>
      </div>
    );
  }

  if (!singleMSME) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <h2 className="mb-2 text-xl font-bold">MSME Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          The MSME you are trying to edit could not be found.
        </p>
        <Button
          onClick={() => {
            const sector = sectors.find((s) => s.id === sectorId);
            const sectorName = sector
              ? sector.name.toLowerCase().replace(/\s+/g, "")
              : "";
            router.push(`/admin/msme/${sectorName}`);
          }}
        >
          Go Back to MSME List
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 py-6 md:py-10">
      <header className="mb-6 flex items-center">
        <Button
          variant="secondary"
          onClick={() => {
            const sector = sectors.find((s) => s.id === sectorId);
            const sectorName = sector
              ? sector.name.toLowerCase().replace(/\s+/g, "")
              : "";
            router.push(`/admin/msme/${sectorName}`);
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex-grow text-center">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Edit MSME
          </h1>
          <p className="mt-1 text-muted-foreground">
            Update details for {singleMSME.companyName}.
          </p>
        </div>
        <div className="w-[calc(2rem+theme(spacing.2)+theme(spacing.4))]">
          {" "}
          {/* Spacer to balance back button */}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Company & Contact Information */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">
            Company & Contact Information
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="companyName" className="flex items-center">
                  <Building className="mr-2 h-6 w-4 text-muted-foreground" />
                  Company Name <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={cn(
                    "mt-1.5",
                    errors.companyName && "border-destructive",
                  )}
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
                  <Info className="mr-2 h-6 w-4 text-muted-foreground" />
                  Company Description{" "}
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Textarea
                  id="companyDescription"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className={cn(
                    "mt-1.5",
                    errors.companyDescription && "border-destructive",
                  )}
                  placeholder="Briefly describe the company..."
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
                  <UploadCloud className="mr-2 h-6 w-4 text-muted-foreground" />
                  Company Logo
                </Label>
                <div className="mt-1.5 flex flex-col items-start gap-3">
                  {logoPreviewUrl && (
                    <Image
                      src={logoPreviewUrl}
                      alt="Logo Preview"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-md border object-cover"
                    />
                  )}
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => setIsCropModalOpen(true)}
                    disabled={isLogoUploading}
                  >
                    {isLogoUploading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {logoPreviewUrl ? "Change Logo" : "Upload Logo"}
                  </Button>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="contactPerson" className="flex items-center">
                  <User className="mr-2 h-6 w-4 text-muted-foreground" />
                  Contact Person <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="contactPerson"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className={cn(
                    "mt-1.5",
                    errors.contactPerson && "border-destructive",
                  )}
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
                  <Phone className="mr-2 h-6 w-4 text-muted-foreground" />
                  Contact Number <span className="ml-1 text-red-500">*</span>
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
                      setContactNumber(
                        value.startsWith("0")
                          ? value.slice(1, 11)
                          : value.slice(0, 10),
                      );
                    }}
                    className={cn(
                      "pl-12",
                      errors.contactNumber && "border-destructive",
                    )}
                    placeholder="917 123 4567"
                  />
                </div>
                {errors.contactNumber && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.contactNumber}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="mr-2 h-6 w-4 text-muted-foreground" />
                  Email Address <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn("mt-1.5", errors.email && "border-destructive")}
                  placeholder="e.g., contact@jbs.com"
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

        {/* Section 2: Operational & Business Details */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">
            Operational & Business Details
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Label htmlFor="provinceAddress">
                  Province <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="provinceAddress"
                  value={provinceAddress}
                  onChange={(e) => setProvinceAddress(e.target.value)}
                  className="mt-1.5"
                  placeholder="Enter province"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                {isLoadingInitialFields ? (
                  <div className="flex h-10 items-center rounded-md border px-3 py-2">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    <span className="text-sm text-muted-foreground">
                      Loading...
                    </span>
                  </div>
                ) : (
                  <LocationSelect
                    value={cityMunicipalityAddress}
                    onValueChange={setCityMunicipalityAddress}
                    disabled={isSubmitting}
                  />
                )}
                {errors.cityMunicipalityAddress && (
                  <p className="text-sm text-destructive">
                    {errors.cityMunicipalityAddress}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="barangayAddress">
                  Barangay <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="barangayAddress"
                  value={barangayAddress}
                  onChange={(e) => setBarangayAddress(e.target.value)}
                  className="mt-1.5"
                  placeholder="Enter barangay"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="yearEstablished">
                  Year Established <span className="ml-1 text-red-500">*</span>
                </Label>
                {isLoadingInitialFields ? (
                  <div className="flex h-10 items-center rounded-md border px-3 py-2">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    <span className="text-sm text-muted-foreground">
                      Loading...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={yearEstablished}
                    onValueChange={setYearEstablished}
                  >
                    <SelectTrigger
                      id="yearEstablished"
                      className={cn(
                        errors.yearEstablished && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.yearEstablished && (
                  <p className="text-sm text-destructive">
                    {errors.yearEstablished}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="sectorId" className="flex items-center">
                  <Tag className="mr-2 h-6 w-4 text-muted-foreground" /> Sector{" "}
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <div className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                  {sectors.find((s) => s.id === sectorId)?.name ||
                    "No sector selected"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Products & Online Presence */}
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
                  <Info className="mr-2 h-6 w-4 text-muted-foreground" />
                  Major Product Lines
                </Label>
                <Textarea
                  id="majorProductLines"
                  value={majorProductLines.join("\n")}
                  onChange={(e) =>
                    setMajorProductLines(e.target.value.split("\n"))
                  }
                  className="mt-1.5"
                  placeholder="List products, one per line"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="facebookPage" className="flex items-center">
                  <Facebook className="mr-2 h-6 w-4 text-muted-foreground" />
                  Facebook Page (Optional)
                </Label>
                <Input
                  id="facebookPage"
                  value={facebookPage}
                  onChange={(e) => setFacebookPage(e.target.value)}
                  className="mt-1.5"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="instagramPage" className="flex items-center">
                  <InstagramIcon className="mr-2 h-6 w-4 text-muted-foreground" />
                  Instagram Profile (Optional)
                </Label>
                <Input
                  id="instagramPage"
                  value={instagramPage}
                  onChange={(e) => setInstagramPage(e.target.value)}
                  className="mt-1.5"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Label className="flex items-center">
                  <UploadCloud className="mr-2 h-6 w-4 text-muted-foreground" />
                  Product Images
                </Label>
                {!isReplacingImages && currentProductGallery.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {currentProductGallery.map((url, index) => (
                        <div
                          key={`existing-${index}-${url}`}
                          className="group relative"
                        >
                          <Image
                            src={url}
                            alt={`Product image ${index + 1}`}
                            width={200}
                            height={96}
                            className="h-24 w-full rounded-md object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-1 top-1 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() =>
                              handleDeleteExistingImage(url, index)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          handleAddImages();
                        }}
                        className="text-sm"
                      >
                        Add Images
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReplaceAllImages}
                        className="text-sm"
                      >
                        Replace All Images
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Show existing images when adding new ones */}
                    {isAddingImages && currentProductGallery.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-sm font-medium">Current Images:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {currentProductGallery.map((url, index) => (
                            <div
                              key={`existing-add-${index}-${url}`}
                              className="group relative"
                            >
                              <Image
                                src={url}
                                alt={`Product image ${index + 1}`}
                                width={200}
                                height={96}
                                className="h-24 w-full rounded-md object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() =>
                                  handleDeleteExistingImage(url, index)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="my-3 border-b"></div>
                        <p className="text-sm font-medium">Add New Images:</p>
                      </div>
                    )}

                    <Dropzone className="mt-2" {...productImagesUpload}>
                      <DropzoneEmptyState />
                      <DropzoneContent />
                    </Dropzone>

                    <p className="text-sm text-muted-foreground">
                      Upload up to 5 new images (max 10MB each).
                    </p>

                    {isReplacingImages &&
                      singleMSME?.productGallery &&
                      singleMSME.productGallery.length > 0 && (
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelReplacement}
                            className="text-sm"
                          >
                            {isAddingImages
                              ? "Cancel Add Images"
                              : "Cancel Replacement"}
                          </Button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Location on Map */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold text-card-foreground">
            Location on Map <span className="ml-1 text-red-500">*</span>
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Click on the map to set/update the MSME&apos;s location.
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

          {latitude && longitude ? (
            <div className="h-[400px] w-full overflow-hidden rounded-md">
              <MapComponent
                latitude={latitude}
                longitude={longitude}
                label={companyName}
              />
            </div>
          ) : (
            <div className="flex h-[400px] w-full items-center justify-center rounded-md border bg-muted">
              <p className="text-muted-foreground">
                No location set. Search for an address above.
              </p>
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
            onClick={() => {
              const sector = sectors.find((s) => s.id === sectorId);
              const sectorName = sector
                ? sector.name.toLowerCase().replace(/\s+/g, "")
                : "";
              router.push(`/admin/msme/${sectorName}`);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoadingMSME}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
            Update MSME
          </Button>
        </div>
      </form>

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onCropComplete={handleLogoUploadAfterCrop}
      />
    </div>
  );
}

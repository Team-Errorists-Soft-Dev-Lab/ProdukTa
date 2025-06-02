"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Mail,
  User,
  ExternalLink,
  ArrowRight,
  Calendar,
} from "lucide-react";

import type { CarouselApi } from "@/components/ui/carousel";
import type { MSMEWithSectorName } from "@/types/MSME";
import { SECTOR_COLORS, type SectorColorKey } from "@/lib/sector-colors";

export default function MSMEPage({ params }: { params: { id: string } }) {
  const [MSME, setMSME] = useState<MSMEWithSectorName>();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    if (MSME?.latitude && MSME?.longitude) {
      setMapCenter({
        lat: MSME.latitude,
        lng: MSME.longitude,
      });
    }
  }, [MSME]);

  useEffect(() => {
    const addVisitorCount = async () => {
      const msmeId = MSME?.id;
      if (!msmeId) return;
      await fetch("/api/admin/visitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ msmeId }),
      });
    };

    if (MSME?.id) {
      addVisitorCount().catch((error) =>
        console.error("Error adding visitor count:", error),
      );
    }
  }, [MSME]);

  useEffect(() => {
    const fetchMSME = async () => {
      setIsLoading(true);
      try {
        const msmeResponse = await fetch(`/api/msme/${params.id}`);
        if (!msmeResponse.ok) {
          throw new Error("Failed to fetch MSME");
        }
        const msmeData = (await msmeResponse.json()) as MSMEWithSectorName;
        setMSME(msmeData);
      } catch {
        console.error("Failed to fetch MSME");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMSME().catch((error) => {
      console.error("Error fetching MSME:", error);
    });
  }, [params.id]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const getSectorBadgeStyle = (sectorName: string) => {
    const sectorColor = SECTOR_COLORS[sectorName as SectorColorKey];
    if (!sectorColor) {
      // Default style for uncategorized or unknown sectors
      return {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "white",
        borderColor: "rgba(255, 255, 255, 0.3)",
      };
    }

    // Determine if we need light or dark text based on color brightness
    const isDarkColor = [
      "#000000",
      "#8B4513",
      "#6B8E23",
      "#0077BE",
      "#8A2BE2",
    ].includes(sectorColor);

    return {
      backgroundColor: sectorColor,
      color: isDarkColor ? "white" : "black",
      borderColor: sectorColor,
    };
  };

  const fullAddress = MSME
    ? `${MSME.barangayAddress || ""}, ${MSME.cityMunicipalityAddress || ""}, ${MSME.provinceAddress || ""}`
        .replace(/^,\s*/, "")
        .replace(/,\s*,/g, ",")
    : "";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm">
          <Spinner className="h-12 w-12 text-amber-600" />
          <p className="mt-4 text-center font-medium text-amber-800">
            Loading MSME details...
          </p>
        </div>
      </div>
    );
  }

  if (!MSME) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4 text-center">
        <div className="rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <ExternalLink className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-800">
            MSME Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            The business you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/admin/guest-view">
            <Button className="bg-gradient-to-r from-amber-600 to-[#8B4513] text-white shadow-lg hover:from-amber-700 hover:to-[#6B3513]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to MSMEs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pb-6 pt-3 md:pb-12 md:pt-6">
      <div className="container mx-auto px-3 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3 flex items-center justify-between md:mb-6">
            <Link
              href="/admin/guest-view"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-amber-800 shadow-lg backdrop-blur-sm transition-all hover:bg-amber-600 hover:text-white hover:shadow-xl md:px-6 md:py-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to MSMEs
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl bg-white/90 shadow-2xl backdrop-blur-sm md:rounded-2xl">
            <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-[#8B4513] px-4 py-6 text-white md:px-8 md:py-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex flex-col items-center gap-3 md:flex-row md:items-start md:gap-6">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl border-4 border-white/30 shadow-2xl md:h-24 md:w-24 lg:h-32 lg:w-32">
                  <Image
                    src={MSME.companyLogo || "/no_image_placeholder.jpg"}
                    alt={`${MSME.companyName} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <Badge
                    className="mb-2 border border-white/30 bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm md:px-4 md:text-sm"
                    style={getSectorBadgeStyle(
                      MSME.sectorName || "Uncategorized",
                    )}
                  >
                    {MSME.sectorName || "Uncategorized"}
                  </Badge>
                  <h1 className="mb-2 text-xl font-bold md:mb-3 md:text-3xl lg:text-4xl">
                    {MSME.companyName}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start md:gap-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-200 md:h-4 md:w-4" />
                      <span className="text-xs font-medium text-amber-100">
                        {MSME.cityMunicipalityAddress}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-amber-200 md:h-4 md:w-4" />
                      <span className="text-xs font-medium text-amber-100">
                        Est. {MSME.yearEstablished}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-3 md:grid-cols-[2fr_1fr] md:gap-6 md:p-6">
              <div className="space-y-3 md:space-y-6">
                {MSME.productGallery && MSME.productGallery.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 p-3 shadow-lg md:p-4">
                    <h2 className="mb-2 text-base font-bold text-[#8B4513] md:mb-3 md:text-lg">
                      Product Gallery
                    </h2>
                    <div className="relative">
                      <Carousel
                        setApi={setApi}
                        className="w-full"
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                      >
                        <CarouselContent>
                          {MSME.productGallery.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-amber-50 shadow-inner">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`${MSME.companyName} product ${index + 1}`}
                                  fill
                                  className="object-contain"
                                  priority={index === 0}
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>

                        {MSME.productGallery.length > 1 && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute left-2 top-1/2 z-10 h-7 w-7 -translate-y-1/2 rounded-full border-2 border-amber-200 bg-white/95 text-amber-800 shadow-xl transition-all hover:border-amber-600 hover:bg-amber-600 hover:text-white md:h-10 md:w-10"
                              onClick={() => api?.scrollPrev()}
                              aria-label="Previous image"
                            >
                              <ArrowLeft className="h-3 w-3 md:h-5 md:w-5" />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute right-2 top-1/2 z-10 h-7 w-7 -translate-y-1/2 rounded-full border-2 border-amber-200 bg-white/95 text-amber-800 shadow-xl transition-all hover:border-amber-600 hover:bg-amber-600 hover:text-white md:h-10 md:w-10"
                              onClick={() => api?.scrollNext()}
                              aria-label="Next image"
                            >
                              <ArrowRight className="h-3 w-3 md:h-5 md:w-5" />
                            </Button>
                          </>
                        )}
                      </Carousel>
                    </div>
                    <div className="mt-2 flex items-center justify-between md:mt-3">
                      <div className="text-xs font-medium text-gray-600">
                        {current} of {count}
                      </div>
                      <div className="flex gap-1">
                        {MSME.productGallery.map((_, index) => (
                          <button
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 md:h-2 ${
                              current === index + 1
                                ? "w-4 bg-amber-600 shadow-md md:w-6"
                                : "w-1.5 bg-amber-200 hover:bg-amber-300 md:w-2"
                            }`}
                            onClick={() => api?.scrollTo(index)}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 shadow-lg">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-amber-50">
                      <Image
                        src="/no_image_placeholder.jpg"
                        alt={MSME.companyName}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 p-3 shadow-lg md:p-4">
                  <h2 className="mb-2 text-base font-bold text-[#8B4513] md:mb-3 md:text-lg">
                    About the Business
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {MSME.companyDescription || "No description available."}
                  </p>
                </div>

                {MSME.majorProductLines &&
                  MSME.majorProductLines.length > 0 && (
                    <div className="rounded-xl border border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 p-3 shadow-lg md:p-4">
                      <h2 className="mb-2 text-base font-bold text-[#8B4513] md:mb-3 md:text-lg">
                        Major Product Lines
                      </h2>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {MSME.majorProductLines.map((line, index) => (
                          <Badge
                            key={index}
                            className="border border-amber-200/50 bg-gradient-to-r from-amber-100 to-orange-100 px-2 py-1 text-xs font-medium text-amber-800 shadow-sm transition-all hover:from-amber-200 hover:to-orange-200 md:px-3"
                          >
                            {line}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="rounded-xl border border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 p-3 shadow-lg md:p-4">
                  <h3 className="mb-3 text-base font-bold text-[#8B4513] md:text-lg">
                    Contact Information
                  </h3>
                  <div className="space-y-2.5 md:space-y-3">
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 shadow-sm md:h-8 md:w-8">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-800">
                          Address
                        </p>
                        <p className="break-words text-xs leading-relaxed text-gray-600">
                          {fullAddress || "Address not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 md:gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 shadow-sm md:h-8 md:w-8">
                        <Phone className="h-3 w-3 md:h-4 md:w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800">
                          Phone
                        </p>
                        <p className="text-xs text-gray-600">
                          {MSME.contactNumber
                            ? `+63 ${MSME.contactNumber}`
                            : "Phone not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 md:gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 shadow-sm md:h-8 md:w-8">
                        <User className="h-3 w-3 md:h-4 md:w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800">
                          Contact Person
                        </p>
                        <p className="text-xs text-gray-600">
                          {MSME.contactPerson || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {MSME.email && (
                      <div className="flex items-start gap-2.5 md:gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 shadow-sm md:h-8 md:w-8">
                          <Mail className="h-3 w-3 md:h-4 md:w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-800">
                            Email
                          </p>
                          <a
                            href={`mailto:${MSME.email}`}
                            className="break-all text-xs text-amber-600 transition-colors hover:text-amber-700 hover:underline"
                          >
                            {MSME.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {MSME.latitude && MSME.longitude && isLoaded && (
                  <div className="rounded-xl border border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 p-3 shadow-lg md:p-4">
                    <h3 className="mb-2 text-base font-bold text-[#8B4513] md:text-lg">
                      Location
                    </h3>
                    <div className="overflow-hidden rounded-lg shadow-lg">
                      <GoogleMap
                        mapContainerStyle={{
                          width: "100%",
                          height: "150px",
                        }}
                        center={mapCenter}
                        zoom={12}
                        options={{
                          styles: [
                            {
                              featureType: "poi",
                              elementType: "labels",
                              stylers: [{ visibility: "off" }],
                            },
                          ],
                        }}
                      >
                        {mapCenter && <Marker position={mapCenter} />}
                      </GoogleMap>
                    </div>
                    <div className="mt-2">
                      <a
                        href={`https://www.google.com/maps?q=${MSME.latitude},${MSME.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-md transition-all hover:from-amber-700 hover:to-orange-700 md:px-3 md:py-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View in Google Maps
                      </a>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 p-3 shadow-lg md:p-4">
                  <h3 className="mb-3 text-base font-bold text-[#8B4513] md:text-lg">
                    Social Media
                  </h3>
                  {MSME.facebookPage || MSME.instagramPage ? (
                    <div className="flex flex-col gap-1.5 md:gap-2">
                      {MSME.facebookPage && (
                        <a
                          href={MSME.facebookPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200/50 bg-gradient-to-r from-blue-50 to-blue-100 px-2.5 py-1.5 text-xs font-medium text-blue-600 shadow-sm transition-all hover:from-blue-100 hover:to-blue-200 md:px-3 md:py-2"
                        >
                          <Facebook className="h-3 w-3 md:h-4 md:w-4" />
                          <span>Follow on Facebook</span>
                          <ExternalLink className="ml-auto h-2.5 w-2.5 md:h-3 md:w-3" />
                        </a>
                      )}
                      {MSME.instagramPage && (
                        <a
                          href={MSME.instagramPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-pink-200/50 bg-gradient-to-r from-pink-50 to-rose-100 px-2.5 py-1.5 text-xs font-medium text-pink-600 shadow-sm transition-all hover:from-pink-100 hover:to-rose-200 md:px-3 md:py-2"
                        >
                          <Instagram className="h-3 w-3 md:h-4 md:w-4" />
                          <span>Follow on Instagram</span>
                          <ExternalLink className="ml-auto h-2.5 w-2.5 md:h-3 md:w-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="py-2 text-center">
                      <div className="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 md:h-10 md:w-10">
                        <Instagram className="h-4 w-4 text-gray-400 md:h-5 md:w-5" />
                      </div>
                      <p className="text-xs text-gray-500">
                        No social media links available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

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
  Star,
  User,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

import type { CarouselApi } from "@/components/ui/carousel";
import type { MSMEWithSectorName } from "@/types/MSME";

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
        if (!msmeResponse.ok) throw new Error("Failed to fetch MSME");
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

  const fullAddress = MSME
    ? `${MSME.barangayAddress || ""}, ${MSME.cityMunicipalityAddress || ""}, ${MSME.provinceAddress || ""}`
        .replace(/^,\s*/, "")
        .replace(/,\s*,/g, ",")
    : "";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white p-8 shadow-lg">
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50 px-4 text-center">
        <div className="rounded-xl bg-white p-8 shadow-lg">
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
          <Link href="/guest">
            <Button className="bg-gradient-to-r from-amber-600 to-[#8B4513] text-white hover:from-amber-700 hover:to-[#6B3513]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to MSMEs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-16 pt-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/guest"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-amber-800 shadow-sm transition-all hover:bg-amber-600 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to MSMEs
            </Link>

            {/* honestly a good suggestion */}
            {/* <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-amber-200 bg-white text-amber-600 hover:bg-amber-600 hover:text-white"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-amber-600" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-amber-200 bg-white text-amber-600 hover:bg-amber-600 hover:text-white"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div> */}
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="relative bg-gradient-to-r from-amber-600 to-[#8B4513] px-6 py-8 text-white md:px-8">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                <div className="relative h-24 w-24 overflow-hidden rounded-xl border-4 border-white/30 shadow-lg md:h-32 md:w-32">
                  <Image
                    src={MSME.companyLogo || "/no_image_placeholder.jpg"}
                    alt={`${MSME.companyName} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <Badge className="mb-2 bg-white/20 text-white backdrop-blur-sm">
                    {MSME.sectorName || "Uncategorized"}
                  </Badge>
                  <h1 className="mb-2 text-3xl font-bold">
                    {MSME.companyName}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-amber-200" />
                      <span className="text-sm text-amber-100">
                        {MSME.cityMunicipalityAddress}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-200" />
                      <span className="text-sm text-amber-100">
                        Featured Business
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[2fr_1fr] md:p-8">
              <div className="space-y-8">
                {MSME.productGallery && MSME.productGallery.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
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
                              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-amber-50">
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
                              className="absolute left-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border-2 border-amber-200 bg-white/90 text-amber-800 shadow-md hover:bg-amber-600 hover:text-white"
                              onClick={() => api?.scrollPrev()}
                              aria-label="Previous image"
                            >
                              <ArrowLeft className="h-5 w-5" />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute right-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border-2 border-amber-200 bg-white/90 text-amber-800 shadow-md hover:bg-amber-600 hover:text-white"
                              onClick={() => api?.scrollNext()}
                              aria-label="Next image"
                            >
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          </>
                        )}
                      </Carousel>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Image {current} of {count}
                      </div>
                      <div className="flex gap-1">
                        {MSME.productGallery.map((_, index) => (
                          <button
                            key={index}
                            className={`h-2 rounded-full transition-all ${
                              current === index + 1
                                ? "w-6 bg-amber-600"
                                : "w-2 bg-amber-200"
                            }`}
                            onClick={() => api?.scrollTo(index)}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-amber-100 bg-white shadow-sm">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-amber-50">
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

                <div className="rounded-xl border border-amber-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-bold text-[#8B4513]">
                    About the Business
                  </h2>
                  <p className="leading-relaxed text-gray-700">
                    {MSME.companyDescription || "No description available."}
                  </p>
                </div>

                {MSME.majorProductLines &&
                  MSME.majorProductLines.length > 0 && (
                    <div className="rounded-xl border border-amber-100 bg-white p-6 shadow-sm">
                      <h2 className="mb-4 text-xl font-bold text-[#8B4513]">
                        Major Product Lines
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {MSME.majorProductLines.map((line, index) => (
                          <Badge
                            key={index}
                            className="bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 hover:bg-amber-200"
                          >
                            {line}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-amber-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-[#8B4513]">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Address
                        </p>
                        <p className="text-sm text-gray-600">
                          {fullAddress || "Address not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Phone
                        </p>
                        <p className="text-sm text-gray-600">
                          {MSME.contactNumber || "Phone not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Contact Person
                        </p>
                        <p className="text-sm text-gray-600">
                          {MSME.contactPerson || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {MSME.email && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Email
                          </p>
                          <a
                            href={`mailto:${MSME.email}`}
                            className="text-sm text-amber-600 hover:underline"
                          >
                            {MSME.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {MSME.latitude && MSME.longitude && isLoaded && (
                  <div className="container mx-auto p-4">
                    <GoogleMap
                      mapContainerStyle={{
                        width: "100%",
                        height: "400px",
                      }}
                      center={mapCenter}
                      zoom={12}
                    >
                      {mapCenter && <Marker position={mapCenter} />}
                    </GoogleMap>
                    <div className="mt-2">
                      <a
                        href={`https://www.google.com/maps?q=${MSME.latitude},${MSME.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        <p className="font-bold text-[#8B4513]">
                          View in Google Maps
                        </p>
                      </a>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-amber-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-[#8B4513]">
                    Social Media
                  </h3>
                  {MSME.facebookPage || MSME.instagramPage ? (
                    <div className="flex flex-wrap gap-3">
                      {MSME.facebookPage && (
                        <a
                          href={MSME.facebookPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          <Facebook className="h-4 w-4" />
                          Facebook
                        </a>
                      )}
                      {MSME.instagramPage && (
                        <a
                          href={MSME.instagramPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-100"
                        >
                          <Instagram className="h-4 w-4" />
                          Instagram
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No social media links available
                    </p>
                  )}
                </div>

                {/* is this needed? */}
                <div className="rounded-xl border border-amber-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#8B4513]">
                      Business Hours
                    </h3>
                    <Badge className="bg-green-100 text-green-800">
                      Open Now
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Monday - Friday</span>
                      <span>8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Saturday</span>
                      <span>9:00 AM - 3:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Sunday</span>
                      <span className="text-gray-500">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

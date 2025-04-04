"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Facebook, Instagram } from "lucide-react";
import type { MSME } from "@/types/MSME";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import MapComponent from "@/components/map/MapComponent";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import type { MSMEWithSectorName } from "@/types/MSME";

export default function MSMEPage({ params }: { params: { id: string } }) {
  const [MSME, setMSME] = useState<MSMEWithSectorName>();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const addVisitorCount = async () => {
      const msmeId = MSME?.id;
      console.log("MSME id: ", msmeId);
      if (!msmeId) return;
      const response = await fetch("/api/admin/visitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ msmeId }),
      });
      console.log("Response: ", response);
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
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMSME().catch(() => router.push("Failed to fetch MSME"));
  }, [params.id, router]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Combine address fields
  const fullAddress = `${MSME?.barangayAddress}, ${MSME?.cityMunicipalityAddress}, ${MSME?.provinceAddress}`;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!MSME) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>MSME not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/guest"
          className="ml-6 inline-flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MSMEs
        </Link>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <header>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200">
                <Image
                  src={MSME.companyLogo || "/no_image_placeholder.jpg"}
                  alt={`${MSME.companyName} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{MSME.companyName}</h1>
                <p className="text-sm text-muted-foreground">
                  {MSME.cityMunicipalityAddress}
                </p>
              </div>
            </div>
          </header>

          <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
            <div className="grid gap-6">
              {MSME.productGallery && MSME.productGallery.length > 0 ? (
                <div className="relative p-20">
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
                        <CarouselItem key={index} className="relative">
                          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
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
                        <div className="absolute left-4 right-4 top-1/2 flex -translate-y-1/2 justify-between">
                          <CarouselPrevious className="relative translate-y-0" />
                          <CarouselNext className="relative translate-y-0" />
                        </div>
                        <div className="mt-2 flex justify-center gap-2">
                          {MSME.productGallery.map((_, index) => (
                            <button
                              key={index}
                              className={`h-2 w-2 rounded-full transition-all ${
                                current === index + 1
                                  ? "w-4 bg-primary"
                                  : "bg-muted"
                              }`}
                              onClick={() => api?.scrollTo(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </Carousel>
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    Image {current} of {count}
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src="/no_image_placeholder.jpg"
                    alt={MSME.companyName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div>
                <Badge variant="secondary" className="mb-2">
                  {MSME.sectorName || "Uncategorized"}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {MSME.companyDescription}
                </p>
              </div>

              {MSME.majorProductLines && MSME.majorProductLines.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold">Major Product Lines</h3>
                  <div className="flex flex-wrap gap-2">
                    {MSME.majorProductLines.map((line, index) => (
                      <Badge key={index} variant="outline">
                        {line}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 font-semibold">Contact Information</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{fullAddress}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{MSME.contactNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-muted-foreground">👤</span>
                    <span>{MSME.contactPerson}</span>
                  </div>
                </div>
              </div>

              {MSME.latitude && MSME.longitude && (
                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 font-semibold">Location</h3>
                  <div className="h-[250px] w-full overflow-hidden rounded-md">
                    <MapComponent
                      latitude={MSME.latitude}
                      longitude={MSME.longitude}
                    />
                  </div>
                  <div className="mt-2">
                    <a
                      href={`https://www.google.com/maps?q=${MSME.latitude},${MSME.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View in Google Maps
                    </a>
                  </div>
                </div>
              )}
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 font-semibold">Social Media</h3>
                <div className="flex space-x-4">
                  {MSME.facebookPage && (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={MSME.facebookPage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-4 w-4 text-blue-600" />
                      </a>
                    </Button>
                  )}
                  {MSME.instagramPage && (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={MSME.instagramPage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-4 w-4 text-pink-600" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

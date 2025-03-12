"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Separator } from "@/components/ui/separator";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Spinner } from "@/components/ui/spinner";

interface PageProps {
  params: {
    id: string;
  };
}

interface MSMEWithSectorName extends MSME {
  sectorName: string | null;
}

export default function MSMEPage({ params }: PageProps) {
  const router = useRouter();
  const [MSME, setMSME] = useState<MSMEWithSectorName | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load MSME data directly from API
  useEffect(() => {
    const fetchMSME = async () => {
      setIsLoading(true);
      try {
        // Fetch MSME data
        const msmeResponse = await fetch(`/api/msme/${params.id}`);
        if (!msmeResponse.ok) {
          throw new Error(`HTTP error! status: ${msmeResponse.status}`);
        }
        const msmeData = await msmeResponse.json();
        setMSME(msmeData);
      } catch (error) {
        console.error("Error fetching MSME:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMSME();
  }, [params.id, router]);

  console.log("MSME", MSME);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

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

  const markerCoords =
    MSME.latitude && MSME.longitude
      ? {
          lat: MSME.latitude,
          lng: MSME.longitude,
        }
      : null;

  const fullAddress = `${MSME.barangayAddress}, ${MSME.cityMunicipalityAddress}, ${MSME.provinceAddress}`;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-[#8B4513] py-6">
        <div className="container mx-auto max-w-3xl px-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-white hover:bg-[#bb987a]"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to MSMEs</span>
          </Button>
          <h1 className="mt-2 text-2xl font-bold text-white">
            {MSME.companyName}
          </h1>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <div className="grid gap-8">
            <Carousel className="mx-auto w-full max-w-md">
              <CarouselContent>
                {!MSME.productGallery || MSME.productGallery.length === 0 ? (
                  <CarouselItem>
                    <div className="relative aspect-square">
                      <Image
                        src={`${MSME.productGallery?.[0] ?? "/placeholder.png"}`}
                        alt={MSME.companyName}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  </CarouselItem>
                ) : (
                  MSME.productGallery.map((image: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square">
                        <Image
                          src={`/${image}`}
                          alt={`${MSME.companyName} product ${index + 1}`}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious className="text-[#8B4513] hover:bg-[#bb987a] hover:text-white" />
              <CarouselNext className="text-[#8B4513] hover:bg-[#bb987a] hover:text-white" />
            </Carousel>

            <div>
              <Badge
                variant="secondary"
                className="mb-2 bg-[#bb987a] text-white"
              >
                {MSME.sectorName || "Uncategorized"}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {MSME.companyDescription}
              </p>
            </div>

            <Separator className="bg-[#bb987a]/20" />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-3 text-sm">
                <h3 className="text-lg font-semibold text-[#8B4513]">
                  Contact Information
                </h3>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-[#8B4513]" />
                  <span>{fullAddress}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-[#8B4513]" />
                  <span>{MSME.contactNumber}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-[#8B4513]">👤</span>
                  <span>{MSME.contactPerson}</span>
                </div>
              </div>

              {markerCoords && isLoaded && (
                <div className="h-60 w-full overflow-hidden rounded-md">
                  <GoogleMap
                    mapContainerStyle={{
                      width: "100%",
                      height: "100%",
                    }}
                    center={markerCoords}
                    zoom={15}
                  >
                    <Marker position={markerCoords} />
                  </GoogleMap>
                </div>
              )}
            </div>

            {MSME.majorProductLines && MSME.majorProductLines.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#8B4513]">
                  Major Product Lines
                </h3>
                <div className="flex flex-wrap gap-2">
                  {MSME.majorProductLines.map((line: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-[#8B4513] text-[#8B4513]"
                    >
                      {line}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-[#bb987a]/20" />

            <div>
              <h3 className="mb-3 text-lg font-semibold text-[#8B4513]">
                Social Media
              </h3>
              <div className="flex gap-4">
                {MSME.facebookPage && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="border-[#8B4513] hover:bg-[#bb987a] hover:text-white"
                  >
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
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="border-[#8B4513] hover:bg-[#bb987a] hover:text-white"
                  >
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
      <Footer />
    </div>
  );
}

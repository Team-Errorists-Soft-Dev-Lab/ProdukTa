import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Facebook, Instagram } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MapComponent from "@/components/map/MapComponent";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import type { MSMEModalProps } from "@/types/MSME";

export default function MSMEModal({ MSME, sectorName }: MSMEModalProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Combine address fields
  const fullAddress = `${MSME.barangayAddress}, ${MSME.cityMunicipalityAddress}, ${MSME.provinceAddress}`;
  //console.log("MSME: ", MSME);

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
      <ScrollArea className="h-full">
        <div className="p-6">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-gray-200">
                <Image
                  src={MSME.companyLogo || "/no_image_placeholder.jpg"}
                  alt={`${MSME.companyName} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <DialogTitle className="flex items-center text-lg font-semibold">
                  {MSME.companyName}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {MSME.cityMunicipalityAddress}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 grid gap-6">
            {MSME.productGallery && MSME.productGallery.length > 0 ? (
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
                      <CarouselItem key={index} className="relative">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                          <Image
                            src={image}
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
                {sectorName || "Uncategorized"}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {MSME.companyDescription}
              </p>
            </div>

            <Separator />

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="grid flex-grow gap-2 text-sm">
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
              {MSME.latitude && MSME.longitude && (
                <div className="h-10 w-full md:h-40 md:w-40">
                  <MapComponent
                    latitude={MSME.latitude}
                    longitude={MSME.longitude}
                  />
                  <div>
                    <a
                      href={`https://www.google.com/maps?q=${MSME.latitude},${MSME.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-40 w-full md:w-40"
                    >
                      View in Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {MSME.majorProductLines && MSME.majorProductLines.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold">Major Product Lines</h3>
                <div className="flex flex-wrap gap-2">
                  {MSME.majorProductLines.map((line: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {line}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />
            <div className="flex justify-center space-x-4">
              {MSME.facebookPage && (
                <div>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={MSME.facebookPage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="h-4 w-4 text-blue-600" />
                    </a>
                  </Button>
                </div>
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
      </ScrollArea>
    </DialogContent>
  );
}

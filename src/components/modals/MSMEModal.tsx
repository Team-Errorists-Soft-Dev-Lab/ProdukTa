import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Separator } from "@/components/ui/separator";

interface MSMEModalProps {
  MSME: MSME;
  sectorName: string;
}

interface MSMEWithSectorNames extends MSME {
  sectorName: string;
}

export default function MSMEModal({ MSME, sectorName }: MSMEModalProps) {
  // Combine address fields
  const fullAddress = `${MSME.barangayAddress}, ${MSME.cityMunicipalityAddress}, ${MSME.provinceAddress}`;

  return (
    <DialogContent className="h-[90vh] p-0 sm:max-w-[600px]">
      <ScrollArea className="h-full">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg font-semibold">
              <ArrowLeft className="mr-2 h-5 w-5" />
              {MSME.companyName}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid gap-6">
            <Carousel className="mx-auto w-full max-w-xs">
              <CarouselContent>
                {!MSME.productGallery || MSME.productGallery.length === 0 ? (
                  <CarouselItem>
                    <div className="relative aspect-square">
                      <Image
                        src={`/${MSME.productGallery?.[0] ?? "/placeholder.jpg"}`}
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
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <div>
              <Badge variant="secondary" className="mb-2">
                {sectorName || "Uncategorized"}{" "}
                {/* this is suppoesd to be sector name */}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {MSME.companyDescription}
              </p>
            </div>

            <Separator />

            <div className="grid gap-4 text-sm">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{MSME.barangayAddress}</span>
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
      </ScrollArea>
    </DialogContent>
  );
}

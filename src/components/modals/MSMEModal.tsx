import { useState } from "react";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { MSME } from "@/types/MSME";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function MSMEModal({ MSME }: { MSME: MSME }) {
  return (
    <DialogContent className="overflow-y-auto sm:max-h-[500px] sm:max-w-[600px]">
      <DialogTitle className="flex items-center text-base">
        <ArrowLeft className="mr-2" />
        Back
      </DialogTitle>
      <div className="grid gap-3 p-10">
        <Carousel>
          <CarouselContent>
            {MSME.productGallery.length === 0 ? (
              <CarouselItem>
                <Image
                  src={"/placeholder.png"}
                  alt={MSME.name}
                  width={300}
                  height={300}
                  className="h-[300px] w-full rounded-md object-cover"
                />
              </CarouselItem>
            ) : (
              MSME.productGallery.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={image}
                    alt={MSME.name}
                    width={300}
                    height={300}
                    className="h-[300px] w-full rounded-md object-cover"
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div>
          <h2 className="text-lg font-semibold">{MSME.name}</h2>
          <p className="text-sm text-gray-500">{MSME.category}</p>
        </div>
        <div>
          <h3 className="font-semibold">Description</h3>
          <p className="text-sm">{MSME.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Contact Person:</h3>
            <p className="flex items-center text-sm">
              <span className="mr-2">👤</span>
              {MSME.contactPerson}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Address:</h3>
            <p className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4" />
              {MSME.address}
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Contact Number:</h3>
          <p className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4" />
            {MSME.contactNumber}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Major Product Lines:</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {MSME.majorProductLines.map((line, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs"
              >
                {line}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <FacebookIcon className="h-6 w-6 text-blue-600" />
          <InstagramIcon className="h-6 w-6 text-pink-600" />
          <YouTubeIcon className="h-6 w-6 text-red-600" />
        </div>
      </div>
    </DialogContent>
  );
}

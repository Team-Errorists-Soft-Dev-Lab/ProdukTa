import { useState } from "react";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
} from "lucide-react";
import { Facebook, Instagram, Youtube } from "lucide-react"; // replace this later with simpleicons
import { Product } from "../../../mock_data/dummyData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ProductModal({ product }: { product: Product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.productGallery.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.productGallery.length - 1 : prevIndex - 1,
    );
  };

  return (
    <DialogContent className="overflow-y-auto sm:max-h-[500px] sm:max-w-[800px]">
      <DialogTitle className="flex items-center text-base">
        <ArrowLeft className="mr-2" />
        Back
      </DialogTitle>
      <div className="grid gap-3 p-10">
        <Carousel>
          <CarouselContent>
            {product.productGallery.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="h-[400px] w-full rounded-md object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        {/* <div className="relative">
          <Image
            src={`${product.productGallery[currentImageIndex]}`}
            alt={product.name}
            width={100}
            height={100}
            className="h-[300px] w-full rounded-md object-cover"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 transform"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div> */}
        <div>
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <div>
          <h3 className="font-semibold">Description</h3>
          <p className="text-sm">{product.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Contact Person:</h3>
            <p className="flex items-center text-sm">
              <span className="mr-2">👤</span>
              {product.contactPerson}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Address:</h3>
            <p className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4" />
              {product.address}
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Contact Number:</h3>
          <p className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4" />
            {product.contactNumber}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Major Product Lines:</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.majorProductLines.map((line, index) => (
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
          <Facebook className="h-6 w-6 text-blue-600" />
          <Instagram className="h-6 w-6 text-pink-600" />
          <Youtube className="h-6 w-6 text-red-600" />
        </div>
      </div>
    </DialogContent>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type MSMEWithSectorName } from "@/types/MSME";

interface MSMEListProps {
  msmes: MSMEWithSectorName[];
}

export default function MSMEList({ msmes }: MSMEListProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {msmes.length > 0 ? (
        msmes.map((msme) => (
          <Dialog key={msme.id}>
            <Link href={`/msme/${msme.id}`} passHref>
              <DialogTrigger asChild>
                <Card className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:shadow-amber-100/50">
                  <CardHeader className="relative p-0">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent" />
                    <Image
                      src={`${msme.productGallery?.[0] ?? "/placeholder-image.png"}`}
                      alt={msme.companyName}
                      width={400}
                      height={240}
                      className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {msme.companyLogo && (
                      <Image
                        src={`${msme.companyLogo ?? "/no_image_placeholder.jpg"}`}
                        alt={msme.companyName}
                        width={56}
                        height={56}
                        className="absolute bottom-4 right-4 z-20 h-14 w-14 rounded-full border-2 border-white object-cover shadow-md"
                      />
                    )}
                    <Badge className="absolute bottom-4 left-4 z-20 bg-amber-600/90 hover:bg-amber-600">
                      {msme.sectorName}
                    </Badge>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="flex-1">
                      <CardTitle className="mb-3 text-xl font-semibold text-gray-800">
                        {msme.companyName}
                      </CardTitle>
                      <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                        {msme.companyDescription}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-medium text-amber-800">
                        {msme.cityMunicipalityAddress}
                      </span>
                      <Button
                        variant="link"
                        className="h-auto p-0 font-medium text-amber-700 hover:text-amber-800"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Link>
          </Dialog>
        ))
      ) : (
        <div className="col-span-3 py-12 text-center">
          <p className="text-lg text-gray-500">No MSMEs found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search filters
          </p>
        </div>
      )}
    </div>
  );
}

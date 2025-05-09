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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {msmes.length > 0 ? (
        msmes.map((msme) => (
          <Dialog key={msme.id}>
            <Link href={`/msme/${msme.id}`} passHref>
              <DialogTrigger asChild>
                <Card className="flex min-h-[400px] cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-md">
                  <CardHeader className="p-0">
                    <Image
                      src={`${msme.productGallery?.[0] ?? "/placeholder.png"}`}
                      alt={msme.companyName}
                      width={400}
                      height={200}
                      className="h-48 w-full object-cover"
                    />
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col p-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-[#8B4513]">
                          {msme.companyName}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {msme.sectorName}
                        </Badge>
                      </div>
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                        {msme.companyDescription}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-sm">
                      <span className="max-w-[150px] truncate text-gray-500">
                        {msme.cityMunicipalityAddress}
                      </span>
                      <Button
                        variant="link"
                        className="h-auto p-0 font-normal text-[#8B4513]"
                      >
                        View Details
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Link>
          </Dialog>
        ))
      ) : (
        <p className="col-span-3 text-center text-gray-500">No results found</p>
      )}
    </div>
  );
}

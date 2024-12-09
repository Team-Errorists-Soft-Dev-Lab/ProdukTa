"use client";

import { msmeLines, sectors } from "mock_data/dummyData";
import type { MSME } from "@/types/MSME";
import React, { useState } from "react";
import MSMEModal from "@/components/modals/MSMEModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Search, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function GuestPage() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("name");
  const [searchResult, setSearchResult] = useState<MSME[]>(msmeLines);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchMSME = (query: string) => {
    setSearchResult(
      msmeLines.filter((msme) =>
        msme.name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

  const sortMSMEs = (MSMEs: MSME[], sortType: string) => {
    switch (sortType) {
      case "name":
        return [...MSMEs].sort((a, b) => a.name.localeCompare(b.name));
      case "sector":
        return [...MSMEs].sort((a, b) => a.category.localeCompare(b.category));
      case "municipality":
        return [...MSMEs].sort((a, b) => a.address.localeCompare(b.address));
      default:
        return MSMEs;
    }
  };

  const filteredMSME = selectedSector
    ? msmeLines.filter((msme) => msme.category === selectedSector)
    : msmeLines;

  const displayedMSME = searchQuery
    ? searchResult
    : sortMSMEs(filteredMSME, sort);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query) {
      searchMSME(query);
    } else {
      setSearchResult(msmeLines);
    }
  };

  const handleSectorChange = (sector: string) => {
    if (sector === "All") {
      setSelectedSector(null);
    } else {
      setSelectedSector(sector);
    }
    setSearchQuery("");
    setSearchResult(msmeLines);
  };

  const handleSortChange = (sortType: string) => {
    setSort(sortType);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-[#8B4513] p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-center text-4xl font-bold text-white">
            Discover Local MSMEs
          </h1>
          <p className="mb-8 text-center text-lg text-white">
            A curated collection of the best local micro, small, and medium
            enterprises. Support local businesses hand-picked for you.
          </p>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative w-full flex-1 sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
              <Input
                onChange={handleSearch}
                type="text"
                placeholder="Search MSMEs..."
                className="w-full bg-white pl-10 text-[#8B4513]"
              />
            </div>
            <div className="mt-4 flex w-full gap-4 sm:mt-0 sm:w-auto">
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="w-full bg-white text-[#8B4513] sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="sector">Sector</SelectItem>
                  <SelectItem value="municipality">Municipality</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={handleSectorChange}>
                <SelectTrigger className="w-full bg-white text-[#8B4513] sm:w-[180px]">
                  <SelectValue placeholder="All sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Sectors</SelectItem>
                  {sectors.slice(1).map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </main>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedMSME.length > 0 ? (
            displayedMSME.map((msme) => (
              <Dialog key={msme.id}>
                <DialogTrigger asChild>
                  <Card className="flex min-h-[400px] cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-md">
                    <CardHeader className="p-0">
                      <Image
                        src={msme.productGallery[0] ?? "/placeholder.png"}
                        alt={msme.name}
                        width={400}
                        height={200}
                        className="h-48 w-full object-cover"
                      />
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col p-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-[#8B4513]">
                            {msme.name}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {msme.category}
                          </Badge>
                        </div>
                        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                          {msme.description}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between text-sm">
                        <span className="max-w-[150px] truncate text-gray-500">
                          {msme.address}
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
                <MSMEModal MSME={msme} />
              </Dialog>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              No results found
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

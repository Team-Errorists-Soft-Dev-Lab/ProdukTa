"use client";

import { products, Product, sectors } from "mock_data/dummyData";
import React, { useState } from "react";
import ProductModal from "@/components/modals/ProductModal";
import MunicipalitiesModal from "@/components/modals/MunicipalitiesModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Search, ChevronLeft, ChevronRight, Settings } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function GuestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("name");
  const [searchResult, setSearchResult] = useState<Product[]>([]);
  const productsPerPage = 9;

  const searchProduct = (query: string) => {
    setSearchResult(
      products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const sortProducts = (products: Product[], sort: string) => {
    switch (sort) {
      case "name":
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case "sector":
        return products.sort((a, b) => a.category.localeCompare(b.category));
      case "municipality":
        return products.sort((a, b) => a.address.localeCompare(b.address));
      default:
        return products;
    }
  };

  const filteredProducts = selectedSector
    ? products.filter((product) => product.category === selectedSector)
    : products;

  const displayedProducts = searchResult.length > 0
    ? searchResult
    : sortProducts(filteredProducts, sort).slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    if (query) {
      searchProduct(query);
    } else {
      setSearchResult([]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSectorChange = (sector: string) => {
    if (sector === "All") {
      setSelectedSector(null);
      setCurrentPage(1);
    } else {
      setSelectedSector(sector);
      setCurrentPage(1);
    }
  };

  const handleSortChange = (sort: string) => {
    setSort(sort);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-[#8B4513] p-8">
        <h1 className="mb-6 text-center text-4xl font-bold text-white">
          Discover Local MSMEs
        </h1>
        <div className="relative mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <Input
              onChange={handleSearch}
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-12"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <MunicipalitiesModal />
            </Dialog>
          </div>
        </div>
      </main>

      <nav className="flex justify-center space-x-4 overflow-x-auto bg-white p-4">
        {sectors.map((category) => (
          <Button
            key={category}
            variant={selectedSector === category ? "default" : "outline"}
            className={`${
              selectedSector === category
                ? "bg-[#8B4513] text-white"
                : "bg-[#DEB887] text-[#8B4513]"
            } hover:bg-[#8B4513] hover:text-white`}
            onClick={() => handleSectorChange(category)}
          >
            {category}
          </Button>
        ))}
      </nav>

      <div className="flex justify-end p-4">
        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="sector">Sector</SelectItem>
            <SelectItem value="municipality">Municipality</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 p-12 md:grid-cols-2 lg:grid-cols-3">
        {displayedProducts.map((product) => (
          <Dialog key={product.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer border-[#DEB887] transition-shadow hover:shadow-lg">
                <CardHeader className="p-0">
                  <Image
                    src={`${product.productGallery[0]}`}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <span className="text-sm uppercase text-gray-500">
                    {product.category}
                  </span>
                  <CardTitle className="mt-2 text-xl font-semibold text-[#8B4513]">
                    {product.name}
                  </CardTitle>
                  <p className="mt-2 text-gray-600">
                    {product.description.substring(0, 100)}...
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#CD853F] text-white hover:bg-[#8B4513]">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </DialogTrigger>
            <ProductModal product={product} />
          </Dialog>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="text-[#8B4513]"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                className={
                  page === currentPage
                    ? "bg-[#CD853F] text-white"
                    : "text-[#8B4513]"
                }
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink
              href="#"
              className="text-[#8B4513]"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Footer />
    </div>
  );
}